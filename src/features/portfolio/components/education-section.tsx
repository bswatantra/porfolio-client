import { Calendar, GraduationCap, MapPin } from 'lucide-react'
import type { Education } from '@/features/education/schemas'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeading } from './experience-section'

function formatDate(dateStr: string) {
  if (!dateStr) return 'Present'
  const [year, month] = dateStr.split('-')
  return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

const degreeLabels: Record<string, string> = {
  bachelor: "Bachelor's",
  master: "Master's",
  doctorate: 'Doctorate / PhD',
  associate: "Associate's",
  diploma: 'Diploma',
  bootcamp: 'Bootcamp',
  certificate: 'Certificate',
  other: 'Other',
}

const statusStyle: Record<string, string> = {
  completed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'in-progress': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  deferred: 'bg-muted text-muted-foreground border-border',
}

export function EducationSection({
  education = [],
  isLoading,
}: {
  education?: Education[]
  isLoading?: boolean
}) {
  return (
    <section id='education' className='bg-muted/20 py-24'>
      <div className='mx-auto max-w-4xl px-4'>
        <SectionHeading
          eyebrow='Academic background'
          title='Education'
          description='Formal education and certifications that shaped my engineering foundation.'
        />

        {isLoading && education.length === 0 ? (
          <div className='relative mt-14'>
            <div className='absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:block' />

            <div className='space-y-8'>
              {[1, 2].map((idx) => (
                <div key={idx} className='relative sm:pl-12'>
                  {/* Icon node skeleton */}
                  <div className='absolute left-0 top-5 hidden sm:flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-sm'>
                    <Skeleton className='h-3.5 w-3.5 rounded-full' />
                  </div>

                  <div className='rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm'>
                    <div className='mb-3 flex flex-wrap items-start justify-between gap-2'>
                      <div className='space-y-1.5'>
                        <Skeleton className='h-5 w-48 sm:w-64' />
                        <Skeleton className='h-4 w-40' />
                      </div>
                      <Skeleton className='h-5 w-20 rounded-full' />
                    </div>

                    <div className='mb-4 flex flex-wrap gap-4'>
                      <Skeleton className='h-3.5 w-32' />
                      <Skeleton className='h-3.5 w-24' />
                      <Skeleton className='h-3.5 w-20' />
                    </div>

                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-full' />
                      <Skeleton className='h-4 w-5/6' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : education.length === 0 ? (
          <div className='mt-12 rounded-2xl border border-dashed border-border/70 p-12 text-center'>
            <p className='text-sm text-muted-foreground'>No education records published yet.</p>
          </div>
        ) : (
          <div className='relative mt-14'>
            <div className='absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:block' />

            <div className='space-y-8'>
            {education.map((edu) => (
              <div key={edu.id} className='relative sm:pl-12'>
                {/* Icon node */}
                <div className='absolute left-0 top-5 hidden sm:flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/40 bg-background shadow-sm shadow-primary/20'>
                  <GraduationCap className='h-4 w-4 text-primary' />
                </div>

                <div className='rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5'>
                  <div className='mb-3 flex flex-wrap items-start justify-between gap-2'>
                    <div>
                      <h3 className='text-lg font-bold'>{edu.institution}</h3>
                      <p className='mt-0.5 text-sm font-semibold text-primary'>
                        {degreeLabels[edu.degree]} in {edu.fieldOfStudy}
                      </p>
                    </div>
                    <Badge variant='outline' className={`shrink-0 text-xs ${statusStyle[edu.status]}`}>
                      {edu.status === 'in-progress' ? 'In Progress' : edu.status.charAt(0).toUpperCase() + edu.status.slice(1)}
                    </Badge>
                  </div>

                  <div className='mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground'>
                    <span className='flex items-center gap-1.5'>
                      <Calendar className='h-3.5 w-3.5' />
                      {formatDate(edu.startDate)} – {edu.current ? 'Present' : formatDate(edu.endDate)}
                    </span>
                    <span className='flex items-center gap-1.5'>
                      <MapPin className='h-3.5 w-3.5' />
                      {edu.location}
                    </span>
                    {edu.grade && (
                      <span className='font-medium text-foreground'>Grade: {edu.grade}</span>
                    )}
                  </div>

                  <p className='mb-3 text-sm leading-relaxed text-muted-foreground'>{edu.description}</p>

                  {edu.activities && (
                    <p className='text-xs text-muted-foreground'>
                      <span className='font-semibold text-foreground'>Activities: </span>
                      {edu.activities}
                    </p>
                  )}
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
