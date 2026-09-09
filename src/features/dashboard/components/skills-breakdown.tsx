const categories = [
  { name: 'Frontend', count: 8, color: 'bg-blue-500' },
  { name: 'Backend', count: 5, color: 'bg-emerald-500' },
  { name: 'DevOps', count: 4, color: 'bg-amber-500' },
  { name: 'Database', count: 3, color: 'bg-violet-500' },
  { name: 'Design', count: 2, color: 'bg-pink-500' },
  { name: 'Tools', count: 2, color: 'bg-slate-500' },
]

const total = categories.reduce((s, c) => s + c.count, 0)

export function SkillsBreakdown() {
  return (
    <div className='space-y-3'>
      {categories.map((cat) => {
        const pct = Math.round((cat.count / total) * 100)
        return (
          <div key={cat.name} className='space-y-1'>
            <div className='flex items-center justify-between text-xs'>
              <span className='font-medium text-foreground'>{cat.name}</span>
              <span className='text-muted-foreground'>
                {cat.count} skill{cat.count !== 1 ? 's' : ''} &middot; {pct}%
              </span>
            </div>
            <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
              <div
                className={`h-2 rounded-full ${cat.color}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
      <p className='pt-1 text-xs text-muted-foreground'>
        {total} skills across {categories.length} categories
      </p>
    </div>
  )
}
