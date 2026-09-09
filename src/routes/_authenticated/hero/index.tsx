import { createFileRoute } from '@tanstack/react-router'
import { HeroFeature } from '@/features/hero'

export const Route = createFileRoute('/_authenticated/hero/')({
  component: HeroFeature,
})

