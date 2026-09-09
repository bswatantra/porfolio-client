import { ArrowLeft, Briefcase, Building2, Calendar, Check, Copy, MapPin, Sparkles, Wrench } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Experience } from '@/features/experiences/schemas'
import { useGetActiveHeroQuery } from '@/features/hero/api/hero-api'

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

export function ExperienceSingleView({ experience }: { experience: Experience }) {
  const [copied, setCopied] = useState(false)
  const { data: hero } = useGetActiveHeroQuery()

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Experience link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className='min-h-screen bg-background text-foreground antialiased'>
      {/* Top Navbar */}
      <header className='sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-3'>
          <Button asChild variant='ghost' size='sm' className='gap-2 -ml-2 text-muted-foreground hover:text-foreground'>
            <Link to='/' hash='experience'>
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
        {/* Experience Header Banner */}
        <div className='relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card/80 to-muted/30 p-8 sm:p-12 shadow-sm'>
          <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl' />

          {/* Badges */}
          <div className='mb-4 flex flex-wrap items-center gap-2'>
            {experience.current && (
              <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400'>
                <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
                Current Role
              </span>
            )}
            <Badge variant='outline' className={employmentColors[experience.employmentType] || ''}>
              {employmentLabels[experience.employmentType] || experience.employmentType}
            </Badge>
          </div>

          {/* Role & Company */}
          <h1 className='mb-2 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl'>
            {experience.role}
          </h1>
          <div className='mb-6 flex items-center gap-2 text-lg font-semibold text-primary sm:text-xl'>
            <Building2 className='h-5 w-5' />
            <span>{experience.company}</span>
          </div>

          {/* Timeline & Location */}
          <div className='flex flex-wrap items-center gap-6 border-t border-border/40 pt-6 text-sm text-muted-foreground'>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-primary' />
              <span>
                {formatDate(experience.startDate)} – {experience.current ? 'Present' : formatDate(experience.endDate)}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-primary' />
              <span>{experience.location}</span>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main Responsibilities Column */}
          <div className='space-y-6 lg:col-span-2'>
            <Card className='border-border/60 bg-card/60 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <Sparkles className='h-4 w-4 text-primary' />
                  Role Responsibilities &amp; Impact
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base'>
                {experience.description.split('\n\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column */}
          <div className='space-y-6'>
            {/* Skills & Technologies Card */}
            <Card className='border-border/60 bg-card/60 backdrop-blur-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  <Wrench className='h-4 w-4 text-primary' />
                  Skills &amp; Technologies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {experience.skills.map((skill) => (
                    <span
                      key={skill}
                      className='inline-flex items-center rounded-lg border border-border/70 bg-muted/60 px-2.5 py-1 font-mono text-xs font-medium text-foreground transition-colors hover:border-primary/40'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Summary Card */}
            <Card className='border-border/60 bg-card/60 backdrop-blur-sm'>
              <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                  <Briefcase className='h-4 w-4 text-primary' />
                  Role Details
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-xs'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Employment Type</span>
                  <span className='font-semibold capitalize text-foreground'>
                    {employmentLabels[experience.employmentType] || experience.employmentType}
                  </span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Location</span>
                  <span className='font-semibold text-foreground'>{experience.location}</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Started</span>
                  <span className='font-semibold text-foreground'>{formatDate(experience.startDate)}</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Ended</span>
                  <span className='font-semibold text-foreground'>
                    {experience.current ? 'Present' : formatDate(experience.endDate)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <div className='rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center'>
              <h4 className='mb-1 text-sm font-bold text-foreground'>Work with me</h4>
              <p className='mb-4 text-xs text-muted-foreground leading-relaxed'>
                Available for engineering roles, technical consulting, and advisory engagements.
              </p>
              {hero?.email && (
                <Button asChild size='sm' className='w-full rounded-full'>
                  <a href={`mailto:${hero.email}?subject=Regarding%20${encodeURIComponent(experience.role)}`}>
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

