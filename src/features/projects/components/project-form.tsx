import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  FolderGit2,
  Globe,
  ImageIcon,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Star,
  Wrench,
} from 'lucide-react'
import { IconGithub } from '@/assets/brand-icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { categories, commonTechnologies, statuses } from '../data/data'
import {
  projectFormSchema as formSchema,
  type Project,
  type ProjectFormData,
} from '../schemas'
import { type ProjectFormProps } from '../types'
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '../api/projects-api'

export function ProjectForm({
  initialData,
  mode = initialData ? 'edit' : 'create',
  onSuccess,
}: ProjectFormProps) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const createMutation = useCreateProjectMutation()
  const updateMutation = useUpdateProjectMutation()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          tagline: initialData.tagline,
          category: initialData.category,
          status: initialData.status,
          featured: initialData.featured,
          liveUrl: initialData.liveUrl ?? '',
          repoUrl: initialData.repoUrl ?? '',
          thumbnail: initialData.thumbnail ?? '',
          startDate: initialData.startDate,
          endDate: initialData.endDate,
          current: initialData.current,
          technologies: initialData.technologies.join(', '),
          description: initialData.description,
        }
      : {
          title: '',
          tagline: '',
          category: 'full-stack',
          status: 'active',
          featured: false,
          liveUrl: '',
          repoUrl: '',
          thumbnail: '',
          startDate: '',
          endDate: 'Present',
          current: true,
          technologies: '',
          description: '',
        },
  })

  const isCurrent = useWatch({
    control: form.control,
    name: 'current',
    defaultValue: initialData?.current ?? true,
  })

  const currentTech = useWatch({
    control: form.control,
    name: 'technologies',
    defaultValue: initialData?.technologies.join(', ') ?? '',
  })

  const handleAddTech = (tech: string) => {
    const existing = currentTech
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (!existing.includes(tech)) {
      const updated =
        existing.length > 0 ? `${existing.join(', ')}, ${tech}` : tech
      form.setValue('technologies', updated, { shouldValidate: true })
    }
  }

  const onSubmit = async (data: ProjectFormData) => {
    const payload = {
      title: data.title.trim(),
      tagline: data.tagline.trim(),
      category: data.category as Project['category'],
      status: data.status as Project['status'],
      featured: data.featured,
      liveUrl: data.liveUrl?.trim() || undefined,
      repoUrl: data.repoUrl?.trim() || undefined,
      thumbnail: data.thumbnail?.trim() || undefined,
      startDate: data.startDate.trim(),
      endDate: data.current ? 'Present' : data.endDate?.trim() || 'Present',
      current: data.current,
      technologies: data.technologies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description: data.description.trim(),
    }

    try {
      if (isEdit && initialData) {
        const updated = await updateMutation.mutateAsync({
          id: initialData.id,
          payload,
        })
        toast.success('Project updated successfully!')
        onSuccess?.(updated)
      } else {
        const created = await createMutation.mutateAsync(payload)
        toast.success('Project created successfully!')
        onSuccess?.(created)
      }
      navigate({ to: '/projects' })
    } catch {
      // Handled by query client
    }
  }

  return (
    <div className='flex w-full flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='icon' asChild>
            <Link to='/projects'>
              <ArrowLeft className='size-4' />
              <span className='sr-only'>Back to Projects</span>
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {isEdit ? 'Edit Project' : 'Add Project'}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {isEdit
                ? `Update portfolio details, tech stack, or deployment links for ${initialData?.title ?? 'this project'}.`
                : 'Showcase a new application, open source project, or library on your portfolio.'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' asChild>
            <Link to='/projects'>Cancel</Link>
          </Button>
          <Button type='submit' form='project-form' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-1.5 size-4 animate-spin' />
                Saving...
              </>
            ) : isEdit ? (
              <>
                <Save className='mr-1.5 size-4' />
                Save Changes
              </>
            ) : (
              <>
                <Plus className='mr-1.5 size-4' />
                Save Project
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className='w-full'>
        <Form {...form}>
          <form
            id='project-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-0'
          >
            <CardHeader className='border-b'>
              <div className='flex items-center gap-2'>
                <FolderGit2 className='size-5 text-primary' />
                <CardTitle>
                  {isEdit ? 'Edit Project Details' : 'Project Details'}
                </CardTitle>
              </div>
              <CardDescription>
                {isEdit
                  ? `Editing ${initialData?.title} (${initialData?.id})`
                  : 'Enter project title, category, links, and technical highlights.'}
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-8 p-6'>
              {/* Section 1: General Information */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Sparkles className='size-4 text-muted-foreground' />
                  General Information
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-2'>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g. DevPulse Analytics'
                            className='w-full'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-1'>
                        <FormLabel>Category</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select category' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((c) => {
                              const Icon = c.icon
                              return (
                                <SelectItem key={c.value} value={c.value}>
                                  <div className='flex items-center gap-2'>
                                    <Icon className='size-3.5 text-muted-foreground' />
                                    <span>{c.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-1'>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statuses.map((s) => {
                              const Icon = s.icon
                              return (
                                <SelectItem key={s.value} value={s.value}>
                                  <div className='flex items-center gap-2'>
                                    <Icon className='size-3.5 text-muted-foreground' />
                                    <span>{s.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='tagline'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-2 lg:col-span-3'>
                        <FormLabel>Tagline / Short Summary</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g. Real-time developer telemetry and engineering velocity platform'
                            className='w-full'
                          />
                        </FormControl>
                        <FormDescription>
                          A concise summary displayed on project preview cards.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='featured'
                    render={({ field }) => (
                      <FormItem className='mt-2 flex flex-row items-center gap-2 space-y-0 self-start rounded-lg border bg-muted/20 p-3.5 sm:col-span-2 sm:mt-0 lg:col-span-1'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(!!checked)
                            }
                          />
                        </FormControl>
                        <div className='leading-none'>
                          <FormLabel className='flex cursor-pointer items-center gap-1.5 text-sm font-medium'>
                            <Star className='size-3.5 fill-amber-500 text-amber-500' />
                            Featured Project
                          </FormLabel>
                          <p className='mt-1 text-xs text-muted-foreground'>
                            Highlight on portfolio home
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Links & Media */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Globe className='size-4 text-muted-foreground' />
                  Links & Deployment
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='liveUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Live Demo URL (Optional)</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <ExternalLink className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                            <Input
                              {...field}
                              placeholder='https://your-demo.com'
                              className='w-full pl-9'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='repoUrl'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub / Repository (Optional)</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <IconGithub className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                            <Input
                              {...field}
                              placeholder='https://github.com/org/repo'
                              className='w-full pl-9'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='thumbnail'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL (Optional)</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <ImageIcon className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                            <Input
                              {...field}
                              placeholder='https://example.com/cover.jpg'
                              className='w-full pl-9'
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 3: Timeline */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Calendar className='size-4 text-muted-foreground' />
                  Timeline
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='startDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Calendar className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                            <Input
                              {...field}
                              placeholder='e.g. Jan 2024'
                              className='w-full pl-9'
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Month & Year (e.g. Jan 2024)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='endDate'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Calendar className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                            <Input
                              {...field}
                              disabled={isCurrent}
                              placeholder={
                                isCurrent ? 'Present' : 'e.g. Mar 2024'
                              }
                              className='w-full pl-9 disabled:bg-muted disabled:text-muted-foreground'
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {isCurrent
                            ? 'Locked to Present for ongoing projects.'
                            : 'Month & Year (e.g. Mar 2024)'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='current'
                    render={({ field }) => (
                      <FormItem className='mt-2 flex flex-row items-center gap-2 space-y-0 self-start rounded-lg border bg-muted/20 p-4 sm:mt-0'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(!!checked)
                              if (checked) {
                                form.setValue('endDate', 'Present', {
                                  shouldValidate: true,
                                })
                              } else if (
                                form.getValues('endDate') === 'Present'
                              ) {
                                form.setValue('endDate', '', {
                                  shouldValidate: true,
                                })
                              }
                            }}
                          />
                        </FormControl>
                        <div className='leading-none'>
                          <FormLabel className='cursor-pointer text-sm font-medium'>
                            Ongoing project
                          </FormLabel>
                          <p className='mt-1 text-xs text-muted-foreground'>
                            Automatically marks end date as &quot;Present&quot;
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 4: Tech Stack & Tools */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Wrench className='size-4 text-muted-foreground' />
                  Tech Stack & Tools
                </h3>

                <FormField
                  control={form.control}
                  name='technologies'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies & Libraries</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g. Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Redis'
                          className='w-full'
                        />
                      </FormControl>
                      <FormDescription>
                        Separate tools with commas. Click suggestions below to
                        append.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-wrap items-center gap-1.5 pt-1'>
                  <span className='mr-1 text-xs font-medium text-muted-foreground'>
                    Suggestions:
                  </span>
                  {commonTechnologies.map((tech) => (
                    <Badge
                      key={tech}
                      variant='outline'
                      role='button'
                      className='cursor-pointer text-xs transition-colors select-none hover:bg-primary hover:text-primary-foreground'
                      onClick={() => handleAddTech(tech)}
                    >
                      + {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Section 5: Description & Highlights */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Sparkles className='size-4 text-muted-foreground' />
                  Project Overview & Highlights
                </h3>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Highlights & Architecture</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='min-h-[160px] w-full resize-y font-normal'
                          placeholder={`• Architected real-time WebSocket communication layer handling 5,000+ concurrent connections.
• Reduced bundle size by 35% through modular code-splitting and dynamic imports.
• Implemented automated CI/CD deployment pipelines with GitHub Actions.`}
                        />
                      </FormControl>
                      <FormDescription>
                        Highlight problem solved, technical achievements, and
                        performance metrics.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className='flex flex-wrap items-center justify-between gap-3 border-t bg-muted/10 p-6'>
              <Button variant='outline' asChild>
                <Link to='/projects'>Cancel</Link>
              </Button>
              <div className='flex items-center gap-2'>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-1.5 size-4 animate-spin' />
                      Saving...
                    </>
                  ) : isEdit ? (
                    <>
                      <Save className='mr-1.5 size-4' />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className='mr-1.5 size-4' />
                      Save Project
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
