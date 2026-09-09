import { createFileRoute } from '@tanstack/react-router'
import { AboutNew } from '@/features/about/new'

export const Route = createFileRoute('/_authenticated/about/new')({
  component: AboutNew,
})

