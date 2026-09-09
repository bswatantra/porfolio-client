import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLink, Star } from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { categories, statuses } from '../data/data'
import { type Project } from '../schemas'
import { DataTableRowActions } from './data-table-row-actions'

export const projectsColumns: ColumnDef<Project>[] = [
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
      <DataTableColumnHeader column={column} title='Project' />
    ),
    meta: {
      className: 'ps-1 min-w-[220px]',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const isFeatured = row.original.featured
      return (
        <div className='flex flex-col gap-0.5'>
          <div className='flex items-center gap-1.5'>
            <span className='font-semibold text-foreground'>
              {row.original.title}
            </span>
            {isFeatured && (
              <span title='Featured Project'>
                <Star className='size-3.5 fill-amber-500 text-amber-500' />
              </span>
            )}
          </div>
          <span className='line-clamp-1 text-xs text-muted-foreground'>
            {row.original.tagline}
          </span>
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const status = statuses.find((s) => s.value === row.original.status)
      const Icon = status?.icon

      return (
        <div className='flex items-center gap-1.5'>
          {row.original.status === 'active' && (
            <span className='size-2 rounded-full bg-emerald-500' />
          )}
          {row.original.status === 'in-progress' && (
            <span className='size-2 rounded-full bg-amber-500' />
          )}
          {row.original.status === 'completed' && (
            <span className='size-2 rounded-full bg-blue-500' />
          )}
          {row.original.status === 'archived' && (
            <span className='size-2 rounded-full bg-muted-foreground' />
          )}
          <span className='text-xs font-medium text-muted-foreground capitalize'>
            {status?.label ?? row.original.status}
          </span>
          {Icon && <Icon className='size-3 text-muted-foreground' />}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'technologies',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tech Stack' />
    ),
    meta: { className: 'ps-1 max-w-[220px]', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const techs = row.original.technologies
      const displayTechs = techs.slice(0, 3)
      const remainingCount = techs.length - 3

      return (
        <div className='flex flex-wrap items-center gap-1'>
          {displayTechs.map((t) => (
            <Badge
              key={t}
              variant='secondary'
              className='px-1.5 py-0 text-[10px] font-normal'
            >
              {t}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge
              variant='outline'
              className='px-1 py-0 text-[10px] text-muted-foreground'
              title={techs.slice(3).join(', ')}
            >
              +{remainingCount}
            </Badge>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const techs = row.getValue<string[]>(id)
      return value.some((v: string) => techs.includes(v))
    },
  },
  {
    id: 'links',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Links' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const { liveUrl, repoUrl } = row.original

      return (
        <div className='flex items-center gap-1'>
          {liveUrl ? (
            <Button
              variant='ghost'
              size='icon'
              className='size-7'
              title='Live Demo'
              asChild
            >
              <a href={liveUrl} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='size-3.5 text-primary' />
              </a>
            </Button>
          ) : (
            <span className='flex size-7 items-center justify-center text-xs text-muted-foreground/40'>
              —
            </span>
          )}
          {repoUrl && (
            <Button
              variant='ghost'
              size='icon'
              className='size-7'
              title='GitHub Repo'
              asChild
            >
              <a href={repoUrl} target='_blank' rel='noopener noreferrer'>
                <IconGithub className='size-3.5 text-muted-foreground' />
              </a>
            </Button>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Timeline' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const { startDate, endDate, current } = row.original
      return (
        <div className='flex flex-col text-xs'>
          <span className='font-medium text-foreground'>
            {startDate} – {endDate}
          </span>
          {current && (
            <span className='text-[10px] font-semibold text-emerald-600 dark:text-emerald-400'>
              Active Project
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
