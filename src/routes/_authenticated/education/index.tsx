import { createFileRoute } from '@tanstack/react-router'
import { Education } from '@/features/education'
import { educationSearchSchema } from '@/features/education/schemas'

export const Route = createFileRoute('/_authenticated/education/')({
  validateSearch: educationSearchSchema,
  component: Education,
})
