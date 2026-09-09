import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetExperiencesQuery } from './api/experiences-api'
import { ExperiencesDialogs } from './components/experiences-dialogs'
import { ExperiencesPrimaryButtons } from './components/experiences-primary-buttons'
import { ExperiencesProvider } from './components/experiences-provider'
import { ExperiencesTable } from './components/experiences-table'

export function Experiences() {
  const { data: experiences = [], isLoading } = useGetExperiencesQuery()

  return (
    <ExperiencesProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Experiences</h2>
            <p className='text-muted-foreground'>
              Manage your career history, company roles, and portfolio work
              experiences.
            </p>
          </div>
          <ExperiencesPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <ExperiencesTable data={experiences} />
        )}
      </Main>

      <ExperiencesDialogs />
    </ExperiencesProvider>
  )
}
