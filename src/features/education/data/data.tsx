import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  FileCheck,
  GraduationCap,
  Library,
  PauseCircle,
  Sparkles,
} from 'lucide-react'
import { type EducationDegree, type EducationStatus } from '../schemas'

export const degrees: {
  label: string
  value: EducationDegree
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: "Bachelor's Degree",
    value: 'bachelor',
    icon: GraduationCap,
  },
  {
    label: "Master's Degree",
    value: 'master',
    icon: Award,
  },
  {
    label: 'Doctorate / Ph.D.',
    value: 'doctorate',
    icon: BookOpen,
  },
  {
    label: 'Associate Degree',
    value: 'associate',
    icon: Library,
  },
  {
    label: 'High School Diploma',
    value: 'diploma',
    icon: Library,
  },
  {
    label: 'Coding Bootcamp',
    value: 'bootcamp',
    icon: Code2,
  },
  {
    label: 'Professional Certificate',
    value: 'certificate',
    icon: FileCheck,
  },
  {
    label: 'Other / Online Coursework',
    value: 'other',
    icon: Sparkles,
  },
]

export const statuses: {
  label: string
  value: EducationStatus
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: 'Completed / Graduated',
    value: 'completed',
    icon: CheckCircle2,
  },
  {
    label: 'In Progress / Enrolled',
    value: 'in-progress',
    icon: Clock,
  },
  {
    label: 'On Leave / Deferred',
    value: 'deferred',
    icon: PauseCircle,
  },
]

export const commonInstitutionsPresets = [
  'Stanford University',
  'Massachusetts Institute of Technology (MIT)',
  'University of California, Berkeley',
  'Harvard University',
  'Carnegie Mellon University',
  'freeCodeCamp',
  'Coursera / DeepLearning.AI',
  'General Assembly',
]

export const commonFieldsOfStudy = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Data Science & AI',
  'Electrical & Computer Engineering',
  'Human-Computer Interaction',
  'Cybersecurity',
  'Mathematics & Computation',
]
