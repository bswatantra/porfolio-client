import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { useBlogStore } from '../../data/blogs-store'
import { BlogForm } from './blog-form'

interface BlogEditPageProps {
  blogId: string
}

export function BlogEditPage({ blogId }: BlogEditPageProps) {
  const getBlog = useBlogStore((state) => state.getBlogByIdOrSlug)
  const blog = getBlog(blogId)

  if (!blog) {
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
