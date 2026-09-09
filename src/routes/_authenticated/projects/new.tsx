import { createFileRoute } from '@tanstack/react-router'
import { ProjectNew } from '@/features/projects/new'

export const Route = createFileRoute('/_authenticated/projects/new')({
  component: ProjectNew,
})
