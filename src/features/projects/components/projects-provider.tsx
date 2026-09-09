import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Project } from '../schemas'
import {
  type ProjectsContextType,
  type ProjectsDialogType,
  type ProjectsProviderProps,
} from '../types'

const ProjectsContext = React.createContext<ProjectsContextType | null>(null)

export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const [open, setOpen] = useDialogState<ProjectsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Project | null>(null)

  return (
    <ProjectsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ProjectsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => {
  const projectsContext = React.useContext(ProjectsContext)

  if (!projectsContext) {
    throw new Error('useProjects has to be used within <ProjectsProvider>')
  }

  return projectsContext
}
