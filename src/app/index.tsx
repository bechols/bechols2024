import Hero from "@/components/Hero"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ 
  component: Home, 
})

function Home() { 
  return <Hero />
}