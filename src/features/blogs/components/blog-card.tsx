import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Blog } from '../types'

const categoryColors: Record<string, string> = {
  'Artificial Intelligence': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Backend & Systems': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'Frontend': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  'System Design': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Performance': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
}

interface BlogCardProps {
  blog: Blog
  featuredHero?: boolean
}

export function BlogCard({ blog, featuredHero = false }: BlogCardProps) {
  const categoryStyle =
    categoryColors[blog.category] ||
    'bg-primary/10 text-primary border-primary/20'

  const initials = blog.author.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (featuredHero) {
    return (
      <Card className='group relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-xl dark:bg-card/40'>
        <div className='grid grid-cols-1 lg:grid-cols-12'>
          {/* Image */}
          <div className='relative min-h-[260px] overflow-hidden sm:min-h-[320px] lg:col-span-6'>
            <img
              src={blog.coverImage}
              alt={blog.title}
              className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
              loading='lazy'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:hidden' />
            <div className='absolute left-4 top-4 flex items-center gap-2'>
              <Badge variant='outline' className={categoryStyle}>
                {blog.category}
              </Badge>
              {blog.featured && (
                <Badge
                  variant='secondary'
                  className='gap-1 border border-primary/30 bg-primary/10 text-primary'
                >
                  <Sparkles className='h-3 w-3' />
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className='flex flex-col justify-between p-6 sm:p-8 lg:col-span-6'>
            <div>
              <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                <span className='inline-flex items-center gap-1.5'>
                  <Calendar className='h-3.5 w-3.5' />
                  {blog.publishedAt}
                </span>
                <span>•</span>
                <span className='inline-flex items-center gap-1.5'>
                  <Clock className='h-3.5 w-3.5' />
                  {blog.readTime}
                </span>
              </div>

              <h3 className='mt-3 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl lg:text-3xl'>
                <Link to='/blogs/$blogId' params={{ blogId: blog.slug || blog.id }}>
                  {blog.title}
                </Link>
              </h3>

              <p className='mt-3 line-clamp-3 text-sm text-muted-foreground sm:text-base leading-relaxed'>
                {blog.excerpt}
              </p>

              {/* Tags */}
              <div className='mt-4 flex flex-wrap gap-1.5'>
                {blog.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className='rounded-md border border-border/60 bg-muted/50 px-2 py-0.5 font-mono text-[11px] text-muted-foreground'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer: Author & Read link */}
            <div className='mt-6 flex items-center justify-between border-t border-border/50 pt-4'>
              <div className='flex items-center gap-3'>
                <Avatar className='h-8 w-8 ring-1 ring-border'>
                  <AvatarImage src={blog.author.avatarUrl} alt={blog.author.name} />
                  <AvatarFallback className='text-xs font-semibold'>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-xs font-semibold text-foreground'>
                    {blog.author.name}
                  </p>
                  {blog.author.role && (
                    <p className='text-[11px] text-muted-foreground'>
                      {blog.author.role}
                    </p>
                  )}
                </div>
              </div>

              <Link
                to='/blogs/$blogId'
                params={{ blogId: blog.slug || blog.id }}
                className='inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-transform group-hover:translate-x-1'
              >
                Read Article
                <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className='group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 dark:bg-card/40'>
      {/* Cover Image */}
      <div className='relative aspect-[16/9] w-full overflow-hidden bg-muted'>
        <img
          src={blog.coverImage}
          alt={blog.title}
          className='h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105'
          loading='lazy'
        />
        <div className='absolute left-3 top-3 flex items-center gap-2'>
          <Badge variant='outline' className={categoryStyle}>
            {blog.category}
          </Badge>
          {blog.featured && (
            <Badge
              variant='secondary'
              className='gap-1 border border-primary/30 bg-primary/10 text-primary text-[11px]'
            >
              <Sparkles className='h-3 w-3' />
              Featured
            </Badge>
          )}
        </div>
      </div>

      <CardContent className='flex flex-1 flex-col justify-between p-5'>
        <div>
          {/* Metadata */}
          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <span className='inline-flex items-center gap-1'>
              <Calendar className='h-3 w-3' />
              {blog.publishedAt}
            </span>
            <span>•</span>
            <span className='inline-flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {blog.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className='mt-2.5 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-2'>
            <Link to='/blogs/$blogId' params={{ blogId: blog.slug || blog.id }}>
              {blog.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className='mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground'>
            {blog.excerpt}
          </p>

          {/* Tags */}
          <div className='mt-3 flex flex-wrap gap-1.5'>
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className='rounded border border-border/50 bg-muted/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author & Action */}
        <div className='mt-5 flex items-center justify-between border-t border-border/50 pt-3'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-6 w-6 ring-1 ring-border'>
              <AvatarImage src={blog.author.avatarUrl} alt={blog.author.name} />
              <AvatarFallback className='text-[10px] font-semibold'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className='text-xs font-medium text-muted-foreground line-clamp-1'>
              {blog.author.name}
            </span>
          </div>

          <Link
            to='/blogs/$blogId'
            params={{ blogId: blog.slug || blog.id }}
            className='inline-flex items-center gap-1 text-xs font-medium text-primary transition-transform group-hover:translate-x-1'
          >
            Read
            <ArrowRight className='h-3 w-3' />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
