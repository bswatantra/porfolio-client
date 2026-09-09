import { createFileRoute } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { NotFoundError } from '@/features/errors/not-found-error'
import { ExperienceSingleView } from '@/features/portfolio/components/experience-single-view'
import { usePortfolioExperience } from '@/features/portfolio/hooks/use-portfolio'

export const Route = createFileRoute('/experience/$experienceId')({
  component: ExperienceSingleRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function ExperienceSingleRoute() {
  const { experienceId } = Route.useParams()
  const { data: experience, isLoading, isError } = usePortfolioExperience(experienceId)

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Loader2 className='size-8 animate-spin text-primary' />
      </div>
    )
  }

  if (isError || !experience) {
    return <NotFoundError />
  }

  return <ExperienceSingleView experience={experience} />
}

