import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetAboutListQuery } from './api/about-api'
import { AboutDialogs } from './components/about-dialogs'
import { AboutPrimaryButtons } from './components/about-primary-buttons'
import { AboutProvider } from './components/about-provider'
import { AboutTable } from './components/about-table'

export function AboutFeature() {
  const { data: aboutList = [], isLoading } = useGetAboutListQuery()

  return (
    <AboutProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>About Me Section</h2>
            <p className='text-muted-foreground'>
              Manage the personal bio and stats. Projects Shipped and Skills Mastered counts are dynamically aggregated from the database.
            </p>
          </div>
          <AboutPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <AboutTable data={aboutList} />
        )}
      </Main>

      <AboutDialogs />
    </AboutProvider>
  )
}

