import { createRootRoute, Outlet } from '@tanstack/react-router'
import '../globals.css'
import Nav from '@/components/Nav'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const commitSha = import.meta.env.VITE_GIT_COMMIT_SHA

function Footer() {
  const currentYear = new Date().getFullYear()
  const repoUrl = 'https://github.com/bechols/bechols2024'

  return (
    <footer className="text-center text-xs text-gray-500 py-6 mt-12 border-t border-gray-200">
      {commitSha && (
        <p className="mt-1">
          <a
            href={`${repoUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            © {currentYear} Ben Echols
            <br />
            {commitSha}
          </a>
        </p>
      )}
    </footer>
  )
}

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'Ben Echols',
    },
    {
      name: 'description',
      content: "Ben's personal site",
    },
  ],
  links: () => [
    {
      rel: 'icon',
      href: '/williams-favicon-32x32.png',
    },
  ],
  component: () => (
    <html lang="en">
      <head>
        {/* Meta tags and links will be injected here */}
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="min-h-screen px-2 sm:px-4 md:px-8 lg:px-16">
          <Nav />
          <main className="flex justify-center pt-4 sm:pt-6 md:pt-8">
            <Outlet />
          </main>
          <Footer />
        </div>
        <TanStackRouterDevtools />
      </body>
    </html>
  ),
})