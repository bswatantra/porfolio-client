import type React from 'react'
import {
  type ForgotPasswordFormValues,
  type OtpFormValues,
  type SignInSearch,
  type SignUpFormValues,
  type UserAuthFormValues,
} from '../schemas'

export interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export type SignUpFormProps = React.HTMLAttributes<HTMLFormElement>

export type ForgotPasswordFormProps = React.HTMLAttributes<HTMLFormElement>

export type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export type AuthLayoutProps = {
  children: React.ReactNode
}

export type {
  UserAuthFormValues,
  SignUpFormValues,
  ForgotPasswordFormValues,
  OtpFormValues,
  SignInSearch,
}
