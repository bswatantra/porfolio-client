import { z } from 'zod'

export const educationDegreeSchema = z.enum([
  'bachelor',
  'master',
  'doctorate',
  'associate',
  'diploma',
  'bootcamp',
  'certificate',
  'other',
])

export const educationStatusSchema = z.enum([
  'completed',
  'in-progress',
  'deferred',
])

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: educationDegreeSchema,
  fieldOfStudy: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  grade: z.string().nullish(),
  location: z.string(),
  activities: z.string().nullish(),
  description: z.string(),
  status: educationStatusSchema,
})

export const educationListSchema = z.array(educationSchema)

export const educationFormSchema = z.object({
  institution: z.string().min(1, 'Institution / School name is required.'),
  degree: z.string().min(1, 'Please select a degree level.'),
  fieldOfStudy: z.string().min(1, 'Field of study / Major is required.'),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().min(1, 'End date is required.'),
  current: z.boolean(),
  grade: z.string().optional(),
  location: z.string().min(1, 'Location is required.'),
  activities: z.string().optional(),
  description: z
    .string()
    .min(1, 'Please provide description or coursework details.'),
  status: z.string().min(1, 'Please choose a status.'),
})

export const educationImportDialogSchema = z.object({
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

export const educationSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(educationStatusSchema).optional().catch([]),
  degree: z.array(educationDegreeSchema).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export type EducationDegree = z.infer<typeof educationDegreeSchema>
export type EducationStatus = z.infer<typeof educationStatusSchema>
export type Education = z.infer<typeof educationSchema>
export type EducationList = z.infer<typeof educationListSchema>
export type EducationFormData = z.infer<typeof educationFormSchema>
export type EducationFormValues = EducationFormData
export type EducationImportDialogValues = z.infer<
  typeof educationImportDialogSchema
>
export type EducationSearch = z.infer<typeof educationSearchSchema>
