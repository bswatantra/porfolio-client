import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteSkillMutation } from '../api/skills-api'
import { SkillsImportDialog } from './skills-import-dialog'
import { useSkills } from './skills-provider'

export function SkillsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSkills()
  const deleteMutation = useDeleteSkillMutation()

  const handleDeleteConfirm = async () => {
    if (!currentRow) return
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      toast.success(`"${currentRow.name}" deleted successfully.`)
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
      <SkillsImportDialog
        key='skills-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <ConfirmDialog
          key='skill-delete'
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
          title={`Delete ${currentRow.name}?`}
          desc={
            <>
              You are about to remove <strong>{currentRow.name}</strong> from
              your portfolio skills.
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
