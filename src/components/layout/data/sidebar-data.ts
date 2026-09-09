import {
  LayoutDashboard, Users, Briefcase, FolderGit2,
  GraduationCap, Settings,
  Sparkles,
  Wrench,
  UserCog, AudioWaveform,
  Command,
  GalleryVerticalEnd,
  UserCheck,
  Zap,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Hero Section',
          url: '/hero',
          icon: Zap,
        },
        {
          title: 'About Me',
          url: '/about',
          icon: UserCheck,
        },
        {
          title: 'Users',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Experiences',
          url: '/experiences',
          icon: Briefcase,
        },
        {
          title: 'Projects',
          url: '/projects',
          icon: FolderGit2,
        },
        {
          title: 'Skills',
          url: '/skills',
          icon: Sparkles,
        },
        {
          title: 'Education',
          url: '/education',
          icon: GraduationCap,
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
          ],
        },
      ],
    },
  ],
}
