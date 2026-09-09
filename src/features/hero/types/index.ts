import { type Row } from '@tanstack/react-table'
import { type Hero } from '../schemas'

export type { Hero }

export type HeroDialogType = 'delete' | 'multi-delete'

export interface HeroContextType {
  open: HeroDialogType | null
  setOpen: (str: HeroDialogType | null) => void
  currentRow: Hero | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Hero | null>>
  selectedRows: Row<Hero>[]
  setSelectedRows: React.Dispatch<React.SetStateAction<Row<Hero>[]>>
}

export interface HeroFormProps {
  hero?: Hero
}

