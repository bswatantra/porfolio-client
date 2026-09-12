import { ArrowRight, ExternalLink, Star } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { IconGithub } from '@/assets/brand-icons'
import type { Project } from '@/features/projects/schemas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeading } from './experience-section'

const categoryMeta: Record<string, { label: string; color: string; glow: string }> = {
  'full-stack': { label: 'Full Stack', color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
  'web-app': { label: 'Web App', color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/20' },
  'mobile-app': { label: 'Mobile', color: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/20' },
  'open-source': { label: 'Open Source', color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
  'api-backend': { label: 'API / Backend', color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
  'ai-ml': { label: 'AI / ML', color: 'from-primary to-violet-600', glow: 'shadow-primary/20' },
}

const statusBadge: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  completed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'in-progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  archived: 'bg-muted text-muted-foreground',
}

export function ProjectsSection({
  projects = [],
  isLoading = false,
}: {
  projects?: Project[]
  isLoading?: boolean
}) {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id='projects' className='bg-muted/20 py-24'>
      <div className='mx-auto max-w-6xl px-4'>
        <SectionHeading
          eyebrow="Things I've built"
          title='Projects'
          description='A selection of personal projects, open-source work, and production systems I have shipped.'
        />

        {isLoading && projects.length === 0 ? (
          <div className='mt-14 space-y-6'>
            {/* Featured skeleton cards */}
            <div className='grid gap-6 md:grid-cols-2'>
              <ProjectCardSkeleton featured />
              <ProjectCardSkeleton featured />
            </div>
            {/* Compact skeleton cards */}
            <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          </div>
        ) : (
          <>
            {/* Featured — large cards */}
            {featured.length > 0 && (
              <div className='mt-14 grid gap-6 md:grid-cols-2'>
                {featured.map((p) => (
                  <ProjectCard key={p.id} project={p} featured />
                ))}
              </div>
            )}

            {/* Rest — compact grid */}
            {rest.length > 0 && (
              <div className='mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                {rest.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}

            {projects.length === 0 && (
              <div className='mt-12 rounded-2xl border border-dashed border-border/70 p-12 text-center'>
                <p className='text-sm text-muted-foreground'>No projects published yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function ProjectCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className='relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm'>
      {/* Top accent line */}
      <Skeleton className='h-1.5 w-full rounded-none' />

      {/* Thumbnail / placeholder */}
      <Skeleton className={`w-full rounded-none ${featured ? 'h-44' : 'h-28'}`} />

      <div className='flex flex-1 flex-col p-5'>
        {/* Badges */}
        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <Skeleton className='h-5 w-16 rounded-full' />
          <Skeleton className='h-5 w-20 rounded-full' />
          {featured && <Skeleton className='h-5 w-20 rounded-full' />}
        </div>

        {/* Title + Tagline */}
        <Skeleton className='mb-1.5 h-5 w-3/4' />
        <Skeleton className='mb-3 h-3.5 w-1/2' />

        {/* Description */}
        <div className='mb-4 flex-1 space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />
          <Skeleton className='h-4 w-2/3' />
        </div>

        {/* Tech stack */}
        <div className='mb-4 flex flex-wrap gap-1.5'>
          <Skeleton className='h-5 w-14 rounded-md' />
          <Skeleton className='h-5 w-16 rounded-md' />
          <Skeleton className='h-5 w-12 rounded-md' />
          <Skeleton className='h-5 w-16 rounded-md' />
        </div>

        {/* Links / Buttons */}
        <div className='flex flex-wrap items-center gap-2'>
          <Skeleton className='h-8 w-24 rounded-full' />
          <Skeleton className='h-8 w-20 rounded-full' />
        </div>
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project
  featured?: boolean
}) {
  const cat = categoryMeta[project.category] ?? {
    label: project.category,
    color: 'from-primary to-violet-500',
    glow: 'shadow-primary/20',
  }
  const status = statusBadge[project.status] ?? ''

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl ${featured ? cat.glow : ''}`}>
      {/* Gradient header band */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${cat.color}`} />

      {/* Thumbnail / placeholder */}
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${cat.color}/10 ${featured ? 'h-44' : 'h-28'}`}
      >
        <div className={`text-6xl font-black tracking-tighter opacity-10 bg-gradient-to-br ${cat.color} bg-clip-text text-transparent select-none`}>
          {project.title.slice(0, 2).toUpperCase()}
        </div>
      </div>

      <div className='flex flex-1 flex-col p-5'>
        {/* Badges */}
        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <Badge variant='outline' className={`text-xs ${status}`}>
            {project.status.replace('-', ' ')}
          </Badge>
          <Badge variant='outline' className='text-xs'>
            {cat.label}
          </Badge>
          {project.featured && (
            <Badge className='gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs'>
              <Star className='h-3 w-3' />
              Featured
            </Badge>
          )}
        </div>

        {/* Title + tagline */}
        <h3 className='mb-1 text-base font-bold leading-snug'>
          <Link
            to='/project/$projectId'
            params={{ projectId: project.id }}
            className='hover:text-primary transition-colors hover:underline'
          >
            {project.title}
          </Link>
        </h3>
        <p className='mb-3 text-xs font-medium text-primary'>{project.tagline}</p>
        <p className='mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3'>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className='mb-4 flex flex-wrap gap-1.5'>
          {project.technologies.slice(0, featured ? 6 : 4).map((t) => (
            <span
              key={t}
              className='rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs text-muted-foreground'
            >
              {t}
            </span>
          ))}
          {project.technologies.length > (featured ? 6 : 4) && (
            <span className='rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs text-muted-foreground'>
              +{project.technologies.length - (featured ? 6 : 4)}
            </span>
          )}
        </div>

        {/* Links */}
        <div className='flex flex-wrap items-center gap-2'>
          <Button size='sm' className='gap-1 rounded-full text-xs' asChild>
            <Link to='/project/$projectId' params={{ projectId: project.id }}>
              Details
              <ArrowRight className='h-3 w-3' />
            </Link>
          </Button>
          {project.repoUrl && (
            <Button variant='outline' size='sm' className='gap-1.5 rounded-full text-xs' asChild>
              <a href={project.repoUrl} target='_blank' rel='noreferrer'>
                <IconGithub className='h-3.5 w-3.5' />
                Code
              </a>
            </Button>
          )}
          {project.liveUrl && (
            <Button variant='secondary' size='sm' className='gap-1.5 rounded-full text-xs' asChild>
              <a href={project.liveUrl} target='_blank' rel='noreferrer'>
                <ExternalLink className='h-3.5 w-3.5' />
                Live Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
