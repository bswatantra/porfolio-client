import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Hero } from '../schemas'
import { HeroRowActions } from './hero-row-actions'

export const heroColumns: ColumnDef<Hero>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name & Title' />
    ),
    meta: { className: 'ps-1 min-w-[200px]', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const hero = row.original
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='font-semibold text-foreground'>{hero.name}</span>
          <span className='line-clamp-1 text-xs text-muted-foreground'>
            {hero.title}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Typewriter Roles' />
    ),
    cell: ({ row }) => {
      const roles = row.original.roles || []
      return (
        <div className='flex flex-wrap gap-1 max-w-[260px]'>
          {roles.map((r) => (
            <Badge key={r} variant='secondary' className='text-[10px] px-1.5 py-0'>
              {r}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    cell: ({ row }) => (
      <span className='text-xs text-muted-foreground'>{row.original.location}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { availableForWork, isActive } = row.original
      return (
        <div className='flex flex-wrap gap-1.5'>
          {isActive ? (
            <Badge className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs'>
              Active Live
            </Badge>
          ) : (
            <Badge variant='outline' className='text-muted-foreground text-xs'>
              Draft
            </Badge>
          )}
          {availableForWork && (
            <Badge variant='secondary' className='text-[10px] text-primary'>
              Available
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <HeroRowActions row={row} />,
  },
]

