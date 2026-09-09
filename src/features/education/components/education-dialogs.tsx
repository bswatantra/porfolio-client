import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteEducationMutation } from '../api/education-api'
import { EducationImportDialog } from './education-import-dialog'
import { useEducation } from './education-provider'

export function EducationDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useEducation()
  const deleteMutation = useDeleteEducationMutation()

  const handleDeleteConfirm = async () => {
    if (!currentRow) return
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      toast.success(
        `"${currentRow.degree} in ${currentRow.fieldOfStudy}" deleted successfully.`
      )
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
    } catch {
      // Handled by query client
    }
  }

  return (
    <>
      <EducationImportDialog
        key='education-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <ConfirmDialog
          key='education-delete'
          destructive
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen('delete')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          handleConfirm={handleDeleteConfirm}
          className='max-w-md'
          title={`Delete ${currentRow.degree} at ${currentRow.institution}?`}
          desc={
            <>
              You are about to remove <strong>{currentRow.fieldOfStudy}</strong>{' '}
              from <strong>{currentRow.institution}</strong>.
              <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
          isLoading={deleteMutation.isPending}
        />
      )}
    </>
  )
}
