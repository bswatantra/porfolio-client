import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type User } from '../schemas'
import {
  type UsersContextType,
  type UsersDialogType,
  type UsersProviderProps,
} from '../types'

const UsersContext = React.createContext<UsersContextType | null>(null)

export function UsersProvider({ children }: UsersProviderProps) {
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  const [currentRow, setCurrentRow] = useState<User | null>(null)

  return (
    <UsersContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </UsersContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => {
  const usersContext = React.useContext(UsersContext)

  if (!usersContext) {
    throw new Error('useUsers has to be used within <UsersProvider>')
  }

  return usersContext
}
