import { type ColumnDef } from '@tanstack/react-table'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { categories, proficiencies, statuses } from '../data/data'
import { type Skill } from '../schemas'
import { DataTableRowActions } from './data-table-row-actions'

export const skillsColumns: ColumnDef<Skill>[] = [
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
      <DataTableColumnHeader column={column} title='Skill / Technology' />
    ),
    meta: {
      className: 'ps-1 min-w-[180px]',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const isFeatured = row.original.featured
      return (
        <div className='flex items-center gap-1.5'>
          <span className='font-semibold text-foreground'>
            {row.original.name}
          </span>
          {isFeatured && (
            <span title='Featured Skill'>
              <Star className='size-3.5 fill-amber-500 text-amber-500' />
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const category = categories.find((c) => c.value === row.original.category)
      const Icon = category?.icon

      return (
        <Badge variant='outline' className='font-normal capitalize'>
          {Icon && <Icon className='me-1 size-3 text-muted-foreground' />}
          {category?.label ?? row.original.category}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'proficiency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Proficiency' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const prof = proficiencies.find(
        (p) => p.value === row.original.proficiency
      )

      return (
        <div className='flex items-center gap-2'>
          <Badge
            variant='outline'
            className={`font-medium capitalize ${prof?.colorClass ?? ''}`}
          >
            {prof?.label ?? row.original.proficiency}
          </Badge>
          <span className='text-xs text-muted-foreground'>
            {prof?.percentage}%
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'yearsOfExperience',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Experience' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const years = row.original.yearsOfExperience
      return (
        <span className='text-xs font-medium text-foreground'>
          {years} {years === 1 ? 'year' : 'years'}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const status = statuses.find((s) => s.value === row.original.status)

      return (
        <div className='flex items-center gap-1.5'>
          {row.original.status === 'active' && (
            <span className='size-2 rounded-full bg-emerald-500' />
          )}
          {row.original.status === 'learning' && (
            <span className='size-2 rounded-full bg-blue-500' />
          )}
          {row.original.status === 'archived' && (
            <span className='size-2 rounded-full bg-muted-foreground' />
          )}
          <span className='text-xs font-medium text-muted-foreground capitalize'>
            {status?.label ?? row.original.status}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Notes & Context' />
    ),
    meta: { className: 'ps-1 max-w-[280px]', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      return (
        <span className='line-clamp-1 text-xs text-muted-foreground'>
          {row.original.description}
        </span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
