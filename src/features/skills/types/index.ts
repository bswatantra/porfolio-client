import type React from 'react'
import { type Row, type Table } from '@tanstack/react-table'
import {
  type Skill,
  type SkillCategory,
  type SkillFormData,
  type SkillFormValues,
  type SkillImportDialogValues,
  type SkillList,
  type SkillProficiency,
  type SkillSearch,
  type SkillStatus,
} from '../schemas'

export type SkillsDialogType = 'delete' | 'import'

export type SkillsContextType = {
  open: SkillsDialogType | null
  setOpen: (str: SkillsDialogType | null) => void
  currentRow: Skill | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Skill | null>>
}

export type SkillsProviderProps = {
  children: React.ReactNode
}

export type SkillFormProps = {
  initialData?: Skill
  mode?: 'create' | 'edit'
  onSuccess?: (data: Skill) => void
}

export type SkillsImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type SkillsMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export type SkillsTableProps = {
  data: Skill[]
}

export type SkillEditProps = {
  skill: Skill
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export interface DataTableBulkActionsProps<TData> {
  table: Table<TData>
}

export type {
  Skill,
  SkillCategory,
  SkillProficiency,
  SkillStatus,
  SkillList,
  SkillFormData,
  SkillFormValues,
  SkillImportDialogValues,
  SkillSearch,
}
