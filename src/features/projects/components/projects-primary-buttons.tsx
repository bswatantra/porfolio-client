import { Link } from '@tanstack/react-router'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProjects } from './projects-provider'

export function ProjectsPrimaryButtons() {
  const { setOpen } = useProjects()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <Download size={18} />
      </Button>
      <Button className='space-x-1' asChild>
        <Link to='/projects/new'>
          <span>Add Project</span> <Plus size={18} />
        </Link>
      </Button>
    </div>
  )
}
