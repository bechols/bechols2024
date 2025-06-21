# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with Next.js 15 (App Router), TypeScript, and Tailwind CSS. The site showcases Ben Echols' personal information, reading list via Goodreads API integration, and various personal content pages.

## Common Commands

### Development
- `npm run dev` - Start development server with Turbopack (runs on http://localhost:3000)
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code quality

### Testing
No test framework is currently configured in this project.

## Architecture & Key Components

### Project Structure
- **App Router**: Uses Next.js 13+ App Router pattern with `app/` directory
- **Layout**: Global layout in `app/layout.tsx` with navigation and footer
- **Pages**: Route-based pages in `app/` subdirectories (about, books, interesting)
- **Components**: Reusable UI components in `components/` directory
- **Styling**: Tailwind CSS with custom theme configuration

### UI Framework
- **Radix UI**: Core component library (@radix-ui/react-*)
- **Shadcn/ui**: Component system built on Radix (components/ui/)
- **Lucide React**: Icon library
- **React Icons**: Additional icon sets (Simple Icons)

### Key Features

#### Goodreads Integration
The `/books` page integrates with Goodreads API to display:
- Currently reading books
- Recently read books with ratings and reviews
- Uses XML parsing (xml2js) and axios for API calls
- Requires environment variables: `GOODREADS_USER_ID` and `GOODREADS_API_KEY`

#### Custom Styling
- **Tailwind v4**: Uses Tailwind CSS v4 with @tailwindcss/vite plugin
- **IMPORTANT**: globals.css must include `@import "tailwindcss";` for Tailwind v4 to work properly
- Williams College purple color: `#500082` (defined as `williams-purple` in Tailwind config)
- Custom typography plugin enabled
- Responsive design with mobile-first approach

#### Git Integration
- Build-time git commit SHA injection via `next.config.mjs`
- Displayed in footer as `NEXT_PUBLIC_GIT_COMMIT_SHA`

### Component Architecture
- **Nav.tsx**: Main navigation with social links (LinkedIn, GitHub, email)
- **Hero.tsx**: Homepage hero section with personal photo and navigation buttons
- **UI Components**: Reusable components following Shadcn/ui patterns
  - Button, Card, AspectRatio, NavigationMenu
  - All styled with Tailwind CSS and CSS variables for theming

### Content Structure
- Personal pages in `app/about/` with nested routes
- Static content pages for books and interesting links
- Image optimization with Next.js Image component
- Remote image support configured for Goodreads book covers

## Environment Variables

Required for full functionality:
- `GOODREADS_USER_ID` - Goodreads user ID for API calls
- `GOODREADS_API_KEY` - Goodreads API key for book data
- `NEXT_PUBLIC_GIT_COMMIT_SHA` - Auto-generated during build

## Development Notes

- Uses TypeScript with strict type checking
- ESLint configured with Next.js recommended rules
- No testing framework currently configured
- Deployment ready for Vercel (Next.js creators' platform)
- Responsive design optimized for mobile and desktop
- Uses semantic HTML and accessibility attributes