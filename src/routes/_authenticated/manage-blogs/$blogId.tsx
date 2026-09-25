import { createFileRoute } from '@tanstack/react-router'
import { BlogEditPage } from '@/features/blogs/components/admin/blog-edit-page'

export const Route = createFileRoute('/_authenticated/manage-blogs/$blogId')({
  component: ManageBlogEditRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function ManageBlogEditRoute() {
  const { blogId } = Route.useParams()
  return <BlogEditPage blogId={blogId} />
}
