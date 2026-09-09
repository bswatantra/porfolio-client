import { createFileRoute } from '@tanstack/react-router'
import { AboutFeature } from '@/features/about'

export const Route = createFileRoute('/_authenticated/about/')({
  component: AboutFeature,
})

