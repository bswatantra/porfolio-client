import { createFileRoute } from '@tanstack/react-router'
import { Projects } from '@/features/projects'
import { projectSearchSchema } from '@/features/projects/schemas'

export const Route = createFileRoute('/_authenticated/projects/')({
  validateSearch: projectSearchSchema,
  component: Projects,
})
