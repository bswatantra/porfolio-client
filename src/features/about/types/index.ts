import { type Row } from '@tanstack/react-table'
import { type About } from '../schemas'

export type { About }

export type AboutDialogType = 'delete' | 'multi-delete'

export interface AboutContextType {
  open: AboutDialogType | null
  setOpen: (str: AboutDialogType | null) => void
  currentRow: About | null
  setCurrentRow: React.Dispatch<React.SetStateAction<About | null>>
  selectedRows: Row<About>[]
  setSelectedRows: React.Dispatch<React.SetStateAction<Row<About>[]>>
}

export interface AboutFormProps {
  about?: About
}

