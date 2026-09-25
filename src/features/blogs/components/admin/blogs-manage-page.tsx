import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBlogStore } from '../../data/blogs-store'
import type { Blog } from '../../types'
import { BlogRowActions } from './blog-columns'
import { BlogDeleteDialog } from './blog-delete-dialog'
import { BlogPreviewDialog } from './blog-preview-dialog'

export function BlogsManagePage() {
  const blogs = useBlogStore((state) => state.blogs)
  const resetToDefaults = useBlogStore((state) => state.resetToDefaults)

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null)
  const [deleteBlog, setDeleteBlog] = useState<Blog | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Get distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>()
    blogs.forEach((b) => set.add(b.category))
    return Array.from(set)
  }, [blogs])

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCategory =
        categoryFilter === 'ALL' || b.category === categoryFilter

      const q = searchQuery.trim().toLowerCase()
      if (!q) return matchesCategory

      const matchesSearch =
        b.title.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
  }, [blogs, categoryFilter, searchQuery])

  // Metrics
  const featuredCount = useMemo(
    () => blogs.filter((b) => b.featured).length,
    [blogs]
  )

  const handleReset = () => {
    resetToDefaults()
    setShowResetConfirm(false)
    toast.success('Reset blogs to default sample articles.')
  }

  return (
    <>
      <Header fixed>
        <div className='ms-auto flex items-center gap-2'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6'>
        {/* Top Header & Actions */}
        <div className='flex flex-wrap items-end justify-between gap-4'>
          <div>
            <div className='flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <BookOpen className='h-5 w-5' />
              </div>
              <h1 className='text-2xl font-bold tracking-tight'>
                Blogs Management
              </h1>
            </div>
            <p className='mt-1 text-sm text-muted-foreground'>
              Create, update, preview, and manage your engineering articles and
              publications.
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='gap-1.5 text-xs text-muted-foreground'
              onClick={() => setShowResetConfirm(true)}
            >
              <RotateCcw className='h-3.5 w-3.5' />
              Reset Defaults
            </Button>

            <Button asChild variant='outline' size='sm' className='gap-1.5 text-xs'>
              <Link to='/blogs' target='_blank'>
                <ExternalLink className='h-3.5 w-3.5' />
                Public Blog Page
              </Link>
            </Button>

            <Button asChild size='sm' className='gap-1.5 text-xs'>
              <Link to='/manage-blogs/new'>
                <Plus className='h-3.5 w-3.5' />
                New Blog Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <Card>
            <CardHeader className='pb-2'>
              <CardDescription className='text-xs'>Total Articles</CardDescription>
              <CardTitle className='text-2xl font-bold'>{blogs.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                Published across all topics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardDescription className='text-xs'>Active Categories</CardDescription>
              <CardTitle className='text-2xl font-bold'>{categories.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                AI, Systems, Frontend, Architecture
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardDescription className='text-xs'>Featured Spotlight</CardDescription>
              <CardTitle className='text-2xl font-bold'>{featuredCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-xs text-muted-foreground'>
                Highlighted in hero showcase
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='relative flex-1 sm:max-w-md'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Search articles by title, slug, or tags...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-9 pl-9 text-xs'
            />
          </div>

          <div className='flex items-center gap-2'>
            <Select
              value={categoryFilter}
              onValueChange={(val) => setCategoryFilter(val)}
            >
              <SelectTrigger className='h-9 w-[180px] text-xs'>
                <SelectValue placeholder='All Categories' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchQuery || categoryFilter !== 'ALL') && (
              <Button
                variant='ghost'
                size='sm'
                className='h-9 text-xs'
                onClick={() => {
                  setSearchQuery('')
                  setCategoryFilter('ALL')
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Articles Table */}
        <div className='overflow-hidden rounded-xl border border-border/70 bg-card'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='w-[80px]'>Cover</TableHead>
                <TableHead className='min-w-[250px]'>Article</TableHead>
                <TableHead className='w-[160px]'>Category</TableHead>
                <TableHead className='w-[140px]'>Published</TableHead>
                <TableHead className='w-[140px]'>Author</TableHead>
                <TableHead className='w-[100px] text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='h-40 text-center text-muted-foreground'
                  >
                    <div className='flex flex-col items-center justify-center gap-2'>
                      <BookOpen className='h-8 w-8 text-muted-foreground/40' />
                      <p className='text-sm font-medium'>No articles found</p>
                      <p className='text-xs text-muted-foreground'>
                        Try adjusting your search query or category filter.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id} className='group'>
                    {/* Cover Thumbnail */}
                    <TableCell>
                      <div className='relative h-12 w-16 overflow-hidden rounded-md border border-border bg-muted'>
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className='h-full w-full object-cover transition-transform group-hover:scale-105'
                          loading='lazy'
                        />
                      </div>
                    </TableCell>

                    {/* Title & Slug */}
                    <TableCell>
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                          <Link
                            to='/manage-blogs/$blogId'
                            params={{ blogId: blog.id }}
                            className='font-semibold text-foreground hover:text-primary transition-colors line-clamp-1'
                          >
                            {blog.title}
                          </Link>
                          {blog.featured && (
                            <Badge
                              variant='secondary'
                              className='h-5 gap-1 border border-primary/20 bg-primary/10 px-1.5 text-[10px] text-primary'
                            >
                              <Sparkles className='h-2.5 w-2.5' />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <span className='font-mono text-[11px] text-muted-foreground/80'>
                            /blogs/{blog.slug}
                          </span>
                          <span>•</span>
                          <span className='line-clamp-1 max-w-sm'>
                            {blog.excerpt}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <Badge variant='outline' className='text-xs font-normal'>
                        {blog.category}
                      </Badge>
                    </TableCell>

                    {/* Published Date & Read Time */}
                    <TableCell>
                      <div className='flex flex-col gap-0.5 text-xs text-muted-foreground'>
                        <span className='inline-flex items-center gap-1'>
                          <Calendar className='h-3 w-3' />
                          {blog.publishedAt}
                        </span>
                        <span className='inline-flex items-center gap-1 font-mono text-[11px]'>
                          <Clock className='h-3 w-3' />
                          {blog.readTime}
                        </span>
                      </div>
                    </TableCell>

                    {/* Author */}
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Avatar className='h-6 w-6 ring-1 ring-border'>
                          <AvatarImage
                            src={blog.author.avatarUrl}
                            alt={blog.author.name}
                          />
                          <AvatarFallback className='text-[10px]'>
                            {blog.author.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-xs font-medium text-foreground line-clamp-1'>
                          {blog.author.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className='text-right'>
                      <div className='flex items-center justify-end gap-1'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-primary'
                          title='Preview Article'
                          onClick={() => setPreviewBlog(blog)}
                        >
                          <Eye className='h-4 w-4' />
                        </Button>

                        <Button
                          asChild
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-foreground'
                          title='Edit Article'
                        >
                          <Link
                            to='/manage-blogs/$blogId'
                            params={{ blogId: blog.id }}
                          >
                            <Edit3 className='h-4 w-4' />
                          </Link>
                        </Button>

                        <BlogRowActions
                          blog={blog}
                          onPreview={(b) => setPreviewBlog(b)}
                          onDelete={(b) => setDeleteBlog(b)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Main>

      {/* Preview Dialog */}
      <BlogPreviewDialog
        blog={previewBlog}
        open={!!previewBlog}
        onOpenChange={(open) => !open && setPreviewBlog(null)}
      />

      {/* Delete Dialog */}
      <BlogDeleteDialog
        blog={deleteBlog}
        open={!!deleteBlog}
        onOpenChange={(open) => !open && setDeleteBlog(null)}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        destructive
        handleConfirm={handleReset}
        className='max-w-md'
        title='Reset Blogs to Defaults?'
        desc={
          <div className='space-y-2 text-sm text-muted-foreground'>
            <p>
              This will reset the blog catalog back to the initial set of 5
              engineering sample articles. Any custom blogs you have created will be
              replaced.
            </p>
          </div>
        }
        confirmText='Reset to Defaults'
      />
    </>
  )
}
