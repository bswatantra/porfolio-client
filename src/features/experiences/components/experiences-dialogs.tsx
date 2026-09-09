import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteExperienceMutation } from '../api/experiences-api'
import { ExperiencesImportDialog } from './experiences-import-dialog'
import { useExperiences } from './experiences-provider'

export function ExperiencesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useExperiences()
  const deleteMutation = useDeleteExperienceMutation()

  const handleDeleteConfirm = async () => {
    if (!currentRow) return
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      toast.success(
        `"${currentRow.role} at ${currentRow.company}" deleted successfully.`
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
      <ExperiencesImportDialog
        key='experiences-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <ConfirmDialog
          key='experience-delete'
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
          title={`Delete ${currentRow.role} at ${currentRow.company}?`}
          desc={
            <>
              You are about to remove <strong>{currentRow.role}</strong> at{' '}
              <strong>{currentRow.company}</strong> from your portfolio
              experiences.
              <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
        />
      )}
    </>
  )
}
