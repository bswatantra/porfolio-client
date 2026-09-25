import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock, Share2,
  Sparkles,
  Tag
} from 'lucide-react'
import { toast } from 'sonner'
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BlogCard } from './blog-card'
import { MarkdownRenderer } from './markdown-renderer'
import { sectionsToMarkdown } from '../utils/markdown-converter'
import { useGetBlogsQuery } from '../api/blogs-api'
import { SocialShare } from './social-share'
import type { Blog } from '../types'

const categoryColors: Record<string, string> = {
  'Artificial Intelligence':
    'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'Backend & Systems':
    'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'Frontend':
    'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  'System Design':
    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  'Performance':
    'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
}

interface BlogDetailProps {
  blog: Blog
  isPreview?: boolean
}

export function BlogDetail({ blog, isPreview = false }: BlogDetailProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const { data: allBlogs = [] } = useGetBlogsQuery()
  const relatedBlogs: Blog[] = (allBlogs || [])
    .filter((b: Blog) => b.id !== blog.id && b.slug !== blog.slug)
    .slice(0, 2)

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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      toast.success('Article link copied to clipboard!')
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <div
      className={
        isPreview
          ? 'w-full bg-background text-foreground antialiased selection:bg-primary/20'
          : 'min-h-screen bg-background text-foreground antialiased selection:bg-primary/20'
      }
    >
      {/* Top Navbar (only in full page view) */}
      {!isPreview && (
        <header className='sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl'>
          <div className='mx-auto flex max-w-4xl items-center justify-between px-4 py-3'>
            <Button
              asChild
              variant='ghost'
              size='sm'
              className='-ml-2 gap-2 text-muted-foreground hover:text-foreground'
            >
              <Link to='/blogs'>
                <ArrowLeft className='h-4 w-4' />
                <span>All Articles</span>
              </Link>
            </Button>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='gap-1.5 rounded-full text-xs'
                onClick={handleCopyLink}
              >
                {copiedLink ? (
                  <Check className='h-3.5 w-3.5 text-emerald-500' />
                ) : (
                  <Share2 className='h-3.5 w-3.5' />
                )}
                {copiedLink ? 'Copied' : 'Share'}
              </Button>
              <ThemeSwitch />
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main
        className={
          isPreview
            ? 'w-full px-1 py-2 sm:px-2'
            : 'mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8'
        }
      >
        {/* Breadcrumb & Badges */}
        <div className='flex flex-wrap items-center gap-2 text-xs'>
          <Link
            to='/'
            className='text-muted-foreground transition-colors hover:text-foreground'
          >
            Home
          </Link>
          <span className='text-muted-foreground/60'>/</span>
          <Link
            to='/blogs'
            className='text-muted-foreground transition-colors hover:text-foreground'
          >
            Blogs
          </Link>
          <span className='text-muted-foreground/60'>/</span>
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

        {/* Title */}
        <h1 className='mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight'>
          {blog.title}
        </h1>

        {/* Excerpt callout */}
        <p className='mt-4 text-base font-normal leading-relaxed text-muted-foreground sm:text-lg'>
          {blog.excerpt}
        </p>

        {/* Author & Meta Bar */}
        <div className='mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-border/60 py-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='h-10 w-10 ring-1 ring-border'>
              <AvatarImage src={blog.author.avatarUrl} alt={blog.author.name} />
              <AvatarFallback className='text-sm font-semibold'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className='text-sm font-semibold text-foreground'>
                {blog.author.name}
              </p>
              {blog.author.role && (
                <p className='text-xs text-muted-foreground'>
                  {blog.author.role}
                </p>
              )}
            </div>
          </div>

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
        </div>

        {/* Cover Image */}
        <div className='relative my-8 overflow-hidden rounded-2xl border border-border/60 shadow-lg'>
          <img
            src={blog.coverImage}
            alt={blog.title}
            className='h-[300px] sm:h-[420px] w-full object-cover'
          />
        </div>

        {/* Article Body / Sections */}
        <article className='prose prose-neutral dark:prose-invert max-w-none'>
          {blog.content ? (
            <MarkdownRenderer content={blog.content} />
          ) : blog.sections && blog.sections.length > 0 ? (
            <MarkdownRenderer content={sectionsToMarkdown(blog.sections)} />
          ) : (
            <p className='text-muted-foreground leading-relaxed'>
              {blog.excerpt}
            </p>
          )}
        </article>

        {/* Tags */}
        <div className='mt-8 flex flex-wrap items-center gap-2 border-t border-border/60 pt-6'>
          <span className='inline-flex items-center gap-1 text-xs font-medium text-muted-foreground mr-1'>
            <Tag className='h-3.5 w-3.5' />
            Tags:
          </span>
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className='rounded-md border border-border bg-muted/60 px-2.5 py-1 font-mono text-xs text-muted-foreground'
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Social Share & Claps */}
        <div className='mt-6 border-y border-border/50 py-1'>
          <SocialShare blog={blog} />
        </div>

        {/* Author Bio Card */}
        <div className='mt-10 rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm'>
          <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left'>
            <Avatar className='h-14 w-14 ring-2 ring-primary/20'>
              <AvatarImage src={blog.author.avatarUrl} alt={blog.author.name} />
              <AvatarFallback className='text-base font-semibold'>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className='text-base font-bold text-foreground'>
                Written by {blog.author.name}
              </h4>
              <p className='text-xs text-primary font-medium mt-0.5'>
                {blog.author.role}
              </p>
              <p className='mt-2 text-xs leading-relaxed text-muted-foreground'>
                Passionate about distributed backend architectures, high-performance
                APIs, vector search, and modern user experiences. Always exploring
                new software engineering frontiers.
              </p>
            </div>
          </div>
        </div>

        {!isPreview && (
          <>
            <Separator className='my-12' />

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <section className='mb-12'>
                <div className='mb-6 flex items-center justify-between'>
                  <h3 className='text-lg font-bold tracking-tight text-foreground'>
                    Related Articles
                  </h3>
                  <Button asChild variant='ghost' size='sm' className='text-xs'>
                    <Link to='/blogs'>View all</Link>
                  </Button>
                </div>

                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                  {relatedBlogs.map((b: Blog) => (
                    <BlogCard key={b.id} blog={b} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer (only in full page view) */}
      {!isPreview && (
        <footer className='border-t border-border/50 py-8 text-center text-xs text-muted-foreground'>
          <div className='mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p>© {new Date().getFullYear()} Swatantra Chaudhary. All rights reserved.</p>
            <div className='flex items-center gap-3'>
              <Button asChild variant='ghost' size='sm' className='text-xs gap-1.5'>
                <Link to='/blogs'>
                  <ArrowLeft className='h-3.5 w-3.5' />
                  Back to Blogs
                </Link>
              </Button>
              <Button asChild variant='ghost' size='sm' className='text-xs'>
                <Link to='/'>Home</Link>
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
