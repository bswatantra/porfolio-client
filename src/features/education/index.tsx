import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetEducationListQuery } from './api/education-api'
import { EducationDialogs } from './components/education-dialogs'
import { EducationPrimaryButtons } from './components/education-primary-buttons'
import { EducationProvider } from './components/education-provider'
import { EducationTable } from './components/education-table'

export function Education() {
  const { data: educationList = [], isLoading } = useGetEducationListQuery()

  return (
    <EducationProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Education</h2>
            <p className='text-muted-foreground'>
              Manage academic degrees, certifications, bootcamps, and
              educational history on your portfolio.
            </p>
          </div>
          <EducationPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <EducationTable data={educationList} />
        )}
      </Main>

      <EducationDialogs />
    </EducationProvider>
  )
}
