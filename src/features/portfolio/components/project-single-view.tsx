import { ArrowLeft, Calendar, Check, Copy, ExternalLink, Globe, Layers, ShieldCheck, Sparkles, Star } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { IconGithub } from '@/assets/brand-icons'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Project } from '@/features/projects/schemas'
import { useGetActiveHeroQuery } from '@/features/hero/api/hero-api'

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  'full-stack': { label: 'Full Stack', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  'web-app': { label: 'Web App', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20' },
  'mobile-app': { label: 'Mobile App', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20' },
  'open-source': { label: 'Open Source', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  'api-backend': { label: 'API & Backend', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  'ai-ml': { label: 'AI & Machine Learning', color: 'from-primary to-violet-600', bg: 'bg-primary/10 text-primary border-primary/20' },
}

const statusBadge: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  completed: { label: 'Completed', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  'in-progress': { label: 'In Progress', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  archived: { label: 'Archived', className: 'bg-muted text-muted-foreground border-border' },
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  if (!year) return dateStr
  if (!month) return year
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

export function ProjectSingleView({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false)
  const { data: hero } = useGetActiveHeroQuery()

  const cat = categoryMeta[project.category] ?? {
    label: project.category,
    color: 'from-primary to-violet-500',
    bg: 'bg-muted border-border',
  }
  const status = statusBadge[project.status] ?? {
    label: project.status,
    className: 'bg-muted border-border',
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Project link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className='min-h-screen bg-background text-foreground antialiased'>
      {/* Top Navbar */}
      <header className='sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-3'>
          <Button asChild variant='ghost' size='sm' className='gap-2 -ml-2 text-muted-foreground hover:text-foreground'>
            <Link to='/' hash='projects'>
              <ArrowLeft className='h-4 w-4' />
              Back to Portfolio
            </Link>
          </Button>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5 rounded-full text-xs'
              onClick={handleCopyLink}
            >
              {copied ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='h-3.5 w-3.5' />}
              {copied ? 'Copied' : 'Share'}
            </Button>
            <ThemeSwitch />
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-4 py-12'>
        {/* Project Header Banner */}
        <div className='relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-muted/30 p-8 sm:p-12 shadow-sm'>
          {/* Ambient Glow */}
          <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />

          {/* Badges */}
          <div className='mb-4 flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className={status.className}>
              {status.label}
            </Badge>
            <Badge variant='outline' className={cat.bg}>
              {cat.label}
            </Badge>
            {project.featured && (
              <Badge className='gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs'>
                <Star className='h-3 w-3 fill-amber-500 text-amber-500' />
                Featured Project
              </Badge>
            )}
          </div>

          {/* Title & Tagline */}
          <h1 className='mb-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl'>
            {project.title}
          </h1>
          <p className='mb-6 text-lg font-medium text-primary sm:text-xl'>
            {project.tagline}
          </p>

          {/* Timeline & Actions Bar */}
          <div className='flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              <Calendar className='h-4 w-4 text-primary' />
              <span>
                {formatDate(project.startDate)} – {project.current ? 'Present' : formatDate(project.endDate)}
              </span>
            </div>

            <div className='flex flex-wrap gap-2.5'>
              {project.repoUrl && (
                <Button variant='outline' size='sm' className='gap-1.5 rounded-full' asChild>
                  <a href={project.repoUrl} target='_blank' rel='noreferrer'>
                    <IconGithub className='h-4 w-4' />
                    Source Code
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button size='sm' className='gap-1.5 rounded-full shadow-md shadow-primary/20' asChild>
                  <a href={project.liveUrl} target='_blank' rel='noreferrer'>
                    <ExternalLink className='h-4 w-4' />
                    Live Application
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Description Column */}
          <div className='space-y-6 lg:col-span-2'>
            <Card className='border-border/60 bg-card/60 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Sparkles className='h-4 w-4 text-primary' />
                  Project Overview &amp; Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base'>
                {project.description.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </CardContent>
            </Card>

            {/* Showcase Visual Block */}
            <div className={`relative flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${cat.color}/15 p-6 text-center select-none`}>
              <div className='absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
              <div className='relative z-10'>
                <div className='text-6xl font-black tracking-tighter opacity-20 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent'>
                  {project.title.slice(0, 3).toUpperCase()}
                </div>
                <p className='mt-2 text-xs font-mono uppercase tracking-widest text-muted-foreground'>
                  {cat.label} • {status.label}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className='space-y-6'>
            {/* Tech Stack Card */}
            <Card className='border-border/60 bg-card/60 backdrop-blur-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  <Layers className='h-4 w-4 text-primary' />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className='inline-flex items-center rounded-lg border border-border/70 bg-muted/60 px-2.5 py-1 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/40'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Specs Card */}
            <Card className='border-border/60 bg-card/60 backdrop-blur-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  <ShieldCheck className='h-4 w-4 text-primary' />
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-xs'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Status</span>
                  <span className='font-semibold capitalize text-foreground'>{project.status}</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Category</span>
                  <span className='font-semibold text-foreground'>{cat.label}</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Start Date</span>
                  <span className='font-semibold text-foreground'>{formatDate(project.startDate)}</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>End Date</span>
                  <span className='font-semibold text-foreground'>
                    {project.current ? 'Ongoing / Present' : formatDate(project.endDate)}
                  </span>
                </div>
                {project.liveUrl && (
                  <>
                    <Separator />
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground'>Deployment</span>
                      <a
                        href={project.liveUrl}
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-1 font-semibold text-primary hover:underline'
                      >
                        <Globe className='h-3 w-3' />
                        Live URL
                      </a>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Inquiry Callout */}
            <div className='rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center'>
              <h4 className='mb-1 text-sm font-bold text-foreground'>Like this project?</h4>
              <p className='mb-4 text-xs text-muted-foreground leading-relaxed'>
                Let&apos;s build something similar or collaborate on your next technical initiative.
              </p>
              {hero?.email && (
                <Button asChild size='sm' className='w-full rounded-full'>
                  <a href={`mailto:${hero.email}?subject=Regarding%20${encodeURIComponent(project.title)}`}>
                    Get in Touch
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='border-t border-border/50 py-8 text-center text-xs text-muted-foreground'>
        <p>© {new Date().getFullYear()} {hero?.name || 'Portfolio'} · All rights reserved.</p>
      </footer>
    </div>
  )
}

