import { createFileRoute } from '@tanstack/react-router'
import { BlogNewPage } from '@/features/blogs/components/admin/blog-new-page'

export const Route = createFileRoute('/_authenticated/manage-blogs/new')({
  component: BlogNewPage,
})
