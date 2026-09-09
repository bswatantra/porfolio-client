import { createFileRoute } from '@tanstack/react-router'
import { Skills } from '@/features/skills'
import { skillSearchSchema } from '@/features/skills/schemas'

export const Route = createFileRoute('/_authenticated/skills/')({
  validateSearch: skillSearchSchema,
  component: Skills,
})
