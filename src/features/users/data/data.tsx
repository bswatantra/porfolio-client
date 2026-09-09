import { CheckCircle2, XCircle } from 'lucide-react'
import { type UserStatus } from '../schemas'

export const statuses: {
  label: string
  value: UserStatus
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    value: 'active',
    label: 'Active',
    icon: CheckCircle2,
  },
  {
    value: 'inactive',
    label: 'Inactive',
    icon: XCircle,
  },
]
