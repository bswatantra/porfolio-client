import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowDown, Mail, MapPin, Shield, Sparkles } from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PortfolioOwner } from '../types'

/* ── Typewriter ─────────────────────────────────────────────────── */
function Typewriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const current = words[idx % words.length]
    const speed = deleting ? 40 : 80
    const pause = deleting ? 300 : 1800

    if (!deleting && text === current) {
      timeout.current = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      timeout.current = setTimeout(() => {
        setDeleting(false)
        setIdx((i) => i + 1)
      }, speed)
    } else {
      timeout.current = setTimeout(() => {
        setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1))
      }, speed)
    }
    return () => { if (timeout.current) clearTimeout(timeout.current) }
  }, [text, deleting, idx, words])

  return (
    <span className='inline-flex items-center gap-1'>
      <span className='bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent'>
        {text}
      </span>
      <span className='animate-pulse text-primary'>|</span>
    </span>
  )
}

/* ── Grid background ─────────────────────────────────────────────── */
function GridBackground() {
  return (
    <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
      {/* Dot grid */}
      <div
        className='absolute inset-0 opacity-[0.03] dark:opacity-[0.07]'
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Glow orbs */}
      <div className='absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px] dark:bg-violet-500/10' />
      <div className='absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[120px] dark:bg-cyan-500/10' />
      <div className='absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]' />
    </div>
  )
}

/* ── Terminal chip ───────────────────────────────────────────────── */
function TerminalChip({ text }: { text: string }) {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/60 px-2.5 py-1 font-mono text-xs text-muted-foreground backdrop-blur-sm'>
      <span className='text-emerald-500'>$</span> {text}
    </span>
  )
}

/* ── Hero ────────────────────────────────────────────────────────── */
export function Hero({ owner }: { owner?: PortfolioOwner }) {
  const roles = owner?.roles && owner.roles.length > 0 ? owner.roles : ['Developer']
  const specializations = owner?.specializations ?? []
  const terminalChips = owner?.terminalChips ?? []

  return (
    <section
      id='hero'
      className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-28 text-center'
    >
      <GridBackground />

      {/* Available badge */}
      {owner?.availableForWork && (
        <div className='mb-8 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5'>
          <span className='relative flex h-2 w-2'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
            <span className='relative inline-flex h-2 w-2 rounded-full bg-emerald-500' />
          </span>
          <span className='text-xs font-medium text-emerald-600 dark:text-emerald-400'>
            Open to new opportunities
          </span>
        </div>
      )}

      {/* Name */}
      <h1 className='mb-3 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl'>
        Hi, I&apos;m{' '}
        <span className='relative'>
          <span className='relative z-10 bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent'>
            {owner?.name || 'Developer'}
          </span>
          {/* Underline glow */}
          <span className='absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-primary via-violet-500 to-cyan-500 opacity-60' />
        </span>
      </h1>

      {/* Typewriter role */}
      {roles.length > 0 && (
        <p className='mb-6 text-xl font-semibold sm:text-2xl lg:text-3xl'>
          <Typewriter words={roles} />
        </p>
      )}

      {/* Tagline */}
      {owner?.tagline && (
        <p className='mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed'>
          {owner.tagline}
        </p>
      )}

      {/* Specializations */}
      {specializations.length > 0 && (
        <div className='mb-8 flex flex-wrap justify-center gap-2'>
          {specializations.map((s) => (
            <Badge
              key={s}
              variant='secondary'
              className='gap-1.5 rounded-full px-3 py-1 text-xs font-medium'
            >
              <Sparkles className='h-3 w-3 text-violet-500' />
              {s}
            </Badge>
          ))}
        </div>
      )}

      {/* Terminal chips */}
      {terminalChips.length > 0 && (
        <div className='mb-10 flex flex-wrap justify-center gap-2'>
          {terminalChips.map((chip) => (
            <TerminalChip key={chip} text={chip} />
          ))}
        </div>
      )}

      {/* Location */}
      {owner?.location && (
        <div className='mb-8 flex items-center gap-1.5 text-sm text-muted-foreground'>
          <MapPin className='h-3.5 w-3.5' />
          {owner.location}
        </div>
      )}

      {/* CTAs */}
      <div className='flex flex-wrap justify-center gap-3'>
        {owner?.email && (
          <Button size='lg' className='gap-2 rounded-full shadow-lg shadow-primary/25' asChild>
            <a href={`mailto:${owner.email}`}>
              <Mail className='h-4 w-4' />
              Hire Me
            </a>
          </Button>
        )}
        {owner?.github && (
          <Button size='lg' variant='outline' className='gap-2 rounded-full' asChild>
            <a href={owner.github} target='_blank' rel='noreferrer'>
              <IconGithub className='h-4 w-4' />
              GitHub
            </a>
          </Button>
        )}
        {owner?.linkedin && (
          <Button size='lg' variant='outline' className='gap-2 rounded-full' asChild>
            <a href={owner.linkedin} target='_blank' rel='noreferrer'>
              <svg viewBox='0 0 24 24' className='h-4 w-4' fill='currentColor'>
                <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
              </svg>
              LinkedIn
            </a>
          </Button>
        )}
      </div>

      {/* Scroll cue */}
      <a
        href='#about'
        className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/40 transition-colors hover:text-muted-foreground'
        aria-label='Scroll down'
      >
        <span className='text-xs font-mono'>scroll</span>
        <ArrowDown className='h-4 w-4 animate-bounce' />
      </a>
    </section>
  )
}

/* ── Navbar ──────────────────────────────────────────────────────── */
export function PortfolioNavbar({ owner }: { owner?: PortfolioOwner }) {
  const sections = ['About', 'Experience', 'Projects', 'Skills', 'Education']
  const displayName = owner?.name || 'Portfolio'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className='sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
        {/* Logo */}
        <a href='#hero' className='flex items-center gap-2'>
          <span className='flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground'>
            {initials || 'ME'}
          </span>
          <span className='hidden text-sm font-semibold sm:block'>
            {displayName}
          </span>
        </a>

        {/* Nav links */}
        <nav className='hidden gap-1 md:flex'>
          {sections.map((s) => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className='rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground'
            >
              {s}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className='flex items-center gap-2'>
          <ThemeSwitch />
          <Button asChild size='sm' variant='outline' className='hidden gap-1.5projects sm:flex'>
            <Link to='/sign-in'>
              <Shield className='h-3.5 w-3.5' />
              Admin
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
