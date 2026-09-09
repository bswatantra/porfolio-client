import type React from 'react'
import { type Row, type Table } from '@tanstack/react-table'
import {
  type User,
  type UserFormData,
  type UserFormValues,
  type UserListResponse,
  type UserSearch,
  type UserStatus,
  type UserCreatePayload,
  type UserUpdatePayload,
} from '../schemas'

export type UsersDialogType = 'create' | 'update' | 'delete'

export type UsersContextType = {
  open: UsersDialogType | null
  setOpen: (str: UsersDialogType | null) => void
  currentRow: User | null
  setCurrentRow: React.Dispatch<React.SetStateAction<User | null>>
}

export type UsersProviderProps = {
  children: React.ReactNode
}

export type UserFormProps = {
  initialData?: User | null
  mode?: 'create' | 'edit'
  onSuccess?: (data: User) => void
}

export type UsersMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export type UsersTableProps = {
  data: User[]
  isLoading?: boolean
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

export type {
  User,
  UserFormData,
  UserFormValues,
  UserListResponse,
  UserSearch,
  UserStatus,
  UserCreatePayload,
  UserUpdatePayload,
}
