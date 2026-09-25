import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { BlogForm } from './blog-form'

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
        <BlogForm mode='create' />
      </Main>
    </>
  )
}
