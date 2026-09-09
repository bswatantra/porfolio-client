import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetHeroesQuery } from './api/hero-api'
import { HeroDialogs } from './components/hero-dialogs'
import { HeroPrimaryButtons } from './components/hero-primary-buttons'
import { HeroProvider } from './components/hero-provider'
import { HeroTable } from './components/hero-table'

export function HeroFeature() {
  const { data: heroes = [], isLoading } = useGetHeroesQuery()

  return (
    <HeroProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Hero Section</h2>
            <p className='text-muted-foreground'>
              Manage the introductory headline, typewriter roles, and specializations on your portfolio.
            </p>
          </div>
          <HeroPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <HeroTable data={heroes} />
        )}
      </Main>

      <HeroDialogs />
    </HeroProvider>
  )
}

