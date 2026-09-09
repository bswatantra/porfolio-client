import type React from 'react'
import { type Row, type Table } from '@tanstack/react-table'
import {
  type Experience,
  type ExperienceEmploymentType,
  type ExperienceFormData,
  type ExperienceFormValues,
  type ExperienceImportDialogValues,
  type ExperienceList,
  type ExperienceSearch,
  type ExperienceStatus,
} from '../schemas'

export type ExperiencesDialogType = 'create' | 'update' | 'delete' | 'import'

export type ExperiencesContextType = {
  open: ExperiencesDialogType | null
  setOpen: (str: ExperiencesDialogType | null) => void
  currentRow: Experience | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Experience | null>>
}

export type ExperiencesProviderProps = {
  children: React.ReactNode
}

export type ExperienceFormProps = {
  initialData?: Experience
  mode?: 'create' | 'edit'
  onSuccess?: (data: Experience) => void
}

export type ExperiencesImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type ExperiencesMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export type ExperiencesTableProps = {
  data: Experience[]
}

export type ExperienceEditProps = {
  experience: Experience
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

export type {
  Experience,
  ExperienceEmploymentType,
  ExperienceStatus,
  ExperienceList,
  ExperienceFormData,
  ExperienceFormValues,
  ExperienceImportDialogValues,
  ExperienceSearch,
}
