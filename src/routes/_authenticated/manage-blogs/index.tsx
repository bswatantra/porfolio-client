import { createFileRoute } from '@tanstack/react-router'
import { BlogsManagePage } from '@/features/blogs/components/admin/blogs-manage-page'

export const Route = createFileRoute('/_authenticated/manage-blogs/')({
  component: BlogsManagePage,
})
