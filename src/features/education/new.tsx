import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { EducationForm } from './components/education-form'

export function EducationNew() {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex w-full flex-1 flex-col gap-4 sm:gap-6'>
        <EducationForm mode='create' />
      </Main>
    </>
  )
}
