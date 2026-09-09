import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { NotFoundError } from '@/features/errors/not-found-error'
import { ProjectSingleView } from '@/features/portfolio/components/project-single-view'
import { usePortfolioProject } from '@/features/portfolio/hooks/use-portfolio'

export const Route = createFileRoute('/project/$projectId')({
  component: ProjectSingleRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function ProjectSingleRoute() {
  const { projectId } = Route.useParams()
  const { data: project, isLoading, isError } = usePortfolioProject(projectId)

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Loader2 className='size-8 animate-spin text-primary' />
      </div>
    )
  }

  if (isError || !project) {
    return <NotFoundError />
  }

  return <ProjectSingleView project={project} />
}

