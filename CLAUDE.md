# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website built with TanStack Start (React Router), TypeScript, and Tailwind CSS. The site showcases Ben Echols' personal information, reading list via Goodreads API integration, and various personal content pages.

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
- **TanStack Start Router**: Uses TanStack Start with React Router for file-based routing
- **Routing**: Files in `src/app/` directory map to routes (e.g., `src/app/books/analytics.tsx` → `/books/analytics`)
- **Route Components**: Each route file exports a `Route` object created with `createFileRoute()`
- **Layout**: Global layout with navigation and footer
- **Pages**: Route-based pages in `src/app/` subdirectories (about, books, interesting)
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
- Personal pages in `src/app/about/` with nested routes
- Static content pages for books and interesting links
- Image optimization with React Image component
- Remote image support configured for Goodreads book covers

## Environment Variables

Required for full functionality:
- `GOODREADS_USER_ID` - Goodreads user ID for API calls
- `GOODREADS_API_KEY` - Goodreads API key for book data
- `NEXT_PUBLIC_GIT_COMMIT_SHA` - Auto-generated during build

## Development Notes

- Uses TypeScript with strict type checking
- ESLint configured with React/TypeScript recommended rules
- No testing framework currently configured
- Built with TanStack Start for full-stack React applications
- Responsive design optimized for mobile and desktop
- Uses semantic HTML and accessibility attributes

## Routing Notes

- **File-based routing**: Routes are defined by file structure in `src/app/`
- **Route exports**: Each route file must export a `Route` object created with `createFileRoute('/path')`
- **Nested routes**: Subdirectories create nested routes (e.g., `/books/analytics`)
- **Server functions**: Use `createServerFn()` for server-side data fetching
- **Loaders**: Routes can have loaders for data fetching before component renders