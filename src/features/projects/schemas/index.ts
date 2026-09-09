import { z } from 'zod'

export const projectCategorySchema = z.enum([
  'full-stack',
  'web-app',
  'mobile-app',
  'open-source',
  'api-backend',
  'ai-ml',
])

export const projectStatusSchema = z.enum([
  'active',
  'completed',
  'in-progress',
  'archived',
])

export const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  category: projectCategorySchema,
  status: projectStatusSchema,
  featured: z.boolean(),
  liveUrl: z.string().nullish(),
  repoUrl: z.string().nullish(),
  thumbnail: z.string().nullish(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  technologies: z.array(z.string()),
  description: z.string(),
})

export const projectListSchema = z.array(projectSchema)

export const projectFormSchema = z.object({
  title: z.string().min(1, 'Project title is required.'),
  tagline: z.string().min(1, 'Please provide a short tagline / summary.'),
  category: z.string().min(1, 'Please select a project category.'),
  status: z.string().min(1, 'Please choose a status.'),
  featured: z.boolean(),
  liveUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  thumbnail: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
  current: z.boolean(),
  technologies: z
    .string()
    .min(1, 'Please provide at least one technology or tool.'),
  description: z
    .string()
    .min(1, 'Please enter an overview and highlights of the project.'),
})

export const projectImportDialogSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, {
      message: 'Please upload a file.',
    })
    .refine(
      (files) => ['text/csv', 'application/json'].includes(files?.[0]?.type),
      'Please upload CSV or JSON format.'
    ),
})

export const projectSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(projectStatusSchema).optional().catch([]),
  category: z.array(projectCategorySchema).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export type ProjectCategory = z.infer<typeof projectCategorySchema>
export type ProjectStatus = z.infer<typeof projectStatusSchema>
export type Project = z.infer<typeof projectSchema>
export type ProjectList = z.infer<typeof projectListSchema>
export type ProjectFormData = z.infer<typeof projectFormSchema>
export type ProjectFormValues = ProjectFormData
export type ProjectImportDialogValues = z.infer<
  typeof projectImportDialogSchema
>
export type ProjectSearch = z.infer<typeof projectSearchSchema>
