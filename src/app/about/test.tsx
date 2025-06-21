import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about/test"!</div>
}
