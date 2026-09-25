import { createFileRoute } from '@tanstack/react-router'
import { BlogsList } from '@/features/blogs'

export const Route = createFileRoute('/blogs/')({
  component: BlogsList,
})
