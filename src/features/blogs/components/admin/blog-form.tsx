import React, {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useFieldArray, useForm, useWatch, type Control } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  CloudUpload,
  Code2,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  FileEdit,
  FolderOpen,
  Heading2,
  ImageIcon,
  List,
  Loader2,
  Plus,
  Quote,
  Save,
  Sparkles,
  Split,
  Table as TableIcon,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { handleServerError } from '@/lib/handle-server-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  uploadBlogCover,
} from '../../api/blogs-api'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  blogFormSchema,
  type BlogFormData,
} from '../../schemas/blog-schema'
import type { Blog, BlogSection } from '../../types'
import {
  markdownToSections,
  sectionsToMarkdown,
} from '../../utils/markdown-converter'
import { BlogDetail } from '../blog-detail'

const PRESET_CATEGORIES = [
  'Artificial Intelligence',
  'Backend & Systems',
  'Frontend',
  'System Design',
  'Performance',
  'DevOps & Cloud',
  'Software Architecture',
]

const COMMON_TAGS = [
  'Python',
  'FastAPI',
  'React',
  'TypeScript',
  'Redis',
  'MongoDB',
  'RAG',
  'LLMs',
  'System Design',
  'Tailwind CSS',
  'Docker',
  'WebSockets',
]

interface BlogFormProps {
  initialData?: Blog
  mode?: 'create' | 'edit'
}

interface BlogLivePreviewPaneProps {
  control: Control<BlogFormData>
  editorMode: 'markdown' | 'sections'
  initialData?: Blog
  viewMode: 'edit' | 'split' | 'preview'
  onClosePreview?: () => void
}

