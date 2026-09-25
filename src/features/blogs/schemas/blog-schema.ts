import { z } from 'zod'

export const blogSectionSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  body: z.string().min(1, 'Section body is required'),
  codeLanguage: z.string(),
  codeSnippet: z.string(),
})

export const blogFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  readTime: z.string().min(1, 'Read time is required'),
  coverImage: z
    .string()
    .min(1, 'Cover image is required')
    .refine(
      (val) =>
        val.startsWith('http://') ||
        val.startsWith('https://') ||
        val.startsWith('data:image/') ||
        val.startsWith('/'),
      { message: 'Cover image must be a valid URL or uploaded image' }
    ),
  featured: z.boolean(),
  tags: z.string().min(1, 'At least one tag is required (comma-separated)'),
  authorName: z.string().min(1, 'Author name is required'),
  authorRole: z.string(),
  authorAvatarUrl: z.string(),
  editorMode: z.string(),
  content: z.string(),
  sections: z.array(blogSectionSchema),
})

export type BlogFormData = z.infer<typeof blogFormSchema>

export const blogSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  search: z.string().optional(),
  category: z.string().optional(),
})

export type BlogSearch = z.infer<typeof blogSearchSchema>
