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
const dbPath = resolve(process.cwd(), 'public', 'books.db')
const db = new Database(dbPath)

// Helper functions (same as scraper)
function safeExtract(value) {
  if (value === undefined || value === null || value === '') {
    return null
  }
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

async function syncSingleShelf(shelf) {
  console.log(`🔄 Syncing "${shelf}" shelf...`)
  
  const options = {
    method: 'GET',
    url: 'https://www.goodreads.com/review/list',
    params: {
      id: GOODREADS_USER_ID,
      shelf: shelf,
      v: 2,
      key: GOODREADS_API_KEY,
      per_page: 50, // Smaller batches for sync
      page: 1,
      sort: 'date_added',
    },
  }

  try {
    const response = await axios(options)
    await delay(1000) // Rate limiting
    
    return new Promise((resolve) => {
      parseString(response.data, function (err, result) {
        if (err) {
          console.error(`❌ XML parsing error for ${shelf}:`, err.message)
          resolve(0)
          return
        }
        
        if (!result?.GoodreadsResponse?.reviews?.[0]?.review) {
          console.log(`   No books found in ${shelf} shelf`)
          resolve(0)
          return
        }
        
        const reviews = result.GoodreadsResponse.reviews[0].review
        const reviewArray = Array.isArray(reviews) ? reviews : [reviews]
        
        let syncedCount = 0
        const insertBookStmt = db.prepare(`
          INSERT OR REPLACE INTO books (goodreads_id, title, author, isbn, image_url, description, pages, publication_year)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        
        const insertReviewStmt = db.prepare(`
          INSERT OR REPLACE INTO reviews (book_id, shelf, rating, review, date_added, date_read, date_started, read_count, owned)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        
        const getBookByGoodreadsIdStmt = db.prepare('SELECT id FROM books WHERE goodreads_id = ?')
        
        for (const element of reviewArray) {
          try {
            const book = element.book?.[0]
            const authors = book?.authors?.[0]?.author
            const author = Array.isArray(authors) ? authors[0] : authors
            
            const bookData = {
              goodreads_id: safeExtract(book?.id?.[0]?._ || book?.id?.[0]),
              title: safeExtract(book?.title?.[0]),
              author: safeExtract(author?.name?.[0]),
              isbn: safeExtract(book?.isbn?.[0]),
              image_url: safeExtract(book?.image_url?.[0]),
              description: safeExtract(book?.description?.[0]),
              pages: safeParseInt(book?.num_pages?.[0]),
              publication_year: safeParseInt(book?.publication_year?.[0]),
              shelf: safeExtract(element.shelves?.[0]?.shelf?.[0]?.$?.name) || shelf,
              rating: safeParseInt(element.rating?.[0]),
              review: safeExtract(element.body?.[0]),
              date_added: safeExtract(element.date_added?.[0]),
              date_read: safeExtract(element.date_read?.[0]),
              date_started: safeExtract(element.started_at?.[0]),
              read_count: safeParseInt(element.read_count?.[0]) || 1,
              owned: safeParseInt(element.owned?.[0]) || 0,
            }
            
            if (!bookData.goodreads_id || !bookData.title || !bookData.author) {
              continue
            }
            
            // Insert book
            const bookResult = insertBookStmt.run(
              bookData.goodreads_id,
              bookData.title,
              bookData.author,
              bookData.isbn,
              bookData.image_url,
              bookData.description,
              bookData.pages,
              bookData.publication_year
            )
            
            // Get book ID
            let bookId = bookResult.lastInsertRowid
            if (!bookId) {
              const existingBook = getBookByGoodreadsIdStmt.get(bookData.goodreads_id)
              bookId = existingBook?.id
            }
            
            if (bookId) {
              // Insert/update review
              insertReviewStmt.run(
                bookId,
                bookData.shelf,
                bookData.rating,
                bookData.review,
                bookData.date_added,
                bookData.date_read,
                bookData.date_started,
                bookData.read_count,
                bookData.owned
              )
              syncedCount++
            }
            
          } catch (error) {
            console.error(`❌ Error syncing book:`, error.message)
          }
        }
        
        console.log(`   ✅ Synced ${syncedCount} books from ${shelf} shelf`)
        resolve(syncedCount)
      })
    })
  } catch (error) {
    console.error(`❌ Error fetching ${shelf} shelf:`, error.message)
    return 0
  }
}

async function main() {
  console.log('🔄 Starting incremental Goodreads sync...')
  console.log('=====================================')
  
  const startTime = Date.now()
  
  // Sync the most likely to change shelves
  const shelves = ['currently-reading', 'read', 'to-read']
  let totalSynced = 0
  
  for (const shelf of shelves) {
    const synced = await syncSingleShelf(shelf)
    totalSynced += synced
  }
  
  const endTime = Date.now()
  const duration = Math.round((endTime - startTime) / 1000)
  
  // Get updated stats
  const stats = db.prepare(`
    SELECT 
      COUNT(*) as total_books,
      (SELECT COUNT(*) FROM reviews WHERE shelf = 'read') as read_books,
      (SELECT COUNT(*) FROM reviews WHERE shelf = 'currently-reading') as currently_reading,
      (SELECT COUNT(*) FROM reviews WHERE shelf = 'to-read') as to_read_books
    FROM books b
    JOIN reviews r ON b.id = r.book_id
  `).get()
  
  console.log('\n📊 Sync Complete!')
  console.log('==================')
  console.log(`✅ Books synced: ${totalSynced}`)
  console.log(`⏱️  Duration: ${duration} seconds`)
  console.log('\n📈 Current Database:')
  console.log(`   📚 Total books: ${stats.total_books}`)
  console.log(`   ✅ Read: ${stats.read_books}`)
  console.log(`   📖 Currently reading: ${stats.currently_reading}`)
  console.log(`   📋 To read: ${stats.to_read_books}`)
  
  db.close()
}

main().catch(console.error)