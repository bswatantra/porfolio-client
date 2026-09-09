import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Skill } from '../schemas'
import {
  type SkillsContextType,
  type SkillsDialogType,
  type SkillsProviderProps,
} from '../types'

const SkillsContext = React.createContext<SkillsContextType | null>(null)

export function SkillsProvider({ children }: SkillsProviderProps) {
  const [open, setOpen] = useDialogState<SkillsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Skill | null>(null)

  return (
    <SkillsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </SkillsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSkills = () => {
  const skillsContext = React.useContext(SkillsContext)

  if (!skillsContext) {
    throw new Error('useSkills has to be used within <SkillsProvider>')
  }

  return skillsContext
}
