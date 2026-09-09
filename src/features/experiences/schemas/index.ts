import { z } from 'zod'

export const experienceEmploymentTypeSchema = z.enum([
  'full-time',
  'part-time',
  'contract',
  'freelance',
  'internship',
])

export const experienceStatusSchema = z.enum(['active', 'completed', 'draft'])

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string(),
  company: z.string(),
  employmentType: experienceEmploymentTypeSchema,
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string(),
  skills: z.array(z.string()),
  status: experienceStatusSchema,
})

export const experienceListSchema = z.array(experienceSchema)

export const experienceFormSchema = z.object({
  role: z.string().min(1, 'Role / Job title is required.'),
  company: z.string().min(1, 'Company / Organization name is required.'),
  employmentType: z.string().min(1, 'Please select employment type.'),
  location: z.string().min(1, 'Location is required.'),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
  current: z.boolean(),
  skills: z.string().min(1, 'Please provide at least one skill or technology.'),
  description: z.string().min(1, 'Please enter a description of your work.'),
  status: z.string().min(1, 'Please choose a status.'),
})

export const experienceImportDialogSchema = z.object({
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

export const experienceSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(experienceStatusSchema).optional().catch([]),
  employmentType: z.array(experienceEmploymentTypeSchema).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export type ExperienceEmploymentType = z.infer<
  typeof experienceEmploymentTypeSchema
>
export type ExperienceStatus = z.infer<typeof experienceStatusSchema>
export type Experience = z.infer<typeof experienceSchema>
export type ExperienceList = z.infer<typeof experienceListSchema>
export type ExperienceFormData = z.infer<typeof experienceFormSchema>
export type ExperienceFormValues = ExperienceFormData
export type ExperienceImportDialogValues = z.infer<
  typeof experienceImportDialogSchema
>
export type ExperienceSearch = z.infer<typeof experienceSearchSchema>
