import { createFileRoute } from '@tanstack/react-router'
import { Experiences } from '@/features/experiences'
import { experienceSearchSchema } from '@/features/experiences/schemas'

export const Route = createFileRoute('/_authenticated/experiences/')({
  validateSearch: experienceSearchSchema,
  component: Experiences,
})
