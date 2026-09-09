import { Link } from '@tanstack/react-router'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEducation } from './education-provider'

export function EducationPrimaryButtons() {
  const { setOpen } = useEducation()
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
        <Link to='/education/new'>
          <span>Add Education</span> <Plus size={18} />
        </Link>
      </Button>
    </div>
  )
}
