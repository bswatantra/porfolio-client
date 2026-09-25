import { ExternalLink } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BlogDetail } from '../blog-detail'
import type { Blog } from '../../types'

interface BlogPreviewDialogProps {
  blog: Blog | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BlogPreviewDialog({
  blog,
  open,
  onOpenChange,
}: BlogPreviewDialogProps) {
  if (!blog) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[92vh] max-w-4xl p-0 overflow-hidden sm:rounded-2xl'>
        <DialogHeader className='flex flex-row items-center justify-between border-b border-border/60 px-6 py-3.5 space-y-0'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='bg-primary/10 text-primary border-primary/20 text-xs'>
              Live Preview
            </Badge>
            <DialogTitle className='text-sm font-semibold truncate max-w-md'>
              {blog.title}
            </DialogTitle>
          </div>

          <div className='flex items-center gap-2'>
            <Button asChild size='sm' variant='outline' className='h-8 gap-1.5 text-xs'>
              <Link to='/blogs/$blogId' params={{ blogId: blog.slug }} target='_blank'>
                <ExternalLink className='h-3.5 w-3.5' />
                Public Page
              </Link>
            </Button>
            <Button asChild size='sm' variant='default' className='h-8 text-xs'>
              <Link to='/manage-blogs/$blogId' params={{ blogId: blog.id }}>
                Edit Post
              </Link>
            </Button>
          </div>
        </DialogHeader>

        <DialogDescription className='sr-only'>
          Live preview of the blog post {blog.title}
        </DialogDescription>

        <ScrollArea className='max-h-[calc(92vh-60px)] px-6 py-4'>
          <BlogDetail blog={blog} isPreview />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
