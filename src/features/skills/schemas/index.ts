import { z } from 'zod'

export const skillCategorySchema = z.enum([
  'frontend',
  'backend',
  'database',
  'devops',
  'mobile',
  'design',
  'tools',
  'languages',
])

export const skillProficiencySchema = z.enum([
  'expert',
  'advanced',
  'intermediate',
  'beginner',
])

export const skillStatusSchema = z.enum(['active', 'learning', 'archived'])

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: skillCategorySchema,
  proficiency: skillProficiencySchema,
  yearsOfExperience: z.number(),
  featured: z.boolean(),
  status: skillStatusSchema,
  description: z.string(),
})

export const skillListSchema = z.array(skillSchema)

export const skillFormSchema = z.object({
  name: z.string().min(1, 'Skill name is required.'),
  category: z.string().min(1, 'Please select a category.'),
  proficiency: z.string().min(1, 'Please choose a proficiency level.'),
  yearsOfExperience: z.number().min(0, 'Years must be 0 or more.'),
  featured: z.boolean(),
  status: z.string().min(1, 'Please select a status.'),
  description: z
    .string()
    .min(1, 'Please provide notes or context for this skill.'),
})

export const skillImportDialogSchema = z.object({
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

export const skillSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  status: z.array(skillStatusSchema).optional().catch([]),
  category: z.array(skillCategorySchema).optional().catch([]),
  proficiency: z.array(skillProficiencySchema).optional().catch([]),
  filter: z.string().optional().catch(''),
})

export type SkillCategory = z.infer<typeof skillCategorySchema>
export type SkillProficiency = z.infer<typeof skillProficiencySchema>
export type SkillStatus = z.infer<typeof skillStatusSchema>
export type Skill = z.infer<typeof skillSchema>
export type SkillList = z.infer<typeof skillListSchema>
export type SkillFormData = z.infer<typeof skillFormSchema>
export type SkillFormValues = SkillFormData
export type SkillImportDialogValues = z.infer<typeof skillImportDialogSchema>
export type SkillSearch = z.infer<typeof skillSearchSchema>
