import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { handleServerError } from '@/lib/handle-server-error'
import { useDeleteBlogMutation } from '../../api/blogs-api'
import type { Blog } from '../../types'

interface BlogDeleteDialogProps {
  blog: Blog | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function BlogDeleteDialog({
  blog,
  open,
  onOpenChange,
  onSuccess,
}: BlogDeleteDialogProps) {
  const deleteBlogMutation = useDeleteBlogMutation()

  const handleDelete = async () => {
    if (!blog) return
    try {
      await deleteBlogMutation.mutateAsync(blog.id)
      toast.success(`"${blog.title}" was permanently deleted from the database.`)
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      handleServerError(err)
    }
  }

  if (!blog) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      destructive
      isLoading={deleteBlogMutation.isPending}
      handleConfirm={handleDelete}
      className='max-w-md'
      title={`Delete "${blog.title}"?`}
      desc={
        <div className='space-y-2 text-sm text-muted-foreground'>
          <p>
            You are about to permanently remove this blog post and its contents from the
            blog list.
          </p>
          <p className='font-semibold text-foreground'>
            This action cannot be undone.
          </p>
        </div>
      }
      confirmText='Delete Post'
    />
  )
}
