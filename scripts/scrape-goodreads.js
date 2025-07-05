#!/usr/bin/env node

import axios from 'axios'
import { parseString } from 'xml2js'
import { config } from 'dotenv'
import Database from 'better-sqlite3'
import { resolve } from 'path'

// Load environment variables
config()

const GOODREADS_USER_ID = process.env.GOODREADS_USER_ID
const GOODREADS_API_KEY = process.env.GOODREADS_API_KEY

if (!GOODREADS_USER_ID || !GOODREADS_API_KEY) {
  console.error('❌ Missing required environment variables:')
  if (!GOODREADS_USER_ID) console.error('  - GOODREADS_USER_ID')
  if (!GOODREADS_API_KEY) console.error('  - GOODREADS_API_KEY')
  process.exit(1)
}

// Initialize database
const dbPath = resolve(process.cwd(), 'data', 'books.db')
const db = new Database(dbPath)

// Prepare database statements
const insertBookStmt = db.prepare(`
  INSERT OR REPLACE INTO books (goodreads_id, title, author, isbn, image_url, description, pages, publication_year)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`)

const insertReviewStmt = db.prepare(`
  INSERT OR REPLACE INTO reviews (book_id, shelf, rating, review, date_added, date_read, date_started, read_count, owned)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const getBookByGoodreadsIdStmt = db.prepare('SELECT id FROM books WHERE goodreads_id = ?')

// Helper functions to safely extract data
function safeExtract(value) {
  if (value === undefined || value === null || value === '') {
    return null
  }
  // Handle complex objects (like ISBN with nil attribute)
  if (typeof value === 'object' && value.$ && value.$.nil === 'true') {
    return null
  }
  if (typeof value === 'object') {
    return null
  }
  return value
}

function safeParseInt(value) {
  if (value === undefined || value === null || value === '') {
    return null
  }
  const parsed = parseInt(value)
  return isNaN(parsed) ? null : parsed
}

// Rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function fetchShelfData(shelf, page = 1) {
  const options = {
    method: 'GET',
    url: 'https://www.goodreads.com/review/list',
    params: {
      id: GOODREADS_USER_ID,
      shelf: shelf,
      v: 2,
      key: GOODREADS_API_KEY,
      per_page: 200, // Maximum allowed
      page: page,
      sort: 'date_added',
    },
  }

  try {
    console.log(`📖 Fetching ${shelf} shelf, page ${page}...`)
    const response = await axios(options)
    
    // Add delay to respect rate limits
    await delay(1000)
    
    return response.data
  } catch (error) {
    console.error(`❌ Error fetching ${shelf} shelf page ${page}:`, error.message)
    if (error.response?.status === 429) {
      console.log('⏳ Rate limited. Waiting 5 seconds...')
      await delay(5000)
      return fetchShelfData(shelf, page) // Retry
    }
    throw error
  }
}

function parseXMLData(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, function (err, result) {
      if (err) {
        reject(err)
        return
      }
      
      if (!result?.GoodreadsResponse?.reviews?.[0]?.review) {
        resolve({ books: [], hasMore: false })
        return
      }
      
      const reviews = result.GoodreadsResponse.reviews[0].review
      
      // Handle case where there's only one review (not an array)
      const reviewArray = Array.isArray(reviews) ? reviews : [reviews]
      
      if (reviewArray.length === 0 || (reviewArray.length === 1 && typeof reviewArray[0] === 'string')) {
        resolve({ books: [], hasMore: false })
        return
      }
      
      const books = reviewArray.map(element => {
        // Handle missing data gracefully
        const book = element.book?.[0]
        const authors = book?.authors?.[0]?.author
        const author = Array.isArray(authors) ? authors[0] : authors
        
        // Extract book data with safety checks
        const bookData = {
          // Book data
          goodreads_id: safeExtract(book?.id?.[0]?._ || book?.id?.[0]),
          title: safeExtract(book?.title?.[0]),
          author: safeExtract(author?.name?.[0]),
          isbn: safeExtract(book?.isbn?.[0]),
          image_url: safeExtract(book?.image_url?.[0]),
          description: safeExtract(book?.description?.[0]),
          pages: safeParseInt(book?.num_pages?.[0]),
          publication_year: safeParseInt(book?.publication_year?.[0]),
          
          // Review data
          shelf: safeExtract(element.shelves?.[0]?.shelf?.[0]?.$?.name) || 'read',
          rating: safeParseInt(element.rating?.[0]),
          review: safeExtract(element.body?.[0]),
          date_added: safeExtract(element.date_added?.[0]),
          date_read: safeExtract(element.date_read?.[0]),
          date_started: safeExtract(element.started_at?.[0]),
          read_count: safeParseInt(element.read_count?.[0]) || 1,
          owned: safeParseInt(element.owned?.[0]) || 0,
        }
        
        return bookData
      }).filter(book => {
        // Only include books with minimum required data
        return book.goodreads_id && book.title && book.author
      })
      
      // Check if there are more pages
      const total = parseInt(result.GoodreadsResponse.reviews[0].$.total)
      const end = parseInt(result.GoodreadsResponse.reviews[0].$.end)
      const hasMore = end < total
      
      resolve({ books, hasMore, total, current: end })
    })
  })
}

function insertBookData(bookData) {
  try {
    // Validate required fields
    if (!bookData.goodreads_id || !bookData.title || !bookData.author) {
      console.error(`❌ Missing required fields for book:`, {
        id: bookData.goodreads_id,
        title: bookData.title,
        author: bookData.author
      })
      return false
    }
    
    // Debug: Log parameters before insertion
    const bookParams = [
      bookData.goodreads_id,
      bookData.title,
      bookData.author,
      bookData.isbn,
      bookData.image_url,
      bookData.description,
      bookData.pages,
      bookData.publication_year
    ]
    
    // Check for undefined values
    const hasUndefined = bookParams.some(param => param === undefined)
    if (hasUndefined) {
      console.error(`❌ Undefined parameter detected for "${bookData.title}":`, bookParams)
      return false
    }
    
    // Insert book first
    const bookResult = insertBookStmt.run(...bookParams)
    
    // Get book ID (either newly inserted or existing)
    let bookId = bookResult.lastInsertRowid
    if (!bookId) {
      const existingBook = getBookByGoodreadsIdStmt.get(bookData.goodreads_id)
      bookId = existingBook?.id
    }
    
    if (!bookId) {
      throw new Error(`Failed to get book ID for ${bookData.title}`)
    }
    
    // Prepare review parameters
    const reviewParams = [
      bookId,
      bookData.shelf,
      bookData.rating,
      bookData.review,
      bookData.date_added,
      bookData.date_read,
      bookData.date_started,
      bookData.read_count,
      bookData.owned
    ]
    
    // Check for undefined values in review
    const reviewHasUndefined = reviewParams.some(param => param === undefined)
    if (reviewHasUndefined) {
      console.error(`❌ Undefined review parameter detected for "${bookData.title}":`, reviewParams)
      return false
    }
    
    // Insert review
    insertReviewStmt.run(...reviewParams)
    
    return true
  } catch (error) {
    console.error(`❌ Error inserting book "${bookData.title}":`, error.message)
    console.error(`   Book data:`, JSON.stringify(bookData, null, 2))
    return false
  }
}

async function scrapeAllShelves() {
  console.log('🔍 Starting full Goodreads scrape (FIXED VERSION)...')
  console.log('=====================================')
  
  const shelves = ['read', 'currently-reading', 'to-read']
  let totalBooks = 0
  let totalErrors = 0
  
  for (const shelf of shelves) {
    console.log(`\n📚 Scraping "${shelf}" shelf...`)
    let page = 1
    let hasMore = true
    let shelfBooks = 0
    
    while (hasMore) {
      try {
        const xmlData = await fetchShelfData(shelf, page)
        const { books, hasMore: morePages, total, current } = await parseXMLData(xmlData)
        
        if (books.length === 0) {
          console.log(`   No books found on page ${page}`)
          break
        }
        
        console.log(`   📖 Processing ${books.length} books (${current}/${total})...`)
        
        // Insert books into database
        for (const book of books) {
          if (insertBookData(book)) {
            shelfBooks++
            totalBooks++
          } else {
            totalErrors++
          }
        }
        
        hasMore = morePages
        page++
        
        // Progress update
        if (current && total) {
          const progress = Math.round((current / total) * 100)
          console.log(`   ✅ Progress: ${progress}% (${current}/${total})`)
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${shelf} shelf page ${page}:`, error.message)
        totalErrors++
        
        // Continue to next page on error
        page++
        if (page > 50) { // Safety limit
          console.log(`   ⚠️  Reached page limit for ${shelf} shelf`)
          break
        }
      }
    }
    
    console.log(`   ✅ ${shelf} shelf complete: ${shelfBooks} books`)
  }
  
  return { totalBooks, totalErrors }
}

