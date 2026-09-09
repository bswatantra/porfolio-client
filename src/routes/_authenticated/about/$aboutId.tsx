import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { useGetAboutQuery } from '@/features/about/api/about-api'
import { AboutEdit } from '@/features/about/edit'

export const Route = createFileRoute('/_authenticated/about/$aboutId')({
  component: AboutEditRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function AboutEditRoute() {
  const { aboutId } = Route.useParams()
  const { data: about, isLoading, isError } = useGetAboutQuery(aboutId)

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (isError || !about) {
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

  return <AboutEdit about={about} />
}

