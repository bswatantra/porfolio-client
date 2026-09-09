import { z } from 'zod'

export const userAuthFormSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
  password: z
    .string()
    .min(1, 'Please enter your password.')
    .min(7, 'Password must be at least 7 characters long.'),
})

export const signUpFormSchema = z
  .object({
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'Please enter your email.' : undefined,
    }),
    password: z
      .string()
      .min(1, 'Please enter your password.')
      .min(7, 'Password must be at least 7 characters long.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export const forgotPasswordFormSchema = z.object({
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Please enter your email.' : undefined),
  }),
})

export const otpFormSchema = z.object({
  otp: z
    .string()
    .min(6, 'Please enter the 6-digit code.')
    .max(6, 'Please enter the 6-digit code.'),
})

export const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export type UserAuthFormValues = z.infer<typeof userAuthFormSchema>
export type SignUpFormValues = z.infer<typeof signUpFormSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>
export type OtpFormValues = z.infer<typeof otpFormSchema>
export type SignInSearch = z.infer<typeof signInSearchSchema>
