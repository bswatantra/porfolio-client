import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Education } from '../schemas'
import {
  type EducationContextType,
  type EducationDialogType,
  type EducationProviderProps,
} from '../types'

const EducationContext = React.createContext<EducationContextType | null>(null)

export function EducationProvider({ children }: EducationProviderProps) {
  const [open, setOpen] = useDialogState<EducationDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Education | null>(null)

  return (
    <EducationContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </EducationContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEducation = () => {
  const educationContext = React.useContext(EducationContext)

  if (!educationContext) {
    throw new Error('useEducation has to be used within <EducationProvider>')
  }

  return educationContext
}
