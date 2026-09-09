import { z } from 'zod'

export const aboutSchema = z.object({
  id: z.string(),
  eyebrow: z.string().nullish().transform((v) => v ?? 'About me'),
  title: z.string().nullish().transform((v) => v ?? ''),
  description: z.string().nullish().transform((v) => v ?? ''),
  yearsOfExperience: z.string().nullish().transform((v) => v ?? '0+'),
  openSourceStars: z.string().nullish().transform((v) => v ?? '0'),
  email: z.string().nullish(),
  github: z.string().nullish(),
  resumeUrl: z.string().nullish(),
  isActive: z.boolean().nullish().transform((v) => v ?? true),
  projectsCount: z.number().nullish().transform((v) => v ?? 0),
  skillsCount: z.number().nullish().transform((v) => v ?? 0),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
})

export type About = z.infer<typeof aboutSchema>

export const aboutFormSchema = z.object({
  eyebrow: z.string().min(1, 'Section eyebrow is required.'),
  title: z.string().min(1, 'Title headline is required.'),
  description: z.string().min(1, 'Bio / narrative description is required.'),
  yearsOfExperience: z.string().min(1, 'Years of experience is required.'),
  openSourceStars: z.string().min(1, 'Open source stars or community stat is required.'),
  email: z.string().email('Please enter a valid email address.').or(z.literal('')),
  github: z.string().url('Please enter a valid GitHub URL.').or(z.literal('')),
  isActive: z.boolean(),
})

export type AboutFormData = z.infer<typeof aboutFormSchema>

