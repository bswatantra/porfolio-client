import { createFileRoute } from '@tanstack/react-router'
import { HeroNew } from '@/features/hero/new'

export const Route = createFileRoute('/_authenticated/hero/new')({
  component: HeroNew,
})

