import React, { useState } from 'react'
import { type Row } from '@tanstack/react-table'
import useDialogState from '@/hooks/use-dialog-state'
import { type About } from '../schemas'
import { type AboutContextType, type AboutDialogType } from '../types'

const AboutContext = React.createContext<AboutContextType | null>(null)

export function AboutProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<AboutDialogType>(null)
  const [currentRow, setCurrentRow] = useState<About | null>(null)
  const [selectedRows, setSelectedRows] = useState<Row<About>[]>([])

  return (
    <AboutContext.Provider
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
    </AboutContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAbout = () => {
  const aboutContext = React.useContext(AboutContext)
  if (!aboutContext) {
    throw new Error('useAbout has to be used within <AboutProvider>')
  }
  return aboutContext
}

