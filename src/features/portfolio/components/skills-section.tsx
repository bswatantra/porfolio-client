import type { Skill } from '@/features/skills/schemas'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeading } from './experience-section'

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  frontend: { label: 'Frontend', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  backend: { label: 'Backend', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  database: { label: 'Database', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  devops: { label: 'DevOps & Cloud', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  mobile: { label: 'Mobile', color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  design: { label: 'Design', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  tools: { label: 'Tools', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  languages: { label: 'Languages', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
}

// Proficiency → filled dots out of 5
const proficiencyDots: Record<string, number> = {
  expert: 5,
  advanced: 4,
  intermediate: 3,
  beginner: 2,
}

function ProficiencyDots({ level }: { level: string }) {
  const filled = proficiencyDots[level] ?? 3
  return (
    <span className='flex items-center gap-0.5'>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${i < filled ? 'bg-primary' : 'bg-muted-foreground/20'}`}
        />
      ))}
    </span>
  )
}

export function SkillsSection({
  skills = [],
  isLoading,
}: {
  skills?: Skill[]
  isLoading?: boolean
}) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <section id='skills' className='py-24'>
      <div className='mx-auto max-w-5xl px-4'>
        <SectionHeading
          eyebrow='My toolkit'
          title='Skills & Technologies'
          description='Technologies I use daily to build AI systems, APIs, and production web applications.'
        />

        {isLoading && skills.length === 0 ? (
          <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className='rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm'
              >
                {/* Category badge skeleton */}
                <Skeleton className='mb-4 h-6 w-28 rounded-full' />

                {/* Skill rows skeleton */}
                <ul className='space-y-3'>
                  {[1, 2, 3, 4].map((item) => (
                    <li key={item} className='flex items-center justify-between gap-2'>
                      <Skeleton className='h-4 w-28' />
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <Skeleton key={dot} className='h-1.5 w-1.5 rounded-full' />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : skills.length === 0 ? (
          <div className='mt-12 rounded-2xl border border-dashed border-border/70 p-12 text-center'>
            <p className='text-sm text-muted-foreground'>No skills published yet.</p>
          </div>
        ) : (
          <>
            <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {Object.entries(grouped).map(([cat, catSkills]) => {
            const meta = categoryMeta[cat] ?? { label: cat, color: 'text-foreground', bg: 'bg-muted border-border' }
            return (
              <div
                key={cat}
                className='rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-sm'
              >
                {/* Category label */}
                <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}>
                  <span className={`h-1.5 w-1.5 rounded-full bg-current`} />
                  {meta.label}
                </div>

                <ul className='space-y-3'>
                  {catSkills.map((skill) => (
                    <li key={skill.id} className='flex items-center justify-between gap-2'>
                      <div className='flex items-center gap-2 min-w-0'>
                        <span className='truncate text-sm font-medium'>{skill.name}</span>
                        {skill.featured && (
                          <span className='shrink-0 text-[10px] text-amber-500' title='Featured skill'>★</span>
                        )}
                      </div>
                      <ProficiencyDots level={skill.proficiency} />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

            {/* Legend */}
            <div className='mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground'>
              <span className='font-semibold uppercase tracking-wider'>Proficiency:</span>
              {Object.entries(proficiencyDots).map(([level]) => (
                <span key={level} className='flex items-center gap-2 capitalize'>
                  <ProficiencyDots level={level} />
                  {level}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
