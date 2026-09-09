import type React from 'react'
import { type Row, type Table } from '@tanstack/react-table'
import {
  type Project,
  type ProjectCategory,
  type ProjectFormData,
  type ProjectFormValues,
  type ProjectImportDialogValues,
  type ProjectList,
  type ProjectSearch,
  type ProjectStatus,
} from '../schemas'

export type ProjectsDialogType = 'create' | 'update' | 'delete' | 'import'

export type ProjectsContextType = {
  open: ProjectsDialogType | null
  setOpen: (str: ProjectsDialogType | null) => void
  currentRow: Project | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Project | null>>
}

export type ProjectsProviderProps = {
  children: React.ReactNode
}

export type ProjectFormProps = {
  initialData?: Project
  mode?: 'create' | 'edit'
  onSuccess?: (data: Project) => void
}

export type ProjectsImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type ProjectsMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export type ProjectsTableProps = {
  data: Project[]
}

export type ProjectEditProps = {
  project: Project
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

export type {
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectList,
  ProjectFormData,
  ProjectFormValues,
  ProjectImportDialogValues,
  ProjectSearch,
}
