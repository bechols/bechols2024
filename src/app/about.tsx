import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return <Outlet />
}