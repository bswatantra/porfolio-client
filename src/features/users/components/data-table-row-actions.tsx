import { DotsHorizontalIcon } from '@radix-ui/react-icons'
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
import { userSchema } from '../schemas'
import { type DataTableRowActionsProps } from '../types'
import { useUsers } from './users-provider'

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const user = userSchema.parse(row.original)
  const { setOpen, setCurrentRow } = useUsers()

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
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(user)
            setOpen('update')
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <Edit3 size={15} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(user.id)
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
            setCurrentRow(user)
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
