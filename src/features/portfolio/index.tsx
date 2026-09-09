import { Link } from '@tanstack/react-router'
import { AlertCircle, RefreshCw, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EducationSection } from './components/education-section'
import { ExperienceSection } from './components/experience-section'
import { Hero, PortfolioNavbar } from './components/hero'
import { PortfolioSEO } from './components/portfolio-seo'
import { ProjectsSection } from './components/projects-section'
import { SkillsSection } from './components/skills-section'
import { usePortfolio } from './hooks/use-portfolio'
import type { PortfolioOwner } from './types'
import type { About } from '@/features/about/types'

/* ── About / Stats section ──────────────────────────────────────── */
function AboutSection({
  owner,
  about,
  projectsCount = 0,
  skillsCount = 0,
}: {
  owner: PortfolioOwner
  about?: About | null
  projectsCount?: number
  skillsCount?: number
}) {
  const displayStats = [
    {
      label: 'Years of Experience',
      value: about?.yearsOfExperience || (owner.stats[0]?.value && owner.stats[0].value !== '0+' ? owner.stats[0].value : '0+'),
    },
    {
      label: 'Projects Shipped',
      value:
        about?.projectsCount !== undefined
          ? `${about.projectsCount}+`
          : projectsCount > 0
            ? `${projectsCount}+`
            : '0+',
    },
    {
      label: 'Skills Mastered',
      value:
        about?.skillsCount !== undefined
          ? `${about.skillsCount}`
          : skillsCount > 0
            ? `${skillsCount}`
            : '0',
    },
    {
      label: 'Open Source Stars',
      value: about?.openSourceStars || (owner.stats[3]?.value && owner.stats[3].value !== '0' ? owner.stats[3].value : '0'),
    },
  ]

  // Don't render empty about section if no about content exists
  if (!about && !owner.about && projectsCount === 0 && skillsCount === 0) {
    return null
  }

  return (
    <section id='about' className='py-24'>
      <div className='mx-auto max-w-5xl px-4'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Text */}
          <div>
            <span className='mb-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary'>
              {about?.eyebrow || 'About me'}
            </span>
            <h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl'>
              {about?.title ? (
                about.title
              ) : (
                <>
                  Building the future,{' '}
                  <span className='bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent'>
                    one solution at a time
                  </span>
                </>
              )}
            </h2>
            {(about?.description || owner.about) && (
              <p className='mb-6 text-base leading-relaxed text-muted-foreground whitespace-pre-line'>
                {about?.description || owner.about}
              </p>
            )}
            <div className='flex flex-wrap gap-3'>
              {(about?.email || owner.email) && (
                <Button asChild className='rounded-full gap-2'>
                  <a href={`mailto:${about?.email || owner.email}`}>Let&apos;s work together</a>
                </Button>
              )}
              {(about?.github || owner.github) && (
                <Button asChild variant='outline' className='rounded-full'>
                  <a href={about?.github || owner.github} target='_blank' rel='noreferrer'>
                    View GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className='grid grid-cols-2 gap-4'>
            {displayStats.map((stat) => (
              <div
                key={stat.label}
                className='flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/50 p-6 text-center backdrop-blur-sm transition-all hover:border-primary/30'
              >
                <span className='mb-1 bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-4xl font-black text-transparent'>
                  {stat.value}
                </span>
                <span className='text-xs text-muted-foreground leading-snug'>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CTA banner ─────────────────────────────────────────────────── */
function CTABanner({ owner }: { owner: PortfolioOwner }) {
  if (!owner.email && !owner.linkedin) return null

  return (
    <section className='py-20'>
      <div className='mx-auto max-w-3xl px-4 text-center'>
        <div className='relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-violet-500/5 to-cyan-500/5 p-10 backdrop-blur-sm'>
          {/* Glow */}
          <div className='pointer-events-none absolute inset-0 -z-10'>
            <div className='absolute left-1/3 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
            <div className='absolute right-1/3 bottom-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl' />
          </div>

          <h2 className='mb-3 text-3xl font-extrabold tracking-tight sm:text-4xl'>
            Got a project in mind?
          </h2>
          <p className='mb-8 text-muted-foreground'>
            Whether it&apos;s a full-stack application, an API integration, or an open-source collaboration — I&apos;d love to hear from you.
          </p>
          <div className='flex flex-wrap justify-center gap-3'>
            {owner.email && (
              <Button size='lg' className='rounded-full gap-2 shadow-lg shadow-primary/25' asChild>
                <a href={`mailto:${owner.email}`}>Get in touch</a>
              </Button>
            )}
            {owner.linkedin && (
              <Button size='lg' variant='outline' className='rounded-full' asChild>
                <a href={owner.linkedin} target='_blank' rel='noreferrer'>
                  Connect on LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ─────────────────────────────────────────────────────── */
function Footer({ owner }: { owner: PortfolioOwner }) {
  return (
    <footer className='border-t border-border/50 py-8'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-muted-foreground'>
        <span>
          © {new Date().getFullYear()} {owner.name || 'Portfolio'} · All rights reserved.
        </span>
        <div className='flex items-center gap-4'>
          {owner.github && (
            <a href={owner.github} target='_blank' rel='noreferrer' className='hover:text-foreground transition-colors'>
              GitHub
            </a>
          )}
          {owner.linkedin && (
            <a href={owner.linkedin} target='_blank' rel='noreferrer' className='hover:text-foreground transition-colors'>
              LinkedIn
            </a>
          )}
          <Button asChild size='sm' variant='ghost' className='h-7 gap-1.5 text-xs'>
            <Link to='/sign-in'>
              <Shield className='h-3 w-3' />
              Admin
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export function PortfolioPage() {
  const { data, isLoading, isError, refetchAll } = usePortfolio()

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center'>
        <div className='relative mb-4 flex items-center justify-center'>
          <div className='h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary' />
        </div>
        <p className='font-mono text-sm text-muted-foreground'>Loading portfolio data...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center'>
        <div className='mx-auto max-w-md space-y-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 backdrop-blur-sm'>
          <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
            <AlertCircle className='h-6 w-6' />
          </div>
          <h2 className='text-xl font-bold tracking-tight'>Failed to Load Portfolio</h2>
          <p className='text-sm text-muted-foreground leading-relaxed'>
            Unable to connect to the backend server. Please verify the API service and database are running and try again.
          </p>
          <div className='flex items-center justify-center gap-3 pt-2'>
            <Button onClick={() => refetchAll()} variant='default' className='gap-2 rounded-full'>
              <RefreshCw className='h-4 w-4' />
              Retry
            </Button>
            <Button asChild variant='outline' className='rounded-full'>
              <Link to='/sign-in'>Admin Login</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background text-foreground antialiased'>
      {/* Dynamic SEO (Title, Meta, OG, Twitter, JSON-LD Schema) */}
      <PortfolioSEO data={data} />

      <PortfolioNavbar owner={data.owner} />
      <main>
        <Hero owner={data.owner} />
        <AboutSection
          owner={data.owner}
          about={data.about}
          projectsCount={data.about?.projectsCount ?? data.projects.length}
          skillsCount={data.about?.skillsCount ?? data.skills.length}
        />
        <ExperienceSection experiences={data.experiences} isLoading={isLoading} />
        <ProjectsSection projects={data.projects} isLoading={isLoading} />
        <SkillsSection skills={data.skills} isLoading={isLoading} />
        <EducationSection education={data.education} isLoading={isLoading} />
        <CTABanner owner={data.owner} />
      </main>
      <Footer owner={data.owner} />
    </div>
  )
}
