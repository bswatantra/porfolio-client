import { Link } from '@tanstack/react-router'
import {
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Blog } from '../../types'

interface BlogRowActionsProps {
  blog: Blog
  onPreview: (blog: Blog) => void
  onDelete: (blog: Blog) => void
}

export function BlogRowActions({
  blog,
  onPreview,
  onDelete,
}: BlogRowActionsProps) {
  const handleCopyLink = () => {
    const url = `${window.location.origin}/blogs/${blog.slug}`
    navigator.clipboard.writeText(url)
    toast.success('Public blog URL copied to clipboard')
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-8 w-8 p-0'>
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem onClick={() => onPreview(blog)}>
          <Eye className='mr-2 h-4 w-4 text-primary' />
          Preview Article
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to='/manage-blogs/$blogId' params={{ blogId: blog.id }}>
            <Edit3 className='mr-2 h-4 w-4' />
            Edit Article
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to='/blogs/$blogId' params={{ blogId: blog.slug }} target='_blank'>
            <ExternalLink className='mr-2 h-4 w-4' />
            View Public Page
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className='mr-2 h-4 w-4' />
          Copy URL
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onDelete(blog)}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
