'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../schemas'
import { type UsersMultiDeleteDialogProps } from '../types'
import { useBulkDeleteUsersMutation } from '../api/users-api'

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UsersMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const bulkDeleteMutation = useBulkDeleteUsersMutation()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    const ids = selectedRows.map((row) => (row.original as User).id)
    onOpenChange(false)

    try {
      const res = await bulkDeleteMutation.mutateAsync(ids)
      setValue('')
      table.resetRowSelection()
      toast.success(
        `Deleted ${res.deleted_count} ${res.deleted_count === 1 ? 'user' : 'users'}.`
      )
    } catch {
      // Handled by query client
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      disabled={value.trim() !== CONFIRM_WORD || bulkDeleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'users' : 'user'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete the selected users? <br />
            This action cannot be undone and permanently deletes their account records.
          </p>

          <Label className='my-2'>
            Username confirmation:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Type "${CONFIRM_WORD}" to confirm`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete Selected'
      destructive
      handleConfirm={handleDelete}
      isLoading={bulkDeleteMutation.isPending}
    />
  )
}
