import { ExternalLink } from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const projects = [
  {
    name: 'Portfolio Admin',
    description: 'Full-stack admin dashboard for managing portfolio content.',
    status: 'active' as const,
    tech: ['React', 'TypeScript', 'Tailwind'],
    url: '#',
    repo: '#',
  },
  {
    name: 'E-Commerce API',
    description: 'RESTful API with cart, payments, and inventory management.',
    status: 'completed' as const,
    tech: ['Node.js', 'PostgreSQL', 'Docker'],
    url: '#',
    repo: '#',
  },
  {
    name: 'Design System',
    description: 'Component library with Storybook documentation.',
    status: 'active' as const,
    tech: ['React', 'Storybook', 'SCSS'],
    url: '#',
    repo: '#',
  },
  {
    name: 'AI Chat App',
    description: 'Real-time chat with AI assistant integration.',
    status: 'draft' as const,
    tech: ['Next.js', 'OpenAI', 'WebSockets'],
    url: '#',
    repo: '#',
  },
]

const statusConfig: Record<
  'active' | 'completed' | 'draft',
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  active: { label: 'Active', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  draft: { label: 'Draft', variant: 'outline' },
}

export function RecentProjects() {
  return (
    <ul className='divide-y divide-border'>
      {projects.map((project) => {
        const status = statusConfig[project.status]
        return (
          <li key={project.name} className='flex items-start gap-3 py-3 first:pt-0 last:pb-0'>
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-sm font-medium'>{project.name}</span>
                <Badge variant={status.variant} className='text-xs'>
                  {status.label}
                </Badge>
              </div>
              <p className='mt-0.5 text-xs text-muted-foreground line-clamp-1'>
                {project.description}
              </p>
              <div className='mt-1.5 flex flex-wrap gap-1'>
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className='rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground'
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className='flex shrink-0 gap-1'>
              <Button variant='ghost' size='icon' className='h-7 w-7' asChild>
                <a href={project.repo} target='_blank' rel='noreferrer'>
                  <IconGithub className='h-3.5 w-3.5' />
                  <span className='sr-only'>GitHub</span>
                </a>
              </Button>
              <Button variant='ghost' size='icon' className='h-7 w-7' asChild>
                <a href={project.url} target='_blank' rel='noreferrer'>
                  <ExternalLink className='h-3.5 w-3.5' />
                  <span className='sr-only'>Live</span>
                </a>
              </Button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
