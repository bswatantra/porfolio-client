import { useState } from 'react'
import { CircleArrowUp, Download, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { statuses } from '../data/data'
import { type Project } from '../schemas'
import { type DataTableBulkActionsProps } from '../types'
import { ProjectsMultiDeleteDialog } from './projects-multi-delete-dialog'

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: string) => {
    const selectedProjects = selectedRows.map((row) => row.original as Project)
    toast.promise(sleep(2000), {
      loading: 'Updating status...',
      success: () => {
        table.resetRowSelection()
        return `Status updated to "${status}" for ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''}.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  const handleBulkExport = () => {
    const selectedProjects = selectedRows.map((row) => row.original as Project)
    toast.promise(sleep(2000), {
      loading: 'Exporting projects...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedProjects.length} project${selectedProjects.length > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='project'>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label='Update status'
                  title='Update status'
                >
                  <CircleArrowUp />
                  <span className='sr-only'>Update status</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update status</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                defaultValue={status.value}
                onClick={() => handleBulkStatusChange(status.value)}
              >
                {status.icon && (
                  <status.icon className='size-4 text-muted-foreground' />
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export projects'
              title='Export projects'
            >
              <Download />
              <span className='sr-only'>Export projects</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export projects</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected projects'
              title='Delete selected projects'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected projects</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected projects</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ProjectsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
