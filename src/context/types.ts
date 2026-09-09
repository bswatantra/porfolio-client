import type React from 'react'
import type { fonts } from '@/config/fonts'

// Theme Provider types
export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = Exclude<Theme, 'system'>

export type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export type ThemeProviderState = {
  defaultTheme: Theme
  resolvedTheme: ResolvedTheme
  theme: Theme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}

// Layout Provider types
export type Collapsible = 'offcanvas' | 'icon' | 'none'
export type Variant = 'inset' | 'sidebar' | 'floating'

export type LayoutContextType = {
  resetLayout: () => void
  defaultCollapsible: Collapsible
  collapsible: Collapsible
  setCollapsible: (collapsible: Collapsible) => void
  defaultVariant: Variant
  variant: Variant
  setVariant: (variant: Variant) => void
}

export type LayoutProviderProps = {
  children: React.ReactNode
}

// Font Provider types
export type Font = (typeof fonts)[number]

export type FontContextType = {
  font: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

export type FontProviderProps = {
  children: React.ReactNode
}

// Direction Provider types
export type Direction = 'ltr' | 'rtl'

export type DirectionContextType = {
  defaultDir: Direction
  dir: Direction
  setDir: (dir: Direction) => void
  resetDir: () => void
}

export type DirectionProviderProps = {
  children: React.ReactNode
}

// Search Provider types
export type SearchContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type SearchProviderProps = {
  children: React.ReactNode
}