const BlogLivePreviewPane = React.memo(function BlogLivePreviewPane({
  control,
  editorMode,
  initialData,
  viewMode,
  onClosePreview,
}: BlogLivePreviewPaneProps) {
  const watchedValues = useWatch({ control })
  const deferredValues = useDeferredValue(watchedValues)

  const previewBlog: Blog = useMemo(() => {
    const sections = (deferredValues.sections?.map((s) => ({
      heading: s.heading || 'Section Heading',
      body: s.body || 'Section content...',
      codeSnippet: s.codeSnippet
        ? {
            language: s.codeLanguage || 'typescript',
            code: s.codeSnippet,
          }
        : undefined,
    })) || []) as BlogSection[]

    const content =
      editorMode === 'markdown'
        ? deferredValues.content || ''
        : sectionsToMarkdown(
            (deferredValues.sections || []).map((s) => ({
              heading: s.heading || 'Heading',
              body: s.body || '',
              codeSnippet: s.codeSnippet
                ? {
                    language: s.codeLanguage || 'typescript',
                    code: s.codeSnippet,
                  }
                : undefined,
            }))
          )

    return {
      id: initialData?.id || 'preview-temp-id',
      slug: deferredValues.slug || 'preview-slug',
      title: deferredValues.title || 'Untitled Blog Post',
      excerpt: deferredValues.excerpt || 'Article summary will appear here...',
      category: deferredValues.category || 'General',
      readTime: deferredValues.readTime || '5 min read',
      publishedAt: initialData?.publishedAt || 'Today',
      coverImage:
        deferredValues.coverImage ||
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      featured: deferredValues.featured,
      tags: (deferredValues.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      author: {
        name: deferredValues.authorName || 'Author',
        role: deferredValues.authorRole,
        avatarUrl: deferredValues.authorAvatarUrl,
      },
      content,
      sections,
    }
  }, [initialData?.id, initialData?.publishedAt, deferredValues, editorMode])

  return (
    <div
      className={
        viewMode === 'split'
          ? 'sticky top-16 flex h-[calc(100vh-5.5rem)] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-lg lg:col-span-1'
          : 'overflow-hidden rounded-2xl border border-border/80 bg-background shadow-lg'
      }
    >
      <div className='flex shrink-0 items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2.5'>
        <div className='flex items-center gap-2'>
          <Badge
            variant='outline'
            className='bg-primary/10 text-primary border-primary/20 text-xs'
          >
            Live Preview
          </Badge>
          <span className='text-xs text-muted-foreground'>
            Markdown & code blocks render in real-time
          </span>
        </div>
        {viewMode === 'preview' && onClosePreview && (
          <Button
            size='sm'
            variant='outline'
            className='h-7 text-xs'
            onClick={onClosePreview}
          >
            <FileEdit className='h-3.5 w-3.5 mr-1 pointer-events-none' />
            <span className='pointer-events-none'>Back to Editor</span>
          </Button>
        )}
      </div>

      <div className='flex-1 overflow-y-auto p-4 sm:p-6'>
        <BlogDetail blog={previewBlog} isPreview />
      </div>
    </div>
  )
})

export function BlogForm({
  initialData,
  mode = initialData ? 'edit' : 'create',
}: BlogFormProps) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const [, startModeTransition] = useTransition()
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit')
  const [editorMode, setEditorMode] = useState<'markdown' | 'sections'>(
    initialData?.content ? 'markdown' : 'markdown'
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('url')
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  const createBlogMutation = useCreateBlogMutation()
  const updateBlogMutation = useUpdateBlogMutation()

  const handleCoverUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP, etc.).')
      return
    }
    setIsUploadingCover(true)
    try {
      const res = await uploadBlogCover(file)
      if (res?.url) {
        form.setValue('coverImage', res.url, { shouldValidate: true })
        toast.success('Cover image uploaded successfully to cloud storage!')
      }
    } catch (err) {
      handleServerError(err)
    } finally {
      setIsUploadingCover(false)
    }
  }

  const initialSections = initialData?.sections?.map((s) => ({
    heading: s.heading,
    body: s.body,
    codeLanguage: s.codeSnippet?.language || '',
    codeSnippet: s.codeSnippet?.code || '',
  })) || [
    {
      heading: 'Introduction',
      body: initialData?.content || initialData?.excerpt || '',
      codeLanguage: '',
      codeSnippet: '',
    },
  ]

  const initialContent =
    initialData?.content ||
    (initialData?.sections ? sectionsToMarkdown(initialData.sections) : '') ||
    `## Introduction\n\nWrite your blog post in **Markdown** format here. You can use standard Markdown syntax including headings, paragraphs, lists, and code blocks.\n\n\`\`\`typescript\n// Example TypeScript code snippet\nfunction calculateMetrics(data: number[]): number {\n  return data.reduce((acc, curr) => acc + curr, 0);\n}\n\`\`\`\n\n## Architecture Overview\n\nExplain your system design and core components.\n\n> [!NOTE]\n> Fast retrieval pipelines improve response latency by over 40%.\n\n- Point 1: Modular microservices\n- Point 2: Cache invalidation hooks\n- Point 3: Hybrid vector retrieval`

  const defaultValues: BlogFormData = initialData
    ? {
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt,
        category: initialData.category,
        readTime: initialData.readTime,
        coverImage: initialData.coverImage,
        featured: !!initialData.featured,
        tags: initialData.tags.join(', '),
        authorName: initialData.author.name,
        authorRole: initialData.author.role || '',
        authorAvatarUrl: initialData.author.avatarUrl || '',
        editorMode,
        content: initialContent,
        sections: initialSections,
      }
    : {
        title: '',
        slug: '',
        excerpt: '',
        category: 'Artificial Intelligence',
        readTime: '5 min read',
        coverImage:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
        featured: false,
        tags: 'AI, Architecture, Full Stack',
        authorName: 'Swatantra Chaudhary',
        authorRole: 'AI Engineer & Full Stack Developer',
        authorAvatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        editorMode: 'markdown',
        content: initialContent,
        sections: [
          {
            heading: 'Introduction & Core Concepts',
            body: 'Introduce the core problem, why standard approaches fall short, and what makes this solution different.',
            codeLanguage: 'typescript',
            codeSnippet: '// Code example goes here\nconst result = await processData();',
          },
        ],
      }

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogFormSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'sections',
  })

  // Auto-generate slug from title
  const handleGenerateSlug = () => {
    const title = form.getValues('title')
    if (!title) {
      toast.error('Please enter a title first')
      return
    }
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    form.setValue('slug', slug, { shouldValidate: true })
    toast.success('Slug generated from title')
  }

  // Add tag shortcut
  const handleAddTag = (tag: string) => {
    const current = form.getValues('tags') || ''
    const currentList = current
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    if (!currentList.includes(tag)) {
      currentList.push(tag)
      form.setValue('tags', currentList.join(', '), { shouldValidate: true })
    }
  }

  // Switch between Markdown editor and Sections builder
  const handleSwitchEditorMode = (newMode: 'markdown' | 'sections') => {
    if (newMode === editorMode) return

    startModeTransition(() => {
      if (newMode === 'markdown') {
        // Convert current sections to markdown text
        const currentSections = form.getValues('sections')
        const formattedSections: BlogSection[] = currentSections.map((s) => ({
          heading: s.heading,
          body: s.body,
          codeSnippet: s.codeSnippet
            ? {
                language: s.codeLanguage || 'typescript',
                code: s.codeSnippet,
              }
            : undefined,
        }))
        const md = sectionsToMarkdown(formattedSections)
        form.setValue('content', md, { shouldValidate: false, shouldDirty: true })
        form.setValue('editorMode', 'markdown', { shouldValidate: false })
        setEditorMode('markdown')
        toast.info('Switched to Markdown (.md) editor')
      } else {
        // Convert current markdown to sections
        const currentMd = form.getValues('content') || ''
        const parsedSections = markdownToSections(currentMd)
        form.setValue(
          'sections',
          parsedSections.map((s) => ({
            heading: s.heading,
            body: s.body,
            codeLanguage: s.codeSnippet?.language || '',
            codeSnippet: s.codeSnippet?.code || '',
          })),
          { shouldValidate: false, shouldDirty: true }
        )
        form.setValue('editorMode', 'sections', { shouldValidate: false })
        setEditorMode('sections')
        toast.info('Switched to Structured Sections editor')
      }
    })
  }

  // Insert markdown snippet into content
  const handleInsertMarkdownSnippet = (snippet: string) => {
    const current = form.getValues('content') || ''
    form.setValue('content', `${current}\n\n${snippet}`)
    toast.success('Inserted template')
  }

  // Import .md file
  const handleImportMdFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      if (!text) return

      // Try extracting title from first # Heading
      const titleMatch = text.match(/^#\s+(.+)$/m)
      if (titleMatch && !form.getValues('title')) {
        form.setValue('title', titleMatch[1].trim())
        const slug = titleMatch[1]
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
        form.setValue('slug', slug)
      }

      form.setValue('content', text)
      setEditorMode('markdown')
      form.setValue('editorMode', 'markdown')
      toast.success(`Imported "${file.name}" successfully!`)
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  // Export as .md file
  const handleExportMdFile = () => {
    const title = form.getValues('title') || 'blog-post'
    const slug = form.getValues('slug') || 'article'
    const mdContent =
      editorMode === 'markdown'
        ? form.getValues('content')
        : sectionsToMarkdown(
            form.getValues('sections').map((s) => ({
              heading: s.heading,
              body: s.body,
              codeSnippet: s.codeSnippet
                ? {
                    language: s.codeLanguage || 'typescript',
                    code: s.codeSnippet,
                  }
                : undefined,
            }))
          )

    const fullDocument = `# ${title}\n\n${mdContent}`
    const blob = new Blob([fullDocument], { type: 'text/markdown;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${slug}.md`
    link.click()
    toast.success(`Exported ${slug}.md`)
  }

  const onSubmit = async (data: BlogFormData) => {
    const tagsArray = data.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const finalContent =
      editorMode === 'markdown'
        ? data.content
        : sectionsToMarkdown(
            data.sections.map((s) => ({
              heading: s.heading,
              body: s.body,
              codeSnippet: s.codeSnippet?.trim()
                ? {
                    language: s.codeLanguage || 'typescript',
                    code: s.codeSnippet,
                  }
                : undefined,
            }))
          )

    const finalSections: BlogSection[] =
      editorMode === 'markdown'
        ? markdownToSections(data.content)
        : data.sections.map((s) => ({
            heading: s.heading,
            body: s.body,
            codeSnippet: s.codeSnippet?.trim()
              ? {
                  language: s.codeLanguage || 'typescript',
                  code: s.codeSnippet,
                }
              : undefined,
          }))

    if (isEdit && initialData) {
      try {
        await updateBlogMutation.mutateAsync({
          id: initialData.id,
          payload: {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            category: data.category,
            readTime: data.readTime,
            coverImage: data.coverImage,
            featured: data.featured,
            tags: tagsArray,
            content: finalContent,
            sections: finalSections,
            authorName: data.authorName,
            authorRole: data.authorRole,
            authorAvatarUrl: data.authorAvatarUrl,
          },
        })
        toast.success(`"${data.title}" updated successfully!`)
        navigate({ to: '/manage-blogs' })
      } catch (err) {
        handleServerError(err)
      }
    } else {
      try {
        await createBlogMutation.mutateAsync({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          category: data.category,
          readTime: data.readTime,
          coverImage: data.coverImage,
          featured: data.featured,
          tags: tagsArray,
          content: finalContent,
          sections: finalSections,
          authorName: data.authorName,
          authorRole: data.authorRole,
          authorAvatarUrl: data.authorAvatarUrl,
        })
        toast.success(`"${data.title}" created and saved to database!`)
        navigate({ to: '/manage-blogs' })
      } catch (err) {
        handleServerError(err)
      }
    }
  }

  return (
    <div className='space-y-6'>
      {/* Hidden file input for .md import */}
      <input
        ref={fileInputRef}
        type='file'
        accept='.md,.markdown,text/markdown'
        className='hidden'
        onChange={handleImportMdFile}
      />

      {/* Top Header & View Modes */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Button asChild variant='ghost' size='sm' className='gap-2'>
            <Link to='/manage-blogs'>
              <ArrowLeft className='h-4 w-4' />
              Back to Blogs
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
            <p className='text-xs text-muted-foreground'>
              {isEdit
                ? `Updating "${initialData?.title}"`
                : 'Write in Markdown (.md) or structured sections with real-time live preview'}
            </p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className='flex items-center gap-2'>
          <div className='flex items-center gap-1 rounded-lg border border-border/70 bg-muted/40 p-1'>
            <Button
              type='button'
              variant={viewMode === 'edit' ? 'default' : 'ghost'}
              size='sm'
              className='h-8 gap-1.5 text-xs'
              onClick={() => startModeTransition(() => setViewMode('edit'))}
            >
              <FileEdit className='h-3.5 w-3.5 pointer-events-none' />
              <span className='pointer-events-none'>Editor</span>
            </Button>
            <Button
              type='button'
              variant={viewMode === 'split' ? 'default' : 'ghost'}
              size='sm'
              className='h-8 gap-1.5 text-xs hidden lg:flex'
              onClick={() => startModeTransition(() => setViewMode('split'))}
            >
              <Split className='h-3.5 w-3.5 pointer-events-none' />
              <span className='pointer-events-none'>Split View</span>
            </Button>
            <Button
              type='button'
              variant={viewMode === 'preview' ? 'default' : 'ghost'}
              size='sm'
              className='h-8 gap-1.5 text-xs'
              onClick={() => startModeTransition(() => setViewMode('preview'))}
            >
              <Eye className='h-3.5 w-3.5 pointer-events-none' />
              <span className='pointer-events-none'>Full Preview</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div
        className={
          viewMode === 'split'
            ? 'grid grid-cols-1 items-start gap-6 lg:grid-cols-2'
            : 'space-y-6'
        }
      >
        {/* Editor Side */}
        {viewMode !== 'preview' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* Card 1: Article Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>
                    Article Details
                  </CardTitle>
                  <CardDescription>
                    Core metadata, slug, publication tags, and category
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Article Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g. Building Scalable RAG Systems with Hybrid Search'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug with Auto-generate */}
                  <FormField
                    control={form.control}
                    name='slug'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center justify-between'>
                          <FormLabel>URL Slug</FormLabel>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='h-6 text-[11px] gap-1 text-primary'
                            onClick={handleGenerateSlug}
                          >
                            <Sparkles className='h-3 w-3' />
                            Generate from title
                          </Button>
                        </div>
                        <FormControl>
                          <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>
                              /blogs/
                            </span>
                            <Input
                              {...field}
                              className='pl-16 font-mono text-xs'
                              placeholder='my-awesome-article'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category & Read Time */}
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PRESET_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='readTime'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reading Time</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder='e.g. 6 min read' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Featured Post Checkbox */}
                  <FormField
                    control={form.control}
                    name='featured'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3.5'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className='space-y-0.5 leading-none'>
                          <FormLabel className='cursor-pointer text-sm font-semibold'>
                            Feature this article
                          </FormLabel>
                          <FormDescription className='text-xs'>
                            Spotlights this article at the top of the blog page
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Excerpt */}
                  <FormField
                    control={form.control}
                    name='excerpt'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt / Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder='A concise 1-3 sentence summary of the article...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cover Image: Cloud Storage Upload or Direct URL */}
                  <FormField
                    control={form.control}
                    name='coverImage'
                    render={({ field }) => (
                      <FormItem className='space-y-3'>
                        <div className='flex items-center justify-between'>
                          <FormLabel className='text-sm font-semibold'>Cover Image</FormLabel>
                          <div className='flex items-center gap-1 rounded-lg border bg-muted/30 p-1'>
                            <Button
                              type='button'
                              variant={coverMode === 'upload' ? 'default' : 'ghost'}
                              size='sm'
                              className='h-7 px-2.5 text-xs gap-1.5'
                              onClick={() => startModeTransition(() => setCoverMode('upload'))}
                            >
                              <CloudUpload className='h-3.5 w-3.5 pointer-events-none' />
                              <span className='pointer-events-none'>Cloud Upload</span>
                            </Button>
                            <Button
                              type='button'
                              variant={coverMode === 'url' ? 'default' : 'ghost'}
                              size='sm'
                              className='h-7 px-2.5 text-xs gap-1.5'
                              onClick={() => startModeTransition(() => setCoverMode('url'))}
                            >
                              <ImageIcon className='h-3.5 w-3.5 pointer-events-none' />
                              <span className='pointer-events-none'>Image URL</span>
                            </Button>
                          </div>
                        </div>

                        {/* Hidden file input for cloud upload */}
                        <input
                          ref={coverFileInputRef}
                          type='file'
                          accept='image/png,image/jpeg,image/webp,image/gif'
                          className='hidden'
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleCoverUpload(file)
                          }}
                        />

                        {coverMode === 'upload' ? (
                          <div className='space-y-3'>
                            {/* Upload Drop Zone / Button */}
                            <div
                              onClick={() => !isUploadingCover && coverFileInputRef.current?.click()}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault()
                                const file = e.dataTransfer.files?.[0]
                                if (file) handleCoverUpload(file)
                              }}
                              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                isUploadingCover
                                  ? 'border-primary/50 bg-primary/5 cursor-wait'
                                  : 'border-border/80 hover:border-primary/60 hover:bg-muted/30'
                              }`}
                            >
                              {isUploadingCover ? (
                                <div className='flex flex-col items-center gap-2 py-2'>
                                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                                  <p className='text-sm font-medium'>Uploading to Cloud Storage...</p>
                                  <p className='text-xs text-muted-foreground'>Uploading via Cloudinary / S3 / API</p>
                                </div>
                              ) : (
                                <div className='flex flex-col items-center gap-2 py-2'>
                                  <div className='p-3 rounded-full bg-primary/10 text-primary'>
                                    <CloudUpload className='h-6 w-6' />
                                  </div>
                                  <p className='text-sm font-semibold'>Click to upload or drag & drop</p>
                                  <p className='text-xs text-muted-foreground'>
                                    Supports WebP, PNG, JPG (up to 10MB)
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Uploaded Thumbnail Preview Banner */}
                            {field.value && (
                              <div className='relative overflow-hidden rounded-lg border bg-muted/30 p-2'>
                                <div className='flex items-center gap-3'>
                                  <img
                                    src={field.value}
                                    alt='Cover preview'
                                    className='h-16 w-24 rounded object-cover border'
                                  />
                                  <div className='flex-1 min-w-0'>
                                    <div className='flex items-center gap-2'>
                                      <Badge variant='outline' className='text-[10px] bg-primary/10 text-primary border-primary/20'>
                                        Hosted Cover
                                      </Badge>
                                      {field.value.startsWith('http') && (
                                        <a
                                          href={field.value}
                                          target='_blank'
                                          rel='noreferrer'
                                          className='text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1'
                                        >
                                          View Full <ExternalLink className='h-3 w-3' />
                                        </a>
                                      )}
                                    </div>
                                    <p className='text-xs text-muted-foreground truncate mt-1 font-mono'>
                                      {field.value}
                                    </p>
                                  </div>
                                  <div className='flex items-center gap-1'>
                                    <Button
                                      type='button'
                                      variant='outline'
                                      size='sm'
                                      className='h-7 text-xs'
                                      onClick={() => coverFileInputRef.current?.click()}
                                    >
                                      Replace
                                    </Button>
                                    <Button
                                      type='button'
                                      variant='ghost'
                                      size='icon'
                                      className='h-7 w-7 text-destructive hover:bg-destructive/10'
                                      onClick={() => field.onChange('')}
                                    >
                                      <X className='h-4 w-4' />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className='space-y-3'>
                            <FormControl>
                              <div className='relative'>
                                <ImageIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                                <Input
                                  {...field}
                                  className='pl-9'
                                  placeholder='https://images.unsplash.com/photo-...'
                                />
                              </div>
                            </FormControl>

                            {/* Quick Preset Images */}
                            <div className='flex flex-wrap items-center gap-1.5'>
                              <span className='text-[11px] text-muted-foreground'>Presets:</span>
                              {[
                                {
                                  label: 'AI & Neural',
                                  url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
                                },
                                {
                                  label: 'Cloud & Servers',
                                  url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                                },
                                {
                                  label: 'Modern Code',
                                  url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
                                },
                                {
                                  label: 'Architecture',
                                  url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
                                },
                              ].map((preset) => (
                                <Badge
                                  key={preset.label}
                                  variant='outline'
                                  role='button'
                                  className='cursor-pointer text-[10px] select-none hover:bg-primary hover:text-primary-foreground'
                                  onClick={() => field.onChange(preset.url)}
                                >
                                  {preset.label}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tags */}
                  <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (Comma-separated)</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Tag className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                            <Input
                              {...field}
                              className='pl-9'
                              placeholder='RAG, LLMs, Python, FastAPI'
                            />
                          </div>
                        </FormControl>
                        <div className='flex flex-wrap items-center gap-1.5 pt-1.5'>
                          <span className='text-[11px] text-muted-foreground'>
                            Suggestions:
                          </span>
                          {COMMON_TAGS.map((tag) => (
                            <Badge
                              key={tag}
                              variant='outline'
                              role='button'
                              className='cursor-pointer text-[10px] select-none hover:bg-primary hover:text-primary-foreground'
                              onClick={() => handleAddTag(tag)}
                            >
                              + {tag}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Card 2: Author Info */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-base font-semibold'>
                    Author Information
                  </CardTitle>
                  <CardDescription>
                    Author profile shown at the top and bottom of the post
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='authorName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder='Swatantra Chaudhary' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='authorRole'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author Role (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='AI Engineer & Full Stack Developer'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='sm:col-span-2'>
                    <FormField
                      control={form.control}
                      name='authorAvatarUrl'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author Avatar URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder='https://images.unsplash.com/...'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Article Content (Markdown .md or Structured Sections) */}
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                  <div>
                    <CardTitle className='text-base font-semibold'>
                      Article Content
                    </CardTitle>
                    <CardDescription>
                      Write in raw Markdown (.md) with code blocks or build structured sections
                    </CardDescription>
                  </div>

                  {/* Mode switcher & File actions */}
                  <div className='flex items-center gap-1.5'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='h-8 text-xs gap-1.5'
                      onClick={() => fileInputRef.current?.click()}
                      title='Import existing .md file'
                    >
                      <FolderOpen className='h-3.5 w-3.5' />
                      Import .md
                    </Button>

                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='h-8 text-xs gap-1.5'
                      onClick={handleExportMdFile}
                      title='Download as .md file'
                    >
                      <Download className='h-3.5 w-3.5' />
                      Export .md
                    </Button>

                    <div className='flex rounded-lg border border-border/80 bg-muted/30 p-0.5'>
                      <Button
                        type='button'
                        variant={editorMode === 'markdown' ? 'default' : 'ghost'}
                        size='sm'
                        className='h-7 text-xs gap-1'
                        onClick={() => handleSwitchEditorMode('markdown')}
                      >
                        <FileCode className='h-3.5 w-3.5 pointer-events-none' />
                        <span className='pointer-events-none'>.md Editor</span>
                      </Button>
                      <Button
                        type='button'
                        variant={editorMode === 'sections' ? 'default' : 'ghost'}
                        size='sm'
                        className='h-7 text-xs gap-1'
                        onClick={() => handleSwitchEditorMode('sections')}
                      >
                        <span className='pointer-events-none'>Sections</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  {editorMode === 'markdown' ? (
                    <div className='space-y-3'>
                      {/* Markdown quick-insert toolbar */}
                      <div className='flex flex-wrap items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 p-1.5 text-xs'>
                        <span className='mr-1 font-semibold text-muted-foreground text-[11px]'>
                          Insert:
                        </span>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-7 px-2 text-xs gap-1'
                          onClick={() =>
                            handleInsertMarkdownSnippet('## New Heading\n\n')
                          }
                        >
                          <Heading2 className='h-3.5 w-3.5' />
                          Heading
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-7 px-2 text-xs gap-1'
                          onClick={() =>
                            handleInsertMarkdownSnippet(
                              '```typescript\n// Write your code here\nconst result = true;\n```'
                            )
                          }
                        >
                          <Code2 className='h-3.5 w-3.5 text-primary' />
                          Code Block
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-7 px-2 text-xs gap-1'
                          onClick={() =>
                            handleInsertMarkdownSnippet(
                              '> [!NOTE]\n> Key takeaway or important engineering consideration.'
                            )
                          }
                        >
                          <Quote className='h-3.5 w-3.5' />
                          Callout Note
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-7 px-2 text-xs gap-1'
                          onClick={() =>
                            handleInsertMarkdownSnippet(
                              '- Feature 1: High throughput\n- Feature 2: Low latency\n- Feature 3: Resilient fallback'
                            )
                          }
                        >
                          <List className='h-3.5 w-3.5' />
                          List
                        </Button>
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='h-7 px-2 text-xs gap-1'
                          onClick={() =>
                            handleInsertMarkdownSnippet(
                              '| Metric | Target | Result |\n|---|---|---|\n| LCP | < 2.5s | 1.1s |\n| FID | < 100ms | 18ms |'
                            )
                          }
                        >
                          <TableIcon className='h-3.5 w-3.5' />
                          Table
                        </Button>
                      </div>

                      {/* Markdown Textarea */}
                      <FormField
                        control={form.control}
                        name='content'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={18}
                                placeholder='Write your full blog post in Markdown format. Use # for headings, ```lang for code blocks, > for blockquotes...'
                                className='font-mono text-xs leading-relaxed sm:text-sm resize-y'
                              />
                            </FormControl>
                            <div className='flex items-center justify-between text-[11px] text-muted-foreground pt-1'>
                              <span>Supports full GitHub Flavored Markdown and syntax code blocks</span>
                              <span>{field.value?.length || 0} characters</span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    /* Structured Sections View */
                    <div className='space-y-6'>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className='rounded-xl border border-border/70 bg-card/60 p-4 space-y-4'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='font-mono text-xs font-semibold text-primary'>
                              Section #{index + 1}
                            </span>
                            {fields.length > 1 && (
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                className='h-7 text-xs text-destructive hover:text-destructive'
                                onClick={() => remove(index)}
                              >
                                <Trash2 className='h-3.5 w-3.5 mr-1' />
                                Remove
                              </Button>
                            )}
                          </div>

                          {/* Section Heading */}
                          <FormField
                            control={form.control}
                            name={`sections.${index}.heading`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-xs'>
                                  Section Heading
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder='e.g. Why Pure Vector Search Fails'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Section Body */}
                          <FormField
                            control={form.control}
                            name={`sections.${index}.body`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className='text-xs'>
                                  Section Body
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    rows={5}
                                    placeholder='Write section content. Separate paragraphs with double newlines...'
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Code Snippet (Optional) */}
                          <div className='space-y-2 rounded-lg border border-border/50 bg-muted/20 p-3'>
                            <div className='flex items-center gap-1.5 text-xs font-semibold text-muted-foreground'>
                              <Code2 className='h-3.5 w-3.5' />
                              Optional Code Snippet
                            </div>

                            <div className='grid grid-cols-1 gap-2 sm:grid-cols-4'>
                              <div className='sm:col-span-1'>
                                <FormField
                                  control={form.control}
                                  name={`sections.${index}.codeLanguage`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='text-[11px]'>
                                        Language
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          {...field}
                                          placeholder='python, ts, etc.'
                                          className='h-8 text-xs font-mono'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className='sm:col-span-3'>
                                <FormField
                                  control={form.control}
                                  name={`sections.${index}.codeSnippet`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className='text-[11px]'>
                                        Code Block
                                      </FormLabel>
                                      <FormControl>
                                        <Textarea
                                          {...field}
                                          rows={4}
                                          placeholder='Paste code here...'
                                          className='font-mono text-xs'
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='gap-1.5 text-xs'
                        onClick={() =>
                          append({
                            heading: '',
                            body: '',
                            codeLanguage: 'typescript',
                            codeSnippet: '',
                          })
                        }
                      >
                        <Plus className='h-3.5 w-3.5' />
                        Add Section
                      </Button>
                    </div>
                  )}
                </CardContent>

                <CardFooter className='border-t bg-muted/10 p-4 flex items-center justify-between'>
                  <div className='text-xs text-muted-foreground'>
                    {editorMode === 'markdown'
                      ? 'Editing in Markdown (.md) mode'
                      : `Structured mode (${fields.length} sections)`}
                  </div>

                  <div className='flex items-center gap-2'>
                    <Button variant='outline' asChild size='sm'>
                      <Link to='/manage-blogs'>Cancel</Link>
                    </Button>
                    <Button
                      type='submit'
                      size='sm'
                      className='gap-1.5'
                      disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
                    >
                      <Save className='h-3.5 w-3.5' />
                      {createBlogMutation.isPending || updateBlogMutation.isPending
                        ? 'Saving...'
                        : isEdit
                        ? 'Save Changes'
                        : 'Publish Blog'}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </Form>
        )}

        {/* Live Preview Side (Split View or Full Preview) */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <BlogLivePreviewPane
            control={form.control}
            editorMode={editorMode}
            initialData={initialData}
            viewMode={viewMode}
            onClosePreview={() => startModeTransition(() => setViewMode('edit'))}
          />
        )}
      </div>
    </div>
  )
}
