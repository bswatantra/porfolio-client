import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { Copy, Edit3, ExternalLink, Trash2 } from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { projectSchema, type Project } from '../schemas'
import { type DataTableRowActionsProps } from '../types'
import { useProjects } from './projects-provider'

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const parsed = projectSchema.safeParse(row.original)
  const project = parsed.success ? parsed.data : (row.original as Project)
  const { setOpen, setCurrentRow } = useProjects()

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
      <DropdownMenuContent align='end' className='w-44'>
        <DropdownMenuItem asChild>
          <Link to='/projects/$projectId' params={{ projectId: project.id }}>
            Edit
            <DropdownMenuShortcut>
              <Edit3 size={15} />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(project.id)
          }}
        >
          Copy ID
          <DropdownMenuShortcut>
            <Copy size={15} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        {project.liveUrl && (
          <DropdownMenuItem asChild>
            <a
              href={project.liveUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='cursor-pointer'
            >
              View Live Demo
              <DropdownMenuShortcut>
                <ExternalLink size={15} />
              </DropdownMenuShortcut>
            </a>
          </DropdownMenuItem>
        )}

        {project.repoUrl && (
          <DropdownMenuItem asChild>
            <a
              href={project.repoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='cursor-pointer'
            >
              View Repository
              <DropdownMenuShortcut>
                <IconGithub className='size-3.5' />
              </DropdownMenuShortcut>
            </a>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(project)
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
