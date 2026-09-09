import { createFileRoute } from '@tanstack/react-router'
import { EducationNew } from '@/features/education/new'

export const Route = createFileRoute('/_authenticated/education/new')({
  component: EducationNew,
})
