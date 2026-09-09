import {
  Archive,
  BookOpen,
  Cloud,
  Code2,
  Database,
  Globe,
  Palette,
  Server,
  Smartphone,
  Wrench,
  Zap,
} from 'lucide-react'
import {
  type SkillCategory,
  type SkillProficiency,
  type SkillStatus,
} from '../schemas'

export const categories: {
  label: string
  value: SkillCategory
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: 'Frontend',
    value: 'frontend',
    icon: Globe,
  },
  {
    label: 'Backend',
    value: 'backend',
    icon: Server,
  },
  {
    label: 'Languages',
    value: 'languages',
    icon: Code2,
  },
  {
    label: 'Database',
    value: 'database',
    icon: Database,
  },
  {
    label: 'DevOps & Cloud',
    value: 'devops',
    icon: Cloud,
  },
  {
    label: 'Mobile',
    value: 'mobile',
    icon: Smartphone,
  },
  {
    label: 'UI/UX & Design',
    value: 'design',
    icon: Palette,
  },
  {
    label: 'Tools & Ecosystem',
    value: 'tools',
    icon: Wrench,
  },
]

export const proficiencies: {
  label: string
  value: SkillProficiency
  percentage: number
  colorClass: string
}[] = [
  {
    label: 'Expert',
    value: 'expert',
    percentage: 95,
    colorClass: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    label: 'Advanced',
    value: 'advanced',
    percentage: 80,
    colorClass: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  },
  {
    label: 'Intermediate',
    value: 'intermediate',
    percentage: 60,
    colorClass: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  },
  {
    label: 'Beginner',
    value: 'beginner',
    percentage: 35,
    colorClass: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
  },
]

export const statuses: {
  label: string
  value: SkillStatus
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: 'Active & In Use',
    value: 'active',
    icon: Zap,
  },
  {
    label: 'Learning / Exploring',
    value: 'learning',
    icon: BookOpen,
  },
  {
    label: 'Archived',
    value: 'archived',
    icon: Archive,
  },
]

export const commonSkillsPresets = [
  'TypeScript',
  'React',
  'Next.js',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'PostgreSQL',
  'GraphQL',
  'Docker',
  'AWS',
  'Redis',
  'Figma',
  'Git',
  'Flutter',
  'Go',
  'Kubernetes',
]
