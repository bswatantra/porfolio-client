import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { BlogDetail, SeoHead } from '@/features/blogs'
import { useGetBlogQuery } from '@/features/blogs/api/blogs-api'
import { NotFoundError } from '@/features/errors/not-found-error'

export const Route = createFileRoute('/blogs/$blogId')({
  component: BlogSingleRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function BlogSingleRoute() {
  const { blogId } = Route.useParams()
  const { data: blog, isLoading, isError } = useGetBlogQuery(blogId)

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground'>Loading article...</p>
      </div>
    )
  }

  if (isError || !blog) {
    return <NotFoundError />
  }

  return (
    <>
      <SeoHead
        title={blog.title}
        description={blog.excerpt}
        ogImage={blog.coverImage}
        publishedTime={blog.publishedAt}
        authorName={blog.author?.name}
        category={blog.category}
        tags={blog.tags}
      />
      <BlogDetail blog={blog} />
    </>
  )
}

