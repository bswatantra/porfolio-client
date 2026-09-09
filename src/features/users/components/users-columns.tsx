import { type ColumnDef } from '@tanstack/react-table'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type User } from '../schemas'
import { DataTableRowActions } from './data-table-row-actions'

export const usersColumns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const username = row.original.username
      const email = row.original.email
      const initials = username.slice(0, 2).toUpperCase()

      return (
        <div className='flex items-center gap-3'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='text-xs font-semibold bg-primary/10 text-primary'>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='font-medium text-sm'>{username}</span>
            <span className='text-xs text-muted-foreground'>{email}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Full Name' />
    ),
    cell: ({ row }) => {
      const fullName = row.original.full_name
      return (
        <span className='text-sm text-foreground'>
          {fullName || <span className='text-muted-foreground italic'>None</span>}
        </span>
      )
    },
  },
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const isActive = row.original.is_active
      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className='gap-1 capitalize'
        >
          {isActive ? (
            <CheckCircle2 className='h-3 w-3 text-emerald-400' />
          ) : (
            <XCircle className='h-3 w-3 text-muted-foreground' />
          )}
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return true
      const isActive = row.getValue(id) as boolean
      const statusString = isActive ? 'active' : 'inactive'
      return (value as string[]).includes(statusString)
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const rawDate = row.original.created_at
      try {
        const formatted = new Date(rawDate).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        return <span className='text-xs text-muted-foreground'>{formatted}</span>
      } catch {
        return <span className='text-xs text-muted-foreground'>{rawDate}</span>
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
