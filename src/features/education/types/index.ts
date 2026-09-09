import type React from 'react'
import { type Row, type Table } from '@tanstack/react-table'
import {
  type Education,
  type EducationDegree,
  type EducationFormData,
  type EducationFormValues,
  type EducationImportDialogValues,
  type EducationList,
  type EducationSearch,
  type EducationStatus,
} from '../schemas'

export type EducationDialogType = 'delete' | 'import'

export type EducationContextType = {
  open: EducationDialogType | null
  setOpen: (str: EducationDialogType | null) => void
  currentRow: Education | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Education | null>>
}

export type EducationProviderProps = {
  children: React.ReactNode
}

export type EducationFormProps = {
  initialData?: Education
  mode?: 'create' | 'edit'
  onSuccess?: (data: Education) => void
}

export type EducationImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type EducationMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export type EducationTableProps = {
  data: Education[]
}

export type EducationEditProps = {
  education: Education
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

export type {
  Education,
  EducationDegree,
  EducationStatus,
  EducationList,
  EducationFormData,
  EducationFormValues,
  EducationImportDialogValues,
  EducationSearch,
}
