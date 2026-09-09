import type { Education } from '@/features/education/schemas'
import type { Experience } from '@/features/experiences/schemas'
import type { Project } from '@/features/projects/schemas'
import type { Skill } from '@/features/skills/schemas'
import type { Hero } from '@/features/hero/schemas'
import type { About } from '@/features/about/schemas'

export interface PortfolioStat {
  label: string
  value: string
}

export interface PortfolioOwner {
  name: string
  title: string
  roles: string[]
  tagline: string
  about: string
  email: string
  github: string
  linkedin: string
  location: string
  availableForWork: boolean
  stats: PortfolioStat[]
  specializations: string[]
  terminalChips?: string[]
  avatarUrl?: string | null
  resumeUrl?: string | null
}

export interface PortfolioData {
  owner: PortfolioOwner
  hero?: Hero | null
  about?: About | null
  experiences: Experience[]
  projects: Project[]
  skills: Skill[]
  education: Education[]
}

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  author?: string
  image?: string
  url?: string
}

