import { Loader2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useGetProjectsQuery } from './api/projects-api'
import { ProjectsDialogs } from './components/projects-dialogs'
import { ProjectsPrimaryButtons } from './components/projects-primary-buttons'
import { ProjectsProvider } from './components/projects-provider'
import { ProjectsTable } from './components/projects-table'

export function Projects() {
  const { data: projects = [], isLoading } = useGetProjectsQuery()

  return (
    <ProjectsProvider>
      <Header fixed>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Projects</h2>
            <p className='text-muted-foreground'>
              Manage and showcase your portfolio projects, applications, and
              open source work.
            </p>
          </div>
          <ProjectsPrimaryButtons />
        </div>
        {isLoading ? (
          <div className='flex h-64 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : (
          <ProjectsTable data={projects} />
        )}
      </Main>

      <ProjectsDialogs />
    </ProjectsProvider>
  )
}
