import { createFileRoute } from '@tanstack/react-router'
import { Users } from '@/features/users'
import { userSearchSchema } from '@/features/users/schemas'

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: userSearchSchema,
  component: Users,
})
