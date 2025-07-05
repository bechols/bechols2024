import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Star } from "lucide-react"
import { getCurrentlyReadingFromDB, getRecentlyReadFromDB, transformDBBookToBookInfo } from '@/lib/database-queries'
import axios from "axios"
import { parseString } from "xml2js"

type BookInfo = {
  title: string
  author: string
  link: string
  imageURL: string
  rating?: number | undefined
  review?: string | undefined
}

type ShelfConfig = {
  shelf: string
  includeRating?: boolean
  includeReview?: boolean
}

async function fetchGoodreadsShelf(config: ShelfConfig): Promise<BookInfo[]> {
  const options = {
    method: 'GET',
    url: 'https://www.goodreads.com/review/list',
    params: {
      id: process.env.GOODREADS_USER_ID,
      shelf: config.shelf,
      v: 2,
      key: process.env.GOODREADS_API_KEY,
      per_page: 5,
      page: 1,
      sort: 'date_read',
    },
  }
  
  try {
    const response = await axios(options)
    return parseGoodreadsXML(response.data, config)
  } catch (error) {
    console.error(`Error fetching ${config.shelf} books:`, error)
    return []
  }
}

function parseGoodreadsXML(xmlData: string, config: ShelfConfig): Promise<BookInfo[]> {
  return new Promise((resolve) => {
    parseString(xmlData, function (err, result) {
      if (err) {
        resolve([])
        return
      }
      
      if (
        !result["GoodreadsResponse"]["reviews"][0]["review"] ||
        Object.keys(result["GoodreadsResponse"]["reviews"][0]["review"]).length === 0
      ) {
        resolve([])
        return
      }
      
      const books = result["GoodreadsResponse"]["reviews"][0]["review"].map(
        // @ts-expect-error - Goodreads API response structure is complex and untyped
        (element) => {
          const bookInfo: BookInfo = {
            author: element["book"][0]["authors"][0]["author"][0]["name"],
            link: element["book"][0]["link"][0],
            title: element["book"][0]["title"][0],
            imageURL: element["book"][0]["image_url"][0],
          }
          
          if (config.includeRating) {
            bookInfo.rating = element["rating"][0]
          }
          
          if (config.includeReview) {
            bookInfo.review = element["body"][0]
          }
          
          return bookInfo
        }
      )
      resolve(books)
    })
  })
}

const getCurrentBooks = createServerFn({
  method: 'GET',
}).handler(async (): Promise<BookInfo[]> => {
  try {
    // Try database first
    const dbBooks = getCurrentlyReadingFromDB()
    if (dbBooks.length > 0) {
      return dbBooks.map(transformDBBookToBookInfo)
    }
    
    // Fallback to API if database is empty
    console.log('Database empty, falling back to Goodreads API for currently reading')
    return fetchGoodreadsShelf({ shelf: 'currently-reading' })
  } catch (error) {
    console.error('Error fetching current books from database, falling back to API:', error)
    return fetchGoodreadsShelf({ shelf: 'currently-reading' })
  }
})

const getRecentBooks = createServerFn({
  method: 'GET',
}).handler(async (): Promise<BookInfo[]> => {
  try {
    // Try database first
    const dbBooks = getRecentlyReadFromDB(5)
    if (dbBooks.length > 0) {
      return dbBooks.map(transformDBBookToBookInfo)
    }
    
    // Fallback to API if database is empty
    console.log('Database empty, falling back to Goodreads API for recent books')
    return fetchGoodreadsShelf({ 
      shelf: 'read', 
      includeRating: true, 
      includeReview: true 
    })
  } catch (error) {
    console.error('Error fetching recent books from database, falling back to API:', error)
    return fetchGoodreadsShelf({ 
      shelf: 'read', 
      includeRating: true, 
      includeReview: true 
    })
  }
})

function BookCard(bookInfo: BookInfo) {
  return (
    <a
      href={bookInfo.link}
      target="_blank"
      rel="noreferrer noopener"
      className="w-full"
    >
      <Card className="p-4 hover:bg-slate-200 mb-6">
        <CardTitle className="text-lg md:text-xl p-2 break-words">{bookInfo.title}</CardTitle>
        <CardDescription className="p-2">{bookInfo.author}</CardDescription>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col w-full sm:w-3/4">
              {bookInfo.rating && (
                <div className="flex items-center gap-2">
                  My rating:{" "}
                  {Array.from({ length: bookInfo.rating }, (_, i) => (
                    <Star key={i} className="h-4 w-4" />
                  ))}
                </div>
              )}
              {bookInfo.review && (
                <div className="pt-4">{bookInfo.review}</div>
              )}
            </div>
            <div className="shrink-0">
              <img
                src={bookInfo.imageURL}
                alt="Book cover"
                width={80}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

export const Route = createFileRoute('/books')({
  component: Books,
  loader: async () => {
    const [currentBooks, recentBooks] = await Promise.all([
      getCurrentBooks(),
      getRecentBooks(),
    ])
    return { currentBooks, recentBooks }
  },
})

function Books() {
  const { currentBooks, recentBooks } = Route.useLoaderData()

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
      <h1 className="text-2xl md:text-3xl font-bold pb-6">Currently reading</h1>
      <div className="space-y-6">
        {currentBooks.map((bookInfo) => (
          <BookCard
            title={bookInfo.title}
            author={bookInfo.author}
            key={bookInfo.title}
            link={bookInfo.link}
            imageURL={bookInfo.imageURL}
          />
        ))}
      </div>
      {currentBooks.length === 0 && (
        <div className="text-lg">{`Either the database is empty, or I'm not reading anything right now.`}</div>
      )}

      {recentBooks.length > 0 && (
        <h1 className="text-2xl md:text-3xl font-bold py-6">Recently read</h1>
      )}

      <div className="space-y-6">
        {recentBooks.map((bookInfo) => (
          <BookCard
            title={bookInfo.title}
            author={bookInfo.author}
            key={bookInfo.title}
            link={bookInfo.link}
            imageURL={bookInfo.imageURL}
            rating={bookInfo.rating}
            review={bookInfo.review}
          />
        ))}
      </div>
    </div>
  )
}