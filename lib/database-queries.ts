import { type BookWithReview, getDatabase } from './database'

export async function getCurrentlyReadingFromDB(): Promise<BookWithReview[]> {
  try {
    const db = await getDatabase()
    if (!db) {
      console.warn('Database not available, returning empty currently reading list')
      return []
    }
    
    const stmt = db.prepare(`
      SELECT 
        b.*,
        r.shelf,
        r.rating,
        r.review,
        r.date_added,
        r.date_read,
        r.date_started,
        r.read_count,
        r.owned
      FROM books b
      INNER JOIN reviews r ON b.id = r.book_id
      WHERE r.shelf = 'currently-reading'
      ORDER BY r.date_added DESC
    `)
    
    return stmt.all() as BookWithReview[]
  } catch (error) {
    console.error('Error fetching currently reading books from database:', error)
    return []
  }
}

export async function getRecentlyReadFromDB(limit: number = 10): Promise<BookWithReview[]> {
  try {
    const db = await getDatabase()
    if (!db) {
      console.warn('Database not available, returning empty recently read list')
      return []
    }
    
    const stmt = db.prepare(`
      SELECT 
        b.*,
        r.shelf,
        r.rating,
        r.review,
        r.date_added,
        r.date_read,
        r.date_started,
        r.read_count,
        r.owned
      FROM books b
      INNER JOIN reviews r ON b.id = r.book_id
      WHERE r.shelf = 'read' 
      ORDER BY r.date_read DESC
      LIMIT ?
    `)
    
    return stmt.all(limit) as BookWithReview[]
  } catch (error) {
    console.error('Error fetching recently read books from database:', error)
    return []
  }
}

export async function getRecentlyReadPaginatedFromDB(
  limit: number = 10, 
  offset: number = 0
): Promise<{ books: BookWithReview[], hasMore: boolean }> {
  try {
    const db = await getDatabase()
    if (!db) {
      console.warn('Database not available, returning empty recently read list')
      return { books: [], hasMore: false }
    }
    
    // Ensure parameters are integers
    const safeLimit = Math.max(1, Math.floor(Number(limit)))
    const safeOffset = Math.max(0, Math.floor(Number(offset)))
    
    console.log(`DB query: LIMIT ${safeLimit + 1} OFFSET ${safeOffset}`)
    
    // Get books with one extra to check if there are more
    const stmt = db.prepare(`
      SELECT 
        b.*,
        r.shelf,
        r.rating,
        r.review,
        r.date_added,
        r.date_read,
        r.date_started,
        r.read_count,
        r.owned
      FROM books b
      INNER JOIN reviews r ON b.id = r.book_id
      WHERE r.shelf = 'read' 
      ORDER BY r.date_read DESC
      LIMIT ? OFFSET ?
    `)
    
    const results = stmt.all(safeLimit + 1, safeOffset) as BookWithReview[]
    const hasMore = results.length > safeLimit
    const books = hasMore ? results.slice(0, safeLimit) : results
    
    return { books, hasMore }
  } catch (error) {
    console.error('Error fetching paginated recently read books from database:', error)
    return { books: [], hasMore: false }
  }
}

// Transform database format to match existing BookInfo interface
export function transformDBBookToBookInfo(dbBook: BookWithReview): {
  title: string
  author: string
  link: string
  imageURL: string
  rating?: number
  review?: string
  dateStarted?: string
  dateRead?: string
} {
  return {
    title: dbBook.title,
    author: dbBook.author,
    link: `https://www.goodreads.com/book/show/${dbBook.goodreads_id}`,
    imageURL: dbBook.image_url ?? '',
    rating: dbBook.rating && dbBook.rating > 0 ? dbBook.rating : undefined,
    review: dbBook.review ?? undefined,
    dateStarted: dbBook.date_started ?? undefined,
    dateRead: dbBook.date_read ?? undefined,
  }
}