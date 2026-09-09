import { createFileRoute } from '@tanstack/react-router'
import { SkillNew } from '@/features/skills/new'

export const Route = createFileRoute('/_authenticated/skills/new')({
  component: SkillNew,
})
