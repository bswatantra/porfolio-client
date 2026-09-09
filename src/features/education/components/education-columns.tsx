import { type ColumnDef } from '@tanstack/react-table'
import { BookOpen, Calendar, GraduationCap, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { degrees, statuses } from '../data/data'
import { type Education } from '../schemas'
import { DataTableRowActions } from './data-table-row-actions'

export const educationColumns: ColumnDef<Education>[] = [
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
    accessorKey: 'institution',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Institution & Field of Study'
      />
    ),
    meta: {
      className: 'ps-1 min-w-[220px]',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='font-semibold text-foreground'>
            {row.original.institution}
          </span>
          <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
            <BookOpen className='size-3 text-primary/70' />
            <span>{row.original.fieldOfStudy}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'degree',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Degree Level' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const degree = degrees.find((d) => d.value === row.original.degree)
      const Icon = degree?.icon ?? GraduationCap

      return (
        <Badge variant='outline' className='font-medium capitalize'>
          <Icon className='me-1 size-3.5 text-muted-foreground' />
          {degree?.label ?? row.original.degree}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'grade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Grade / Honors' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      if (!row.original.grade) {
        return <span className='text-xs text-muted-foreground'>—</span>
      }
      return (
        <Badge variant='secondary' className='bg-muted/60 text-xs font-normal'>
          {row.original.grade}
        </Badge>
      )
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
          <MapPin className='size-3 text-muted-foreground/80' />
          <span>{row.original.location}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Duration' />
    ),
    meta: { className: 'ps-1 min-w-[150px]', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const { startDate, endDate, current } = row.original

      return (
        <div className='flex flex-col gap-0.5'>
          <div className='flex items-center gap-1 text-xs font-medium text-foreground'>
            <Calendar className='size-3 text-muted-foreground' />
            <span>
              {startDate} – {endDate}
            </span>
          </div>
          {current && (
            <Badge
              variant='outline'
              className='w-fit border-emerald-500/30 bg-emerald-500/10 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400'
            >
              Enrolled
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
      const isCompleted = row.original.status === 'completed'
      const isInProgress = row.original.status === 'in-progress'

      return (
        <Badge
          variant='outline'
          className={`font-medium ${
            isCompleted
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
              : isInProgress
                ? 'border-blue-500/30 bg-blue-500/10 text-blue-600'
                : 'border-muted-foreground/30 text-muted-foreground'
          }`}
        >
          {status?.label ?? row.original.status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
      className: 'pe-4',
    },
  },
]
