import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useBlogStore } from '../../data/blogs-store'
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
  const deleteBlog = useBlogStore((state) => state.deleteBlog)

  const handleDelete = () => {
    if (!blog) return
    deleteBlog(blog.id)
    toast.success(`"${blog.title}" was deleted.`)
    onOpenChange(false)
    onSuccess?.()
  }

  if (!blog) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      destructive
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
