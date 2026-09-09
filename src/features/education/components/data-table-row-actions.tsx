import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { Copy, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { educationSchema, type Education } from '../schemas'
import { type DataTableRowActionsProps } from '../types'
import { useEducation } from './education-provider'

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const parsed = educationSchema.safeParse(row.original)
  const education = parsed.success ? parsed.data : (row.original as Education)
  const { setOpen, setCurrentRow } = useEducation()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem asChild>
          <Link
            to='/education/$educationId'
            params={{ educationId: education.id }}
          >
            Edit
            <DropdownMenuShortcut>
              <Edit3 size={15} />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(education.id)
          }}
        >
          Copy ID
          <DropdownMenuShortcut>
            <Copy size={15} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(education)
            setOpen('delete')
          }}
          className='text-destructive focus:text-destructive'
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={15} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
