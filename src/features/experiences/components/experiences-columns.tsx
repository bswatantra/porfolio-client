import { type ColumnDef } from '@tanstack/react-table'
import { Building2, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { employmentTypes, statuses } from '../data/data'
import { type Experience } from '../schemas'
import { DataTableRowActions } from './data-table-row-actions'

export const experiencesColumns: ColumnDef<Experience>[] = [
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
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role & Company' />
    ),
    meta: {
      className: 'ps-1 min-w-[200px]',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='font-semibold text-foreground'>
            {row.original.role}
          </span>
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <Building2 className='size-3.5' />
            <span>{row.original.company}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'employmentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const type = employmentTypes.find(
        (t) => t.value === row.original.employmentType
      )

      return (
        <Badge variant='outline' className='font-normal capitalize'>
          {type?.icon && (
            <type.icon className='me-1 size-3 text-muted-foreground' />
          )}
          {type?.label ?? row.original.employmentType}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Location' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      return (
        <div className='flex items-center gap-1 text-xs text-muted-foreground'>
          <MapPin className='size-3.5 shrink-0' />
          <span className='truncate'>{row.original.location}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Duration' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const { startDate, endDate, current } = row.original
      return (
        <div className='flex items-center gap-1.5 text-xs'>
          <span className='whitespace-nowrap'>
            {startDate} – {endDate}
          </span>
          {current && (
            <Badge
              variant='secondary'
              className='border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0 text-[10px] text-emerald-600 dark:text-emerald-400'
            >
              Current
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'skills',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Skills / Tech' />
    ),
    meta: { className: 'ps-1 min-w-[180px]', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const skills = row.original.skills || []
      const visible = skills.slice(0, 3)
      const remaining = skills.length - visible.length

      return (
        <div className='flex flex-wrap items-center gap-1'>
          {visible.map((skill) => (
            <Badge
              key={skill}
              variant='secondary'
              className='px-1.5 py-0 text-[11px] font-normal'
            >
              {skill}
            </Badge>
          ))}
          {remaining > 0 && (
            <Badge
              variant='outline'
              className='px-1 py-0 text-[10px] text-muted-foreground'
            >
              +{remaining}
            </Badge>
          )}
        </div>
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

      if (!status) return null

      return (
        <div className='flex items-center gap-1.5 text-xs capitalize'>
          {status.icon && (
            <status.icon
              className={`size-3.5 ${
                status.value === 'active'
                  ? 'text-emerald-500'
                  : status.value === 'completed'
                    ? 'text-blue-500'
                    : 'text-muted-foreground'
              }`}
            />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
