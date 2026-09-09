import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetSkillsQuery } from './api/skills-api'
import { SkillsDialogs } from './components/skills-dialogs'
import { SkillsPrimaryButtons } from './components/skills-primary-buttons'
import { SkillsProvider } from './components/skills-provider'
import { SkillsTable } from './components/skills-table'

export function Skills() {
  const { data: skills = [], isLoading } = useGetSkillsQuery()

  return (
    <SkillsProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Skills</h2>
            <p className='text-muted-foreground'>
              Manage technical proficiencies, frameworks, libraries, and tools
              on your portfolio.
            </p>
          </div>
          <SkillsPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <SkillsTable data={skills} />
        )}
      </Main>

      <SkillsDialogs />
    </SkillsProvider>
  )
}
