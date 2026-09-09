import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { AlertCircle, Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import {
  userAuthFormSchema as formSchema,
  type UserAuthFormValues,
} from '@/features/auth/schemas'
import { type UserAuthFormProps } from '@/features/auth/types'
import {
  useLoginMutation,
  type LoginResponse,
} from '@/features/auth/api/auth-api'
import { applyServerValidationErrors } from '@/features/auth/utils/server-form-errors'

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const router = useRouter()
  const { auth } = useAuthStore()
  const loginMutation = useLoginMutation()

  const form = useForm<UserAuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: UserAuthFormValues): void {
    form.clearErrors()

    loginMutation.mutate(data, {
      onSuccess: async (res: LoginResponse): Promise<void> => {
        auth.setUser({
          accountNo: res.user.id,
          email: res.user.email,
          username: res.user.username,
          fullName: res.user.full_name,
          role: ['user'],
          exp: Date.now() + res.expires_in * 1000,
        })
        auth.setAccessToken(res.access_token)

        toast.success(
          `Welcome back, ${res.user.full_name || res.user.username}!`
        )

        await router.invalidate()

        const targetPath: string = redirectTo || '/dashboard'
        navigate({ to: targetPath, replace: true })
      },
      onError: (error: unknown): void => {
        // Render server validation errors exclusively within the form below the triggered fields
        applyServerValidationErrors(error, form.setError)
      },
    })
  }

  const isLoading: boolean = loginMutation.isPending
  const rootError = form.formState.errors.root?.message

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {rootError && (
          <Alert variant='destructive'>
            <AlertCircle className='size-4' />
            <AlertDescription>{rootError}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='absolute inset-e-0 -top-0.5 text-sm font-medium text-muted-foreground hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Sign in
        </Button>
      </form>
    </Form>
  )
}
