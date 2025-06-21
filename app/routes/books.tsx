import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '../../components/ui/card'
import axios from 'axios'
import { Star } from 'lucide-react'
import { parseString } from 'xml2js'

type BookInfo = {
  title: string
  author: string
  link: string
  imageURL: string
  rating?: number | undefined
  review?: string | undefined
}

const getCurrentBooks = createServerFn('GET', async (): Promise<BookInfo[]> => {
  const currentOptions = {
    method: `get`,
    url: `https://www.goodreads.com/review/list`,
    params: {
      id: process.env.GOODREADS_USER_ID,
      shelf: `currently-reading`,
      v: 2,
      key: process.env.GOODREADS_API_KEY,
      per_page: 5,
      page: 1,
      sort: `date_read`,
    },
  }
  const currentShelfListXml = await axios(currentOptions)
  let currentlyReading: BookInfo[] = []

  parseString(currentShelfListXml.data, function (err, result) {
    if (err) {
      return
    } else {
      if (
        Object.keys(result['GoodreadsResponse']['reviews'][0]['review'] || {})
          .length === 0
      ) {
        return // TODO: handle empty response
      }
      currentlyReading = result['GoodreadsResponse']['reviews'][0][
        'review'
        // @ts-expect-error
      ].map((element) => {
        return {
          author: element['book'][0]['authors'][0]['author'][0]['name'],
          link: element['book'][0]['link'][0],
          title: element['book'][0]['title'][0],
          imageURL: element['book'][0]['image_url'][0],
        }
      })
    }
  })
  return currentlyReading
})

const getRecentBooks = createServerFn('GET', async (): Promise<BookInfo[]> => {
  const recentOptions = {
    method: 'GET',
    url: 'https://www.goodreads.com/review/list',
    params: {
      v: '2',
      sort: 'date_read',
      shelf: 'read',
      per_page: '5',
      page: '1',
      id: process.env.GOODREADS_USER_ID,
      key: process.env.GOODREADS_API_KEY,
    },
  }
  const recentShelfListXml = await axios(recentOptions)
  let recentlyRead: BookInfo[] = []

  parseString(recentShelfListXml.data, function (err, result) {
    if (err) {
      return
    } else {
      if (
        Object.keys(result['GoodreadsResponse']['reviews'][0]['review'] || {})
          .length === 0
      ) {
        return // TODO: handle empty response
      }
      recentlyRead = result['GoodreadsResponse']['reviews'][0]['review'].map(
        // @ts-expect-error
        (element) => {
          return {
            rating: element['rating'][0],
            review: element['body'][0],
            author: element['book'][0]['authors'][0]['author'][0]['name'],
            link: element['book'][0]['link'][0],
            title: element['book'][0]['title'][0],
            imageURL: element['book'][0]['image_url'][0],
          }
        }
      )
    }
  })
  return recentlyRead
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
        <CardTitle className="text-lg md:text-xl p-2 break-words">
          {bookInfo.title}
        </CardTitle>
        <CardDescription className="p-2">{bookInfo.author}</CardDescription>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex flex-col w-full sm:w-3/4">
              {bookInfo.rating && (
                <div className="flex items-center gap-2">
                  My rating:{' '}
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
  loader: async () => {
    const [currentBooks, recentBooks] = await Promise.all([
      getCurrentBooks(),
      getRecentBooks(),
    ])
    return {
      currentBooks,
      recentBooks,
    }
  },
  component: Books,
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
        <div className="text-lg">{`Either the Goodreads API finally quit working, or I'm not reading anything right now.`}</div>
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