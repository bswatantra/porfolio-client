import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { SkillForm } from './components/skill-form'
import { type SkillEditProps } from './types'

export function SkillEdit({ skill }: SkillEditProps) {
  return (
    <>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex w-full flex-1 flex-col gap-4 sm:gap-6'>
        <SkillForm mode='edit' initialData={skill} />
      </Main>
    </>
  )
}
