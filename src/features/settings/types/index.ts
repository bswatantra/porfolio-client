import type React from 'react'
import type { JSX } from 'react'
import { type AccountFormValues, type ProfileFormValues } from '../schemas'

export type ContentSectionProps = {
  title: string
  desc: string
  children: React.JSX.Element
}

export type SidebarNavItem = {
  href: string
  title: string
  icon: JSX.Element
}

export type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: SidebarNavItem[]
}

export type { ProfileFormValues, AccountFormValues }
