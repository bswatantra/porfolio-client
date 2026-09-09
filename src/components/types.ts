import type React from 'react'
import type { Root, Content, Trigger } from '@radix-ui/react-popover'

export type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  disabled?: boolean
  desc: React.JSX.Element | string
  cancelBtnText?: string
  confirmText?: React.ReactNode
  destructive?: boolean
  isLoading?: boolean
  className?: string
  children?: React.ReactNode
} & (
  | { form: string; handleConfirm?: undefined }
  | { form?: undefined; handleConfirm: () => void }
)

export type DatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder?: string
}

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  ref?: React.Ref<HTMLInputElement>
}

export type SelectDropdownProps = {
  onValueChange?: (value: string) => void
  defaultValue: string | undefined
  placeholder?: string
  isPending?: boolean
  items: { label: string; value: string }[] | undefined
  disabled?: boolean
  className?: string
  isControlled?: boolean
}

export type LongTextProps = {
  children: React.ReactNode
  className?: string
  contentClassName?: string
}

export type SignOutDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type LearnMoreProps = React.ComponentProps<typeof Root> & {
  contentProps?: React.ComponentProps<typeof Content>
  triggerProps?: React.ComponentProps<typeof Trigger>
}
