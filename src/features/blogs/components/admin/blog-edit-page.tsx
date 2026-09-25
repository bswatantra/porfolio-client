import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { useGetBlogQuery } from '../../api/blogs-api'
import { BlogForm } from './blog-form'

interface BlogEditPageProps {
  blogId: string
}

export function BlogEditPage({ blogId }: BlogEditPageProps) {
  const { data: blog, isLoading, isError } = useGetBlogQuery(blogId)

  if (isLoading) {
    return (
      <div className='flex min-h-[60vh] flex-col items-center justify-center gap-3'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='text-sm text-muted-foreground'>Loading article for editing...</p>
      </div>
    )
  }

  if (isError || !blog) {
    return <NotFoundError />
  }

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex w-full flex-1 flex-col gap-6'>
        <BlogForm mode='edit' initialData={blog} />
      </Main>
    </>
  )
}
