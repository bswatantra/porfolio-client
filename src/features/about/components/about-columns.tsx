import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { type About } from '../schemas'
import { AboutRowActions } from './about-row-actions'

export const aboutColumns: ColumnDef<About>[] = [
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
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Headline & Eyebrow' />
    ),
    meta: { className: 'ps-1 min-w-[220px]', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const about = row.original
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-primary'>
            {about.eyebrow}
          </span>
          <span className='font-semibold text-foreground line-clamp-1'>
            {about.title}
          </span>
          <span className='line-clamp-1 text-xs text-muted-foreground'>
            {about.description}
          </span>
        </div>
      )
    },
  },
  {
    id: 'dynamicCounts',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dynamic Database Counts' />
    ),
    cell: ({ row }) => {
      const { projectsCount, skillsCount } = row.original
      return (
        <div className='flex flex-wrap gap-2 items-center'>
          <Badge variant='outline' className='bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-xs'>
            {projectsCount} Projects Shipped
          </Badge>
          <Badge variant='outline' className='bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 text-xs'>
            {skillsCount} Skills Mastered
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'yearsOfExperience',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Experience & Stars' />
    ),
    cell: ({ row }) => {
      const { yearsOfExperience, openSourceStars } = row.original
      return (
        <div className='flex flex-col text-xs text-muted-foreground'>
          <span>Exp: <strong className='text-foreground'>{yearsOfExperience}</strong></span>
          <span>Stars: <strong className='text-foreground'>{openSourceStars}</strong></span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { isActive } = row.original
      return isActive ? (
        <Badge className='bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs'>
          Active Live
        </Badge>
      ) : (
        <Badge variant='outline' className='text-muted-foreground text-xs'>
          Draft
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <AboutRowActions row={row} />,
  },
]

