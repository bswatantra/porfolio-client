import { z } from 'zod'

export const userStatusSchema = z.enum(['active', 'inactive'])

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  full_name: z.string().nullable().optional(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const userListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  page_size: z.number(),
  items: z.array(userSchema),
})
export const createUserFormSchema = (isEdit: boolean = false) =>
  z.object({
    email: z
      .string()
      .min(1, 'Email is required.')
      .email('Please enter a valid email address.'),
    username: z
      .string()
      .min(1, 'Username is required.')
      .min(3, 'Username must be at least 3 characters.')
      .max(50, 'Username cannot exceed 50 characters.')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens.'
      ),
    full_name: z.string().optional(),
    password: isEdit
      ? z
          .string()
          .optional()
          .refine(
            (val) => !val || val.length >= 6,
            'Password must be at least 6 characters.'
          )
      : z
          .string()
          .min(1, 'Password is required.')
          .min(6, 'Password must be at least 6 characters.'),
    status: z.string().min(1, 'Please choose a status.'),
  })

export const userFormSchema = createUserFormSchema(false)

export const userSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(userStatusSchema).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export type User = z.infer<typeof userSchema>
export type UserListResponse = z.infer<typeof userListResponseSchema>
export type UserFormData = z.infer<typeof userFormSchema>
export type UserFormValues = UserFormData
export type UserStatus = z.infer<typeof userStatusSchema>
export type UserSearch = z.infer<typeof userSearchSchema>

export interface UserCreatePayload {
  email: string
  username: string
  password: string
  full_name?: string | null
  is_active?: boolean
}

export interface UserUpdatePayload {
  email?: string
  username?: string
  password?: string
  full_name?: string | null
  is_active?: boolean
}
