import type React from 'react'
import { type LinkProps } from '@tanstack/react-router'

export type User = {
  name: string
  email: string
  avatar: string
}

export type Team = {
  name: string
  logo: React.ElementType
  plan: string
}

export type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
}

export type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

export type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

export type NavItem = NavCollapsible | NavLink

export type NavGroup = {
  title: string
  items: NavItem[]
}

export type SidebarData = {
  user: User
  teams: Team[]
  navGroups: NavGroup[]
}

export type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  ref?: React.Ref<HTMLElement>
}

export type MainProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
  fluid?: boolean
  ref?: React.Ref<HTMLElement>
}

export type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links: {
    title: string
    href: string
    isActive: boolean
    disabled?: boolean
  }[]
}

export type TeamSwitcherProps = {
  teams: Team[]
}

export type NavUserProps = {
  user: User
}

export type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}
