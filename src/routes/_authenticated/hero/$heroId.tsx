import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { useGetHeroQuery } from '@/features/hero/api/hero-api'
import { HeroEdit } from '@/features/hero/edit'

export const Route = createFileRoute('/_authenticated/hero/$heroId')({
  component: HeroEditRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function HeroEditRoute() {
  const { heroId } = Route.useParams()
  const { data: hero, isLoading, isError } = useGetHeroQuery(heroId)

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (isError || !hero) {
    return (
      <>
        <Header fixed className='border-b'>
          <Search className='me-auto' />
          <ThemeSwitch />
          <ProfileDropdown />
        </Header>
        <div className='flex-1 [&>div]:h-full'>
          <NotFoundError />
        </div>
      </>
    )
  }

  return <HeroEdit hero={hero} />
}

