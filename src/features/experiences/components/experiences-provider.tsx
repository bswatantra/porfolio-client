import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Experience } from '../schemas'
import {
  type ExperiencesContextType,
  type ExperiencesDialogType,
  type ExperiencesProviderProps,
} from '../types'

const ExperiencesContext = React.createContext<ExperiencesContextType | null>(
  null
)

export function ExperiencesProvider({ children }: ExperiencesProviderProps) {
  const [open, setOpen] = useDialogState<ExperiencesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Experience | null>(null)

  return (
    <ExperiencesContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ExperiencesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useExperiences = () => {
  const experiencesContext = React.useContext(ExperiencesContext)

  if (!experiencesContext) {
    throw new Error(
      'useExperiences has to be used within <ExperiencesProvider>'
    )
  }

  return experiencesContext
}
