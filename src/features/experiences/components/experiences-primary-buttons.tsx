import { Link } from '@tanstack/react-router'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useExperiences } from './experiences-provider'

export function ExperiencesPrimaryButtons() {
  const { setOpen } = useExperiences()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>Import</span> <Download size={18} />
      </Button>
      <Button asChild className='space-x-1'>
        <Link to='/experiences/new'>
          <span>Add Experience</span> <Plus size={18} />
        </Link>
      </Button>
    </div>
  )
}
