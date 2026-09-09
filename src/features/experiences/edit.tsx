import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ExperienceForm } from './components/experience-form'
import { type ExperienceEditProps } from './types'

export function ExperienceEdit({ experience }: ExperienceEditProps) {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex w-full flex-1 flex-col gap-4 sm:gap-6'>
        <ExperienceForm mode='edit' initialData={experience} />
      </Main>
    </>
  )
}
