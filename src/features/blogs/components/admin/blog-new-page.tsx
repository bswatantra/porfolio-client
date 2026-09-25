import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const LazyBlogForm = lazy(() =>
  import('./blog-form').then((m) => ({ default: m.BlogForm }))
)

export function BlogNewPage() {
  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex w-full flex-1 flex-col gap-6'>
        <Suspense
          fallback={
            <div className='flex min-h-[50vh] flex-col items-center justify-center gap-3'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='text-sm text-muted-foreground'>Preparing editor...</p>
            </div>
          }
        >
          <LazyBlogForm mode='create' />
        </Suspense>
      </Main>
    </>
  )
}
