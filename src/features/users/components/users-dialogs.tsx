import { ConfirmDialog } from '@/components/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useDeleteUserMutation } from '../api/users-api'
import { useUsers } from './users-provider'
import { UserForm } from './user-form'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  const deleteMutation = useDeleteUserMutation()

  const handleDelete = async () => {
    if (!currentRow) return
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      toast.success(`User "${currentRow.username}" deleted successfully.`)
      setOpen(null)
      setCurrentRow(null)
    } catch {
      // Handled by query client
    }
  }

  return (
    <>
      {/* Create Dialog */}
      <Dialog
        open={open === 'create'}
        onOpenChange={(val) => {
          if (!val) setOpen(null)
        }}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user profile with access credentials and system role.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            mode='create'
            onSuccess={() => setOpen(null)}
            onCancel={() => setOpen(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {currentRow && (
        <Dialog
          open={open === 'update'}
          onOpenChange={(val) => {
            if (!val) {
              setOpen(null)
              setCurrentRow(null)
            }
          }}
        >
          <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update account details, role permissions, or password for @{currentRow.username}.
              </DialogDescription>
            </DialogHeader>
            <UserForm
              mode='edit'
              initialData={currentRow}
              onSuccess={() => {
                setOpen(null)
                setCurrentRow(null)
              }}
              onCancel={() => {
                setOpen(null)
                setCurrentRow(null)
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {currentRow && (
        <ConfirmDialog
          open={open === 'delete'}
          onOpenChange={(val) => {
            if (!val) {
              setOpen(null)
              setCurrentRow(null)
            }
          }}
          handleConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
          title='Delete User'
          desc={`Are you sure you want to delete user "${currentRow.username}" (${currentRow.email})? This action cannot be undone.`}
          confirmText='Delete'
          destructive
        />
      )}
    </>
  )
}
