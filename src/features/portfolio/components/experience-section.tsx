import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Experience } from '@/features/experiences/schemas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

function formatDate(dateStr: string) {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const employmentColors: Record<string, string> = {
  'full-time': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'part-time': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  contract: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  freelance: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  internship: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
}

const employmentLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
}

export function ExperienceSection({
  experiences = [],
  isLoading,
}: {
  experiences?: Experience[]
  isLoading?: boolean
}) {
  return (
    <section id='experience' className='py-24'>
      <div className='mx-auto max-w-4xl px-4'>
        <SectionHeading
          eyebrow='Where I have worked'
          title='Experience'
          description='My professional journey building AI-powered products and full-stack applications.'
        />

        {isLoading && experiences.length === 0 ? (
          <div className='relative mt-14'>
            {/* Vertical timeline rail */}
            <div className='absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:block' />

            <div className='space-y-8'>
              {[1, 2, 3].map((idx) => (
                <div key={idx} className='relative sm:pl-12'>
                  {/* Timeline node skeleton */}
                  <div className='absolute left-0 top-5 hidden sm:flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm'>
                    <Skeleton className='h-3 w-3 rounded-full' />
                  </div>

                  <div className='rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-sm'>
                    {/* Header */}
                    <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
                      <div className='space-y-2'>
                        <Skeleton className='h-5 w-44 sm:w-56' />
                        <Skeleton className='h-4 w-32' />
                      </div>
                      <div className='flex flex-shrink-0 gap-2'>
                        <Skeleton className='h-5 w-16 rounded-full' />
                        <Skeleton className='h-5 w-20 rounded-full' />
                      </div>
                    </div>

                    {/* Meta */}
                    <div className='mb-4 flex flex-wrap gap-4'>
                      <Skeleton className='h-3.5 w-36' />
                      <Skeleton className='h-3.5 w-24' />
                    </div>

                    {/* Description */}
                    <div className='mb-4 space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-5/6' />
                      <Skeleton className='h-4 w-3/4' />
                    </div>

                    {/* Skills + CTA */}
                    <div className='flex flex-wrap items-center justify-between gap-3'>
                      <div className='flex flex-wrap gap-1.5'>
                        <Skeleton className='h-5 w-16 rounded-md' />
                        <Skeleton className='h-5 w-20 rounded-md' />
                        <Skeleton className='h-5 w-14 rounded-md' />
                        <Skeleton className='h-5 w-24 rounded-md' />
                      </div>
                      <Skeleton className='h-7 w-20 rounded-full' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : experiences.length === 0 ? (
          <div className='mt-12 rounded-2xl border border-dashed border-border/70 p-12 text-center'>
            <p className='text-sm text-muted-foreground'>No experience records published yet.</p>
          </div>
        ) : (
          <div className='relative mt-14'>
            {/* Vertical timeline rail */}
            <div className='absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:block' />

            <div className='space-y-8'>
            {experiences.map((exp, i) => (
              <div key={exp.id} className='relative sm:pl-12'>
                {/* Timeline node */}
                <div className='absolute left-0 top-5 hidden sm:flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/40 bg-background shadow-sm shadow-primary/20'>
                  <span className='text-[10px] font-bold text-primary'>{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className='group rounded-2xl border border-border/60 bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5'>
                  {/* Header */}
                  <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
                    <div>
                      <h3 className='text-lg font-bold leading-tight'>
                        <Link
                          to='/experience/$experienceId'
                          params={{ experienceId: exp.id }}
                          className='hover:text-primary transition-colors hover:underline'
                        >
                          {exp.role}
                        </Link>
                      </h3>
                      <p className='mt-0.5 text-sm font-semibold text-primary'>{exp.company}</p>
                    </div>
                    <div className='flex flex-shrink-0 flex-wrap gap-2'>
                      {exp.current && (
                        <span className='inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400'>
                          <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                          Current
                        </span>
                      )}
                      <Badge
                        variant='outline'
                        className={`text-xs ${employmentColors[exp.employmentType]}`}
                      >
                        {employmentLabels[exp.employmentType]}
                      </Badge>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className='mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5' />
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <MapPin className='h-3.5 w-3.5' />
                      {exp.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className='mb-4 text-sm leading-relaxed text-muted-foreground'>
                    {exp.description}
                  </p>

                  {/* Skills */}
                  <div className='flex flex-wrap items-center justify-between gap-3'>
                    <div className='flex flex-wrap gap-1.5'>
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className='rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-xs text-muted-foreground'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Button
                      variant='ghost'
                      size='sm'
                      className='gap-1 rounded-full text-xs h-7 text-muted-foreground hover:text-foreground'
                      asChild
                    >
                      <Link to='/experience/$experienceId' params={{ experienceId: exp.id }}>
                        Details
                        <ArrowRight className='h-3 w-3' />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ── Shared section heading ─────────────────────────────────────── */
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className='flex flex-col items-center text-center'>
      <span className='mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary'>
        {eyebrow}
      </span>
      <h2 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>{title}</h2>
      {description && (
        <p className='mt-3 max-w-xl text-sm text-muted-foreground leading-relaxed sm:text-base'>
          {description}
        </p>
      )}
    </div>
  )
}