async function main() {
  try {
    const startTime = Date.now()
    const { totalBooks, totalErrors } = await scrapeAllShelves()
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 1000)
    
    console.log('\n📊 Scrape Complete!')
    console.log('===================')
    console.log(`✅ Total books processed: ${totalBooks}`)
    console.log(`❌ Total errors: ${totalErrors}`)
    console.log(`⏱️  Duration: ${duration} seconds`)
    
    // Show final database stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_books,
        COUNT(DISTINCT shelf) as shelves,
        (SELECT COUNT(*) FROM reviews WHERE shelf = 'read') as read_books,
        (SELECT COUNT(*) FROM reviews WHERE shelf = 'currently-reading') as currently_reading,
        (SELECT COUNT(*) FROM reviews WHERE shelf = 'to-read') as to_read_books
      FROM books b
      JOIN reviews r ON b.id = r.book_id
    `).get()
    
    console.log('\n📈 Database Summary:')
    console.log(`   📚 Total books: ${stats.total_books}`)
    console.log(`   ✅ Read: ${stats.read_books}`)
    console.log(`   📖 Currently reading: ${stats.currently_reading}`)
    console.log(`   📋 To read: ${stats.to_read_books}`)
    
  } catch (error) {
    console.error('💥 Scrape failed:', error)
    process.exit(1)
  } finally {
    db.close()
  }
}

main().catch(console.error)