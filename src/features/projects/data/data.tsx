import {
  Archive,
  CheckCircle2,
  Clock,
  Code2,
  Globe,
  Layers,
  Server,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react'
import { type ProjectCategory, type ProjectStatus } from '../schemas'

export const categories: {
  label: string
  value: ProjectCategory
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: 'Full Stack',
    value: 'full-stack',
    icon: Layers,
  },
  {
    label: 'Web Application',
    value: 'web-app',
    icon: Globe,
  },
  {
    label: 'Mobile Application',
    value: 'mobile-app',
    icon: Smartphone,
  },
  {
    label: 'Open Source',
    value: 'open-source',
    icon: Code2,
  },
  {
    label: 'API & Backend',
    value: 'api-backend',
    icon: Server,
  },
  {
    label: 'AI / Machine Learning',
    value: 'ai-ml',
    icon: Sparkles,
  },
]

export const statuses: {
  label: string
  value: ProjectStatus
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: 'Active',
    value: 'active',
    icon: Zap,
  },
  {
    label: 'In Progress',
    value: 'in-progress',
    icon: Clock,
  },
  {
    label: 'Completed',
    value: 'completed',
    icon: CheckCircle2,
  },
  {
    label: 'Archived',
    value: 'archived',
    icon: Archive,
  },
]

export const commonTechnologies = [
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Supabase',
  'GraphQL',
  'Docker',
  'OpenAI',
  'Prisma',
  'Redis',
  'AWS',
  'Flutter',
  'React Native',
]
