import {
  useGetExperiencesQuery,
  useGetExperienceQuery,
} from '@/features/experiences/api/experiences-api'
import {
  useGetProjectsQuery,
  useGetProjectQuery,
} from '@/features/projects/api/projects-api'
import {
  useGetSkillsQuery,
  useGetSkillQuery,
} from '@/features/skills/api/skills-api'
import {
  useGetEducationListQuery,
  useGetEducationQuery,
} from '@/features/education/api/education-api'
import { useGetActiveHeroQuery } from '@/features/hero/api/hero-api'
import { useGetActiveAboutQuery } from '@/features/about/api/about-api'
import type { PortfolioData, PortfolioOwner } from '../types'

export const portfolioQueryKeys = {
  all: ['portfolio'] as const,
  data: () => [...portfolioQueryKeys.all, 'data'] as const,
  owner: () => [...portfolioQueryKeys.all, 'owner'] as const,
  experiences: () => ['experiences'] as const,
  experience: (id: string) => ['experiences', id] as const,
  projects: () => ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  skills: () => ['skills'] as const,
  education: () => ['education'] as const,
  hero: () => ['heroes', 'active'] as const,
  about: () => ['about', 'active'] as const,
}

/**
 * Main hook to fetch all portfolio sections.
 * Executes live public API queries for hero, about, experiences, projects, skills, and education.
 * Exclusively provides live data from the API without any mock data fallbacks.
 */
export function usePortfolio() {
  const heroQuery = useGetActiveHeroQuery()
  const aboutQuery = useGetActiveAboutQuery()
  const experiencesQuery = useGetExperiencesQuery()
  const projectsQuery = useGetProjectsQuery()
  const skillsQuery = useGetSkillsQuery()
  const educationQuery = useGetEducationListQuery()

  const experiences = experiencesQuery.data ?? []
  const projects = projectsQuery.data ?? []
  const skills = skillsQuery.data ?? []
  const education = educationQuery.data ?? []

  const hero = heroQuery.data ?? null
  const about = aboutQuery.data ?? null

  const owner: PortfolioOwner = {
    name: hero?.name || '',
    title: hero?.title || '',
    roles: hero?.roles && hero.roles.length > 0 ? hero.roles : [],
    tagline: hero?.tagline || '',
    about: about?.description || '',
    email: hero?.email || about?.email || '',
    github: hero?.github || about?.github || '',
    linkedin: hero?.linkedin || '',
    location: hero?.location || '',
    availableForWork: hero?.availableForWork ?? true,
    specializations:
      hero?.specializations && hero.specializations.length > 0
        ? hero.specializations
        : [],
    terminalChips:
      hero?.terminalChips && hero.terminalChips.length > 0
        ? hero.terminalChips
        : [],
    avatarUrl: hero?.avatarUrl,
    resumeUrl: hero?.resumeUrl,
    stats: [
      {
        label: 'Years of Experience',
        value: about?.yearsOfExperience || '0+',
      },
      {
        label: 'Projects Shipped',
        value:
          about?.projectsCount !== undefined
            ? `${about.projectsCount}+`
            : projects.length > 0
              ? `${projects.length}+`
              : '0+',
      },
      {
        label: 'Skills Mastered',
        value:
          about?.skillsCount !== undefined
            ? `${about.skillsCount}`
            : skills.length > 0
              ? `${skills.length}`
              : '0',
      },
      {
        label: 'Open Source Stars',
        value: about?.openSourceStars || '0',
      },
    ],
  }

  const data: PortfolioData = {
    owner,
    hero,
    about,
    experiences,
    projects,
    skills,
    education,
  }

  const isLoading =
    heroQuery.isLoading ||
    aboutQuery.isLoading ||
    experiencesQuery.isLoading ||
    projectsQuery.isLoading ||
    skillsQuery.isLoading ||
    educationQuery.isLoading

  const isError =
    heroQuery.isError ||
    aboutQuery.isError ||
    experiencesQuery.isError ||
    projectsQuery.isError ||
    skillsQuery.isError ||
    educationQuery.isError

  const refetchAll = () => {
    heroQuery.refetch()
    aboutQuery.refetch()
    experiencesQuery.refetch()
    projectsQuery.refetch()
    skillsQuery.refetch()
    educationQuery.refetch()
  }

  return {
    data,
    isLoading,
    isError,
    refetchAll,
    hero,
    about,
    experiences,
    projects,
    skills,
    education,
    heroQuery,
    aboutQuery,
    experiencesQuery,
    projectsQuery,
    skillsQuery,
    educationQuery,
  }
}

export function usePortfolioOwner() {
  return useGetActiveHeroQuery()
}

export function usePortfolioExperiences() {
  return useGetExperiencesQuery()
}

export function usePortfolioProjects() {
  return useGetProjectsQuery()
}

export function usePortfolioSkills() {
  return useGetSkillsQuery()
}

export function usePortfolioEducation() {
  return useGetEducationListQuery()
}

export function usePortfolioProject(id: string | undefined) {
  return useGetProjectQuery(id)
}

export function usePortfolioExperience(id: string | undefined) {
  return useGetExperienceQuery(id)
}

export function usePortfolioSkill(id: string | undefined) {
  return useGetSkillQuery(id)
}

export function usePortfolioEducationItem(id: string | undefined) {
  return useGetEducationQuery(id)
}
