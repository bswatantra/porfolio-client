import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteProjectMutation } from '../api/projects-api'
import { ProjectsImportDialog } from './projects-import-dialog'
import { useProjects } from './projects-provider'

export function ProjectsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useProjects()
  const deleteMutation = useDeleteProjectMutation()

  const handleDeleteConfirm = async () => {
    if (!currentRow) return
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      toast.success(`"${currentRow.title}" deleted successfully.`)
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
      <ProjectsImportDialog
        key='projects-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <ConfirmDialog
          key='project-delete'
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
          title={`Delete ${currentRow.title}?`}
          desc={
            <>
              You are about to remove <strong>{currentRow.title}</strong> from
              your portfolio projects.
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
