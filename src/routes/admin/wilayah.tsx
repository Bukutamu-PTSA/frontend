import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/wilayah')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/wilayah"!</div>
}
