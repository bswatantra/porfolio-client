import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  Filter,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { ThemeSwitch } from '@/components/theme-switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BlogCard } from './blog-card'
import { useGetBlogsQuery } from '../api/blogs-api'

const CATEGORIES = [
  'All',
  'Artificial Intelligence',
  'Backend & Systems',
  'Frontend',
  'System Design',
  'Performance',
] as const

export function BlogsList() {
  const { data: allBlogs = [], isLoading } = useGetBlogsQuery()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) => {
      const matchesCategory =
        selectedCategory === 'All' || blog.category === selectedCategory

      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchesCategory

      const matchesSearch =
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.tags.some((t) => t.toLowerCase().includes(query)) ||
        blog.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [allBlogs, selectedCategory, searchQuery])

  // Split featured vs rest when in default view (All, no search)
  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim()
  const featuredBlog = isDefaultView
    ? filteredBlogs.find((b) => b.featured) || filteredBlogs[0]
    : null
  const regularBlogs = isDefaultView
    ? filteredBlogs.filter((b) => b.id !== featuredBlog?.id)
    : filteredBlogs

  return (
    <div className='min-h-screen bg-background text-foreground antialiased selection:bg-primary/20'>
      {/* Top Navigation Bar */}
      <header className='sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
          <Button
            asChild
            variant='ghost'
            size='sm'
            className='-ml-2 gap-2 text-muted-foreground hover:text-foreground'
          >
            <Link to='/'>
              <ArrowLeft className='h-4 w-4' />
              <span>Back to Portfolio</span>
            </Link>
          </Button>

          <div className='flex items-center gap-2.5'>
            <ThemeSwitch />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className='mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8'>
        {/* Hero Section */}
        <section className='relative mb-12 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-muted/20 p-8 sm:p-12 text-center md:text-left'>
          {/* Ambient background glows */}
          <div className='pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl' />

          <div className='relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
            <div className='max-w-2xl'>
              <div className='mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
                <Sparkles className='h-3.5 w-3.5' />
                Engineering Journal
              </div>

              <h1 className='text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>
                Articles, Architecture & Insights
              </h1>

              <p className='mt-3 text-sm text-muted-foreground sm:text-base leading-relaxed'>
                Deep dives into full-stack engineering, scalable backend design,
                generative AI pipelines, performance optimization, and modern web
                patterns.
              </p>
            </div>

            {/* Total count badge */}
            <div className='flex md:flex-col items-center md:items-end justify-center gap-1'>
              <span className='font-mono text-3xl font-bold text-foreground'>
                {allBlogs.length}
              </span>
              <span className='text-xs text-muted-foreground'>
                Published Articles
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className='relative mt-8'>
            <div className='relative'>
              <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search articles by title, topic, or keyword (e.g., RAG, Redis, FastAPI, CSS)...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='h-11 rounded-xl bg-background/70 pl-10 pr-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-primary'
              />
              {searchQuery && (
                <button
                  type='button'
                  onClick={() => setSearchQuery('')}
                  className='absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                >
                  <X className='h-4 w-4' />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className='mt-5 flex flex-wrap items-center gap-2'>
            <span className='mr-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground'>
              <Filter className='h-3 w-3' />
              Filter:
            </span>
            {CATEGORIES.map((cat) => {
              const count =
                cat === 'All'
                  ? allBlogs.length
                  : allBlogs.filter((b) => b.category === cat).length
              const isSelected = selectedCategory === cat

              return (
                <button
                  key={cat}
                  type='button'
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border/70 bg-card/60 text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {cat}
                  <span
                    className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                      isSelected
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Featured Blog (Hero layout on default view) */}
        {featuredBlog && (
          <section className='mb-10'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
                Featured Article
              </h2>
            </div>
            <BlogCard blog={featuredBlog} featuredHero />
          </section>
        )}

        {/* Main Grid */}
        <section>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground'>
              {isDefaultView
                ? 'Latest Articles'
                : `Results (${filteredBlogs.length})`}
            </h2>
            {searchQuery && (
              <Badge variant='outline' className='text-xs font-normal'>
                Matching "{searchQuery}"
              </Badge>
            )}
          </div>

          {isLoading && allBlogs.length === 0 ? (
            <div className='flex min-h-[260px] flex-col items-center justify-center gap-3'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
              <p className='text-sm text-muted-foreground'>Loading articles...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center'>
              <BookOpen className='h-12 w-12 text-muted-foreground/40' />
              <h3 className='mt-4 text-base font-semibold'>
                No matching articles found
              </h3>
              <p className='mt-1 max-w-sm text-xs text-muted-foreground'>
                We couldn't find any articles matching your search or category
                filter. Try adjusting your query.
              </p>
              <Button
                variant='outline'
                size='sm'
                className='mt-4 gap-1.5'
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {regularBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className='border-t border-border/50 py-8 text-center text-xs text-muted-foreground'>
        <div className='mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p>© {new Date().getFullYear()} Swatantra Chaudhary. All rights reserved.</p>
          <Button asChild variant='ghost' size='sm' className='text-xs gap-1.5'>
            <Link to='/'>
              <ArrowLeft className='h-3.5 w-3.5' />
              Back to Home
            </Link>
          </Button>
        </div>
      </footer>
    </div>
  )
}
