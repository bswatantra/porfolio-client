import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteAboutMutation, useBulkDeleteAboutMutation } from '../api/about-api'
import { useAbout } from './about-provider'

const CONFIRM_WORD = 'DELETE'

export function AboutDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, selectedRows, setSelectedRows } = useAbout()
  const deleteMutation = useDeleteAboutMutation()
  const bulkDeleteMutation = useBulkDeleteAboutMutation()
  const [confirmWord, setConfirmWord] = useState('')

  const handleDeleteConfirm = async () => {
    if (!currentRow) return
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      toast.success(`"${currentRow.title}" section deleted successfully.`)
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
    } catch {
      // Handled by query client
    }
  }

  const handleBulkDeleteConfirm = async () => {
    if (confirmWord.trim() !== CONFIRM_WORD) {
      toast.error(`Please type "${CONFIRM_WORD}" to confirm.`)
      return
    }

    const ids = selectedRows.map((row) => row.original.id)
    try {
      const res = await bulkDeleteMutation.mutateAsync(ids)
      setConfirmWord('')
      setOpen(null)
      setSelectedRows([])
      toast.success(
        `Deleted ${res.deleted_count} ${res.deleted_count === 1 ? 'about section' : 'about sections'}.`
      )
    } catch {
      // Handled by query client
    }
  }

  return (
    <>
      {currentRow && (
        <ConfirmDialog
          key='about-delete'
          destructive
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen(null)
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          handleConfirm={handleDeleteConfirm}
          className='max-w-md'
          title={`Delete ${currentRow.title}?`}
          desc={
            <>
              You are about to delete the about me configuration for{' '}
              <strong>{currentRow.title}</strong>.
              <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
          isLoading={deleteMutation.isPending}
        />
      )}

      <ConfirmDialog
        key='about-multi-delete'
        destructive
        open={open === 'multi-delete'}
        onOpenChange={() => {
          setOpen(null)
          setConfirmWord('')
        }}
        handleConfirm={handleBulkDeleteConfirm}
        disabled={confirmWord.trim() !== CONFIRM_WORD || bulkDeleteMutation.isPending}
        title={
          <span className='text-destructive'>
            <AlertTriangle className='me-1 inline-block stroke-destructive' size={18} />
            Delete {selectedRows.length} about section(s)
          </span>
        }
        desc={
          <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Are you sure you want to permanently delete {selectedRows.length} selected about section(s)?
            </p>
            <div className='space-y-1.5'>
              <Label htmlFor='confirm-about-delete' className='text-xs font-medium'>
                Type <span className='font-mono font-bold'>{CONFIRM_WORD}</span> to confirm:
              </Label>
              <Input
                id='confirm-about-delete'
                value={confirmWord}
                onChange={(e) => setConfirmWord(e.target.value)}
                placeholder={CONFIRM_WORD}
                className='font-mono'
              />
            </div>
          </div>
        }
        confirmText='Delete selected'
        isLoading={bulkDeleteMutation.isPending}
      />
    </>
  )
}

