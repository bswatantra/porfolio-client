import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteHeroMutation, useBulkDeleteHeroesMutation } from '../api/hero-api'
import { useHero } from './hero-provider'

const CONFIRM_WORD = 'DELETE'

export function HeroDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, selectedRows, setSelectedRows } = useHero()
  const deleteMutation = useDeleteHeroMutation()
  const bulkDeleteMutation = useBulkDeleteHeroesMutation()
  const [confirmWord, setConfirmWord] = useState('')

  const handleDeleteConfirm = async () => {
    if (!currentRow) return
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      toast.success(`"${currentRow.name}" hero section deleted successfully.`)
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
        `Deleted ${res.deleted_count} ${res.deleted_count === 1 ? 'hero section' : 'hero sections'}.`
      )
    } catch {
      // Handled by query client
    }
  }

  return (
    <>
      {currentRow && (
        <ConfirmDialog
          key='hero-delete'
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
          title={`Delete ${currentRow.name}?`}
          desc={
            <>
              You are about to delete the hero section configuration for{' '}
              <strong>{currentRow.name}</strong>.
              <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
          isLoading={deleteMutation.isPending}
        />
      )}

      <ConfirmDialog
        key='hero-multi-delete'
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
            Delete {selectedRows.length} hero section(s)
          </span>
        }
        desc={
          <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Are you sure you want to permanently delete {selectedRows.length} selected hero section(s)?
            </p>
            <div className='space-y-1.5'>
              <Label htmlFor='confirm-delete' className='text-xs font-medium'>
                Type <span className='font-mono font-bold'>{CONFIRM_WORD}</span> to confirm:
              </Label>
              <Input
                id='confirm-delete'
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

