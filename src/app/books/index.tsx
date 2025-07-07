import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Star } from "lucide-react"
import { getCurrentlyReadingFromDB, getRecentlyReadFromDB, transformDBBookToBookInfo } from '@/lib/database-queries'
import axios from "axios"
import { parseString } from "xml2js"

// Types for Goodreads API response from xml2js
interface GoodreadsReviewElement {
  book: [
    {
      title: [string];
      link: [string];
      image_url: [string];
      authors: [
        {
          author: [
            {
              name: [string];
            }
          ];
        }
      ];
    }
  ];
  rating: [string];
  body: [string];
}

interface GoodreadsResult {
  GoodreadsResponse: {
    reviews: [
      {
        review?: GoodreadsReviewElement[];
      }
    ];
  };
}

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
    const response = await axios<string>(options)
    return parseGoodreadsXML(response.data, config)
  } catch (error) {
    console.error(`Error fetching ${config.shelf} books:`, error)
    return []
  }
}

function parseGoodreadsXML(xmlData: string, config: ShelfConfig): Promise<BookInfo[]> {
  return new Promise((resolve) => {
    parseString(xmlData, function (err, result: GoodreadsResult) {
      if (err) {
        console.error('Error parsing Goodreads XML:', err);
        resolve([])
        return
      }
      
      const reviews = result?.GoodreadsResponse?.reviews?.[0]?.review;

      if (!reviews || reviews.length === 0) {
        resolve([])
        return
      }
      
      const books: BookInfo[] = reviews.map(
        (element) => {
          const book = element.book[0];
          const author = book.authors[0].author[0];

          const bookInfo: BookInfo = {
            author: author.name[0],
            link: book.link[0],
            title: book.title[0],
            imageURL: book.image_url[0],
          }
          
          if (config.includeRating) {
            bookInfo.rating = parseInt(element.rating[0], 10);
          }
          
          if (config.includeReview) {
            const reviewText = element.body[0]?.trim();
            if (reviewText) {
              bookInfo.review = reviewText;
            }
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
    const dbBooks = await getCurrentlyReadingFromDB()
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
    const dbBooks = await getRecentlyReadFromDB(5)
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
      className="block w-full group"
    >
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Book Cover */}
            <div className="shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
              <img
                src={bookInfo.imageURL}
                alt={`Cover of ${bookInfo.title}`}
                width={120}
                height={180}
                className="object-contain shadow-md rounded-sm max-w-[120px] max-h-[180px]"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 sm:p-6">
              <CardTitle className="text-xl md:text-2xl font-bold mb-2 break-words group-hover:text-blue-600 transition-colors">
                {bookInfo.title}
              </CardTitle>
              <CardDescription className="text-base md:text-lg font-medium text-gray-600 mb-4">
                by {bookInfo.author}
              </CardDescription>
              
              {bookInfo.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">My rating:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < bookInfo.rating! 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {bookInfo.review && bookInfo.review.length > 0 && bookInfo.review.trim() !== '' && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">My review:</p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {bookInfo.review}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

export const Route = createFileRoute('/books/')({
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Currently reading</h1>
        <Button asChild variant="outline" className="flex items-center gap-2">
          <Link to="/books/analytics">
            <BarChart3 className="h-4 w-4" />
            Reading Analytics
          </Link>
        </Button>
      </div>
      <div className="space-y-6">
        {currentBooks.map((bookInfo: BookInfo) => (
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
        <div className="text-lg">{`Maybe I'm not reading anything right now, or maybe the Goodreads API finally stopped working.`}</div>
      )}

      {recentBooks.length > 0 && (
        <h1 className="text-2xl md:text-3xl font-bold py-6">Recently read</h1>
      )}

      <div className="space-y-6">
        {recentBooks.map((bookInfo: BookInfo) => (
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