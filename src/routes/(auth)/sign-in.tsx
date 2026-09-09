import { createFileRoute, redirect } from '@tanstack/react-router'
import { signInSearchSchema } from '@/features/auth/schemas'
import { SignIn } from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: ({ context }) => {
    if (context.auth.accessToken) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignIn,
  validateSearch: signInSearchSchema,
})
