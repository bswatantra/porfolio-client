import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { applyServerValidationErrors } from '@/features/auth/utils/server-form-errors'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '../api/users-api'
import { statuses } from '../data/data'
import {
  createUserFormSchema,
  type User,
  type UserFormData,
  type UserCreatePayload,
  type UserUpdatePayload,
} from '../schemas'
import { type UserFormProps } from '../types'

export function UserForm({
  initialData,
  mode = 'create',
  onSuccess,
  onCancel,
}: UserFormProps & { onCancel?: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const isEdit = mode === 'edit' && Boolean(initialData)

  const form = useForm<UserFormData>({
    resolver: zodResolver(createUserFormSchema(isEdit)),
    defaultValues: {
      full_name: initialData?.full_name ?? '',
      username: initialData?.username ?? '',
      email: initialData?.email ?? '',
      password: '',
      status: initialData ? (initialData.is_active ? 'active' : 'inactive') : 'active',
    },
  })

  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation()
  const isPending = createMutation.isPending || updateMutation.isPending
  const rootError = form.formState.errors.root?.message

  const onSubmit = async (values: UserFormData) => {
    form.clearErrors()
    const isActive = values.status === 'active'

    try {
      if (isEdit && initialData) {
        const updatePayload: UserUpdatePayload = {
          email: values.email.trim(),
          username: values.username.trim(),
          full_name: values.full_name?.trim() || null,
          is_active: isActive,
        }
        if (values.password && values.password.trim().length > 0) {
          updatePayload.password = values.password
        }
        const updated = await updateMutation.mutateAsync({
          id: initialData.id,
          payload: updatePayload,
        })
        toast.success('User updated successfully.')
        onSuccess?.(updated as User)
      } else {
        const createPayload: UserCreatePayload = {
          email: values.email.trim(),
          username: values.username.trim(),
          password: values.password || '',
          full_name: values.full_name?.trim() || null,
          is_active: isActive,
        }
        const created = await createMutation.mutateAsync(createPayload)
        toast.success('User created successfully.')
        onSuccess?.(created as User)
      }
    } catch (error) {
      applyServerValidationErrors(error, form.setError)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {rootError && (
          <div className='rounded-md bg-destructive/15 p-3 text-sm text-destructive'>
            {rootError}
          </div>
        )}

        <FormField
          control={form.control}
          name='full_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Jane Doe' {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='janedoe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='jane@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{isEdit ? 'New Password' : 'Password'}</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={
                        isEdit
                          ? 'Leave blank to keep current'
                          : '••••••••'
                      }
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                    <span className='sr-only'>
                      {showPassword ? 'Hide password' : 'Show password'}
                    </span>
                  </Button>
                </div>
                {isEdit && (
                  <FormDescription>
                    Leave blank to preserve current password.
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        <div className='flex items-center gap-2'>
                          {s.value === 'active' ? (
                            <CheckCircle2 className='size-3.5 text-emerald-500' />
                          ) : (
                            <XCircle className='size-3.5 text-muted-foreground' />
                          )}
                          <span>{s.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          {onCancel && (
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isPending}>
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isEdit ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
