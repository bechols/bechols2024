import * as React from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Meta, Scripts } from '@tanstack/start'
import type { ReactNode } from 'react'
import '../globals.css'
import Nav from '../../components/Nav'

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
  ],
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  const gitCommitSha = process.env.NEXT_PUBLIC_GIT_COMMIT_SHA

  return (
    <html lang="en">
      <head>
        <Meta />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/williams-favicon-32x32.png" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built with{' '}
                  <Link
                    to="https://tanstack.com/start"
                    className="font-medium underline underline-offset-4"
                  >
                    TanStack Start
                  </Link>
                  . The source code is available on{' '}
                  <Link
                    to="https://github.com/bechols/bechols2024"
                    className="font-medium underline underline-offset-4"
                  >
                    GitHub
                  </Link>
                  .
                </p>
              </div>
              {gitCommitSha && (
                <div className="text-xs text-muted-foreground">
                  <Link
                    to={`https://github.com/bechols/bechols2024/commit/${gitCommitSha}`}
                    className="font-mono hover:underline"
                  >
                    {gitCommitSha.slice(0, 7)}
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
        <Scripts />
        <TanStackRouterDevtools position="bottom-right" />
      </body>
    </html>
  )
}