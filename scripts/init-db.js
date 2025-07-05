#!/usr/bin/env node

import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import { existsSync } from 'fs'
import Database from 'better-sqlite3'

async function main() {
  console.log('🗄️  Initializing SQLite database...')
  
  try {
    // Create data directory if it doesn't exist
    const dataDir = resolve(process.cwd(), 'data')
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true })
      console.log('📁 Created data directory')
    }
    
    // Initialize database
    const dbPath = resolve(dataDir, 'books.db')
    const db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    
    // Create books table
    db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        goodreads_id TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT,
        image_url TEXT,
        description TEXT,
        pages INTEGER,
        publication_year INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Create reviews table
    db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        shelf TEXT NOT NULL,
        rating INTEGER,
        review TEXT,
        date_added DATETIME,
        date_read DATETIME,
        date_started DATETIME,
        read_count INTEGER DEFAULT 1,
        owned INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id),
        UNIQUE(book_id, shelf)
      )
    `)
    
    // Create indexes for better performance
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_books_goodreads_id ON books(goodreads_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews(book_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_shelf ON reviews(shelf);
      CREATE INDEX IF NOT EXISTS idx_reviews_date_read ON reviews(date_read);
    `)
    
    // Test the connection
    const result = db.prepare('SELECT COUNT(*) as count FROM books').get()
    console.log('✅ Database initialized successfully')
    console.log(`📊 Books table has ${result.count} records`)
    
    // Close the database
    db.close()
    
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  }
}

main().catch(console.error)