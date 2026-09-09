import { z } from 'zod'

export const heroSchema = z.object({
  id: z.string(),
  name: z.string().default(''),
  title: z.string().default(''),
  roles: z.array(z.string()).nullish().transform((v) => v ?? []),
  tagline: z.string().nullish().transform((v) => v ?? ''),
  specializations: z.array(z.string()).nullish().transform((v) => v ?? []),
  terminalChips: z.array(z.string()).nullish().transform((v) => v ?? []),
  location: z.string().nullish().transform((v) => v ?? ''),
  email: z.string().nullish().transform((v) => v ?? ''),
  github: z.string().nullish().transform((v) => v ?? ''),
  linkedin: z.string().nullish().transform((v) => v ?? ''),
  avatarUrl: z.string().nullish(),
  resumeUrl: z.string().nullish(),
  availableForWork: z.boolean().nullish().transform((v) => v ?? true),
  isActive: z.boolean().nullish().transform((v) => v ?? true),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
})

export type Hero = z.infer<typeof heroSchema>

export const heroFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  title: z.string().min(1, 'Headline / title is required.'),
  roles: z.string().min(1, 'Please enter at least one role (comma separated).'),
  tagline: z.string().min(1, 'Please enter a short tagline / pitch.'),
  specializations: z.string(),
  terminalChips: z.string(),
  location: z.string().min(1, 'Location is required.'),
  email: z.string().email('Please enter a valid email address.'),
  github: z.string().url('Please enter a valid GitHub URL.').or(z.literal('')),
  linkedin: z.string().url('Please enter a valid LinkedIn URL.').or(z.literal('')),
  availableForWork: z.boolean(),
  isActive: z.boolean(),
})

export type HeroFormData = z.infer<typeof heroFormSchema>

