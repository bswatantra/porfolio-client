import {
  Briefcase,
  Code2,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  MousePointerClick,
  Star,
  Timer,
  Users,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PortfolioActivityChart } from './components/portfolio-activity-chart'
import { RecentProjects } from './components/recent-projects'
import { SkillsBreakdown } from './components/skills-breakdown'
import { useGetProjectsQuery } from '@/features/projects/api/projects-api'
import { useGetExperiencesQuery } from '@/features/experiences/api/experiences-api'
import { useGetSkillsQuery } from '@/features/skills/api/skills-api'
import { useGetEducationListQuery } from '@/features/education/api/education-api'

export function Dashboard() {
  const { data: projects = [] } = useGetProjectsQuery()
  const { data: experiences = [] } = useGetExperiencesQuery()
  const { data: skills = [] } = useGetSkillsQuery()
  const { data: education = [] } = useGetEducationListQuery()

  const activeExperiences = experiences.filter(
    (e) => e.status === 'active' || e.current
  ).length
  const featuredSkills = skills.filter((s) => s.featured).length
  const inProgressEducation = education.filter(
    (e) => e.status === 'in-progress' || e.current
  ).length

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ProfileDropdown />
      </Header>

      {/* ===== Main ===== */}
      <Main>
        {/* Page heading */}
        <div className='mb-6 flex items-center gap-3'>
          <LayoutDashboard className='h-6 w-6 text-muted-foreground' />
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-sm text-muted-foreground'>
              Your portfolio at a glance.
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title='Total Projects'
            value={String(projects.length)}
            delta={`${projects.filter((p) => p.featured).length} featured`}
            icon={FolderKanban}
            iconColor='text-blue-500'
          />
          <StatCard
            title='Work Experiences'
            value={String(experiences.length)}
            delta={`${activeExperiences} active roles`}
            icon={Briefcase}
            iconColor='text-emerald-500'
          />
          <StatCard
            title='Skills'
            value={String(skills.length)}
            delta={`${featuredSkills} featured`}
            icon={Code2}
            iconColor='text-violet-500'
          />
          <StatCard
            title='Education'
            value={String(education.length)}
            delta={`${inProgressEducation} in progress`}
            icon={GraduationCap}
            iconColor='text-amber-500'
          />
        </div>

        {/* Portfolio analytics */}
        <div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-7'>
          {/* Activity chart */}
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Portfolio Activity</CardTitle>
              <CardDescription>
                Profile views & project clicks over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className='ps-2'>
              <PortfolioActivityChart />
            </CardContent>
          </Card>

          {/* Visitor stats */}
          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader>
              <CardTitle>Visitor Stats</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <VisitorStatRow
                icon={Users}
                label='Profile Views'
                value='1,248'
                delta='+12.4%'
                positive
              />
              <VisitorStatRow
                icon={MousePointerClick}
                label='Project Clicks'
                value='832'
                delta='+5.8%'
                positive
              />
              <VisitorStatRow
                icon={Timer}
                label='Avg. Time on Page'
                value='3m 24s'
                delta='+18s'
                positive
              />
              <VisitorStatRow
                icon={Star}
                label='Featured Project Views'
                value='416'
                delta='+9.2%'
                positive
              />
            </CardContent>
          </Card>
        </div>

        {/* Bottom row */}
        <div className='mt-6 grid grid-cols-1 gap-4 lg:grid-cols-7'>
          {/* Recent projects */}
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Your latest portfolio projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentProjects />
            </CardContent>
          </Card>

          {/* Skills breakdown */}
          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader>
              <CardTitle>Skills Breakdown</CardTitle>
              <CardDescription>By category</CardDescription>
            </CardHeader>
            <CardContent>
              <SkillsBreakdown />
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

/* ─── Sub-components ──────────────────────────────────────────────── */

type StatCardProps = {
  title: string
  value: string
  delta: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
}

function StatCard({
  title,
  value,
  delta,
  icon: Icon,
  iconColor = 'text-muted-foreground',
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{delta}</p>
      </CardContent>
    </Card>
  )
}

type VisitorStatRowProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  delta: string
  positive?: boolean
}

function VisitorStatRow({
  icon: Icon,
  label,
  value,
  delta,
  positive = true,
}: VisitorStatRowProps) {
  return (
    <div className='flex items-center gap-4'>
      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted'>
        <Icon className='h-4 w-4 text-muted-foreground' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>{label}</p>
        <p className='text-xs text-muted-foreground'>{value}</p>
      </div>
      <span
        className={`text-xs font-medium ${positive ? 'text-emerald-500' : 'text-red-500'}`}
      >
        {delta}
      </span>
    </div>
  )
}
