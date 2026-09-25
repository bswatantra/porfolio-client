import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/manage-blogs/$blogId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/manage-blogs/$blogId"!</div>
}
