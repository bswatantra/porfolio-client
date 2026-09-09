import { Link } from '@tanstack/react-router'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSkills } from './skills-provider'

export function SkillsPrimaryButtons() {
  const { setOpen } = useSkills()
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
        <Link to='/skills/new'>
          <span>Add Skill</span> <Plus size={18} />
        </Link>
      </Button>
    </div>
  )
}
