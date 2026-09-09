import { Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroPrimaryButtons() {
  return (
    <div className='flex items-center gap-2'>
      <Button asChild className='gap-1.5'>
        <Link to='/hero/new'>
          <Plus size={16} />
          <span>New Hero Section</span>
        </Link>
      </Button>
    </div>
  )
}

