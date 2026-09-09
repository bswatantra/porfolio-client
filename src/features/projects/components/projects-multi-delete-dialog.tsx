'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Project } from '../schemas'
import { type ProjectsMultiDeleteDialogProps } from '../types'
import { useBulkDeleteProjectsMutation } from '../api/projects-api'

const CONFIRM_WORD = 'DELETE'

export function ProjectsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: ProjectsMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const bulkDeleteMutation = useBulkDeleteProjectsMutation()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    const ids = selectedRows.map((row) => (row.original as Project).id)
    onOpenChange(false)

    try {
      const res = await bulkDeleteMutation.mutateAsync(ids)
      setValue('')
      table.resetRowSelection()
      toast.success(
        `Deleted ${res.deleted_count} ${res.deleted_count === 1 ? 'project' : 'projects'}.`
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
          {selectedRows.length > 1 ? 'projects' : 'project'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='text-muted-foreground'>
            Are you sure you want to delete the selected items? This action
            cannot be undone and will permanently remove{' '}
            <strong>{selectedRows.length}</strong>{' '}
            {selectedRows.length > 1 ? 'projects' : 'project'} from your
            portfolio.
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>

          <div className='space-y-2'>
            <Label htmlFor='confirm-delete'>
              To confirm, type <strong>{CONFIRM_WORD}</strong> below:
            </Label>
            <Input
              id='confirm-delete'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={CONFIRM_WORD}
              className='font-mono'
            />
          </div>
        </div>
      }
      confirmText='Delete'
      destructive
      handleConfirm={handleDelete}
      isLoading={bulkDeleteMutation.isPending}
    />
  )
}
