import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { NotFoundError } from '@/features/errors/not-found-error'
import { useGetProjectQuery } from '@/features/projects/api/projects-api'
import { ProjectEdit } from '@/features/projects/edit'

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  component: ProjectEditRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function ProjectEditRoute() {
  const { projectId } = Route.useParams()
  const { data: project, isLoading, isError } = useGetProjectQuery(projectId)

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (isError || !project) {
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

  return <ProjectEdit project={project} />
}
