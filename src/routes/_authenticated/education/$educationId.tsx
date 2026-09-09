import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { useGetEducationQuery } from '@/features/education/api/education-api'
import { EducationEdit } from '@/features/education/edit'

export const Route = createFileRoute(
  '/_authenticated/education/$educationId'
)({
  component: EducationEditRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function EducationEditRoute() {
  const { educationId } = Route.useParams()
  const { data: education, isLoading, isError } = useGetEducationQuery(educationId)

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (isError || !education) {
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

  return <EducationEdit education={education} />
}
