import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileEdit,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { type ExperienceEmploymentType, type ExperienceStatus } from '../schemas'

export const employmentTypes: {
  label: string
  value: ExperienceEmploymentType
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    value: 'full-time',
    label: 'Full-time',
    icon: Briefcase,
  },
  {
    value: 'part-time',
    label: 'Part-time',
    icon: Clock,
  },
  {
    value: 'contract',
    label: 'Contract',
    icon: FileEdit,
  },
  {
    value: 'freelance',
    label: 'Freelance',
    icon: Sparkles,
  },
  {
    value: 'internship',
    label: 'Internship',
    icon: GraduationCap,
  },
]

export const statuses: {
  label: string
  value: ExperienceStatus
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    value: 'active',
    label: 'Active',
    icon: CheckCircle2,
  },
  {
    value: 'completed',
    label: 'Completed',
    icon: Clock,
  },
  {
    value: 'draft',
    label: 'Draft',
    icon: FileEdit,
  },
]

export const commonSkills = [
  'React',
  'TypeScript',
  'JavaScript',
  'Next.js',
  'Node.js',
  'Tailwind CSS',
  'GraphQL',
  'REST APIs',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'AWS',
  'Git',
  'Python',
  'Vue.js',
  'Figma',
]
