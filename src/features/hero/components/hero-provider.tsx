import React, { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import useDialogState from '@/hooks/use-dialog-state'
import { type Hero } from '../schemas'
import { type HeroContextType, type HeroDialogType } from '../types'

const HeroContext = React.createContext<HeroContextType | null>(null)

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<HeroDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Hero | null>(null)
  const [selectedRows, setSelectedRows] = useState<Row<Hero>[]>([])

  return (
    <HeroContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        selectedRows,
        setSelectedRows,
      }}
    >
      {children}
    </HeroContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useHero = () => {
  const heroContext = React.useContext(HeroContext)
  if (!heroContext) {
    throw new Error('useHero has to be used within <HeroProvider>')
  }
  return heroContext
}

