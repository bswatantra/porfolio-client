import { createFileRoute } from '@tanstack/react-router'
import { ExperienceNew } from '@/features/experiences/new'

export const Route = createFileRoute('/_authenticated/experiences/new')({
  component: ExperienceNew,
})
