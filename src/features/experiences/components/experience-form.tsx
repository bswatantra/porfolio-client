import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileEdit,
  Globe,
  GraduationCap,
  Loader2,
  MapPin,
  Plus,
  Save,
  Sparkles,
  Wrench,
} from 'lucide-react'
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
import { commonSkills, employmentTypes, statuses } from '../data/data'
import {
  experienceFormSchema as formSchema,
  type Experience,
  type ExperienceFormData,
} from '../schemas'
import { type ExperienceFormProps } from '../types'
import {
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
} from '../api/experiences-api'

export function ExperienceForm({
  initialData,
  mode = initialData ? 'edit' : 'create',
  onSuccess,
}: ExperienceFormProps) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const createMutation = useCreateExperienceMutation()
  const updateMutation = useUpdateExperienceMutation()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          role: initialData.role,
          company: initialData.company,
          employmentType: initialData.employmentType,
          location: initialData.location,
          startDate: initialData.startDate,
          endDate: initialData.endDate,
          current: initialData.current,
          skills: initialData.skills.join(', '),
          description: initialData.description,
          status: initialData.status,
        }
      : {
          role: '',
          company: '',
          employmentType: 'full-time',
          location: '',
          startDate: '',
          endDate: 'Present',
          current: true,
          skills: '',
          description: '',
          status: 'active',
        },
  })

  const isCurrent = useWatch({
    control: form.control,
    name: 'current',
    defaultValue: initialData?.current ?? true,
  })

  const currentSkills = useWatch({
    control: form.control,
    name: 'skills',
    defaultValue: initialData?.skills.join(', ') ?? '',
  })

  const handleAddSkill = (skill: string) => {
    const existing = currentSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    if (!existing.includes(skill)) {
      const updated =
        existing.length > 0 ? `${existing.join(', ')}, ${skill}` : skill
      form.setValue('skills', updated, { shouldValidate: true })
    }
  }

  const onSubmit = async (data: ExperienceFormData) => {
    const payload = {
      role: data.role.trim(),
      company: data.company.trim(),
      employmentType: data.employmentType as Experience['employmentType'],
      location: data.location.trim(),
      startDate: data.startDate.trim(),
      endDate: data.current ? 'Present' : data.endDate?.trim() || 'Present',
      current: data.current,
      skills: data.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description: data.description.trim(),
      status: data.status as Experience['status'],
    }

    try {
      if (isEdit && initialData) {
        const updated = await updateMutation.mutateAsync({
          id: initialData.id,
          payload,
        })
        toast.success('Experience updated successfully!')
        onSuccess?.(updated)
      } else {
        const created = await createMutation.mutateAsync(payload)
        toast.success('Experience created successfully!')
        onSuccess?.(created)
      }
      navigate({ to: '/experiences' })
    } catch {
      // Handled by global/in-form error handlers
    }
  }

  return (
    <div className='flex w-full flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='icon' asChild>
            <Link to='/experiences'>
              <ArrowLeft className='size-4' />
              <span className='sr-only'>Back to Experiences</span>
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {isEdit ? 'Edit Experience' : 'Add Experience'}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {isEdit
                ? `Update details, duration, or tech stack for ${initialData?.role ?? 'this role'}.`
                : 'Add a new position, job milestone, or project role to your portfolio.'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' asChild>
            <Link to='/experiences'>Cancel</Link>
          </Button>
          <Button type='submit' form='experience-form' disabled={isSubmitting}>
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
                Save Experience
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className='w-full'>
        <Form {...form}>
          <form
            id='experience-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-0'
          >
            <CardHeader className='border-b'>
              <div className='flex items-center gap-2'>
                <Briefcase className='size-5 text-primary' />
                <CardTitle>
                  {isEdit ? 'Edit Experience Details' : 'Experience Details'}
                </CardTitle>
              </div>
              <CardDescription>
                {isEdit
                  ? `Editing ${initialData?.role} at ${initialData?.company} (${initialData?.id})`
                  : 'Enter role details, company information, dates, and tech stack.'}
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-8 p-6'>
              {/* Section 1: General Information */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Building2 className='size-4 text-muted-foreground' />
                  General Information
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-2'>
                        <FormLabel>Role / Job Title</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g. Lead Frontend Architect'
                            className='w-full'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='company'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-2'>
                        <FormLabel>Company / Organization</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g. Vercel, Stripe, Acme Inc.'
                            className='w-full'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='employmentType'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-2'>
                        <FormLabel>Employment Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select employment type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employmentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className='flex items-center gap-2'>
                                  {type.value === 'full-time' && (
                                    <Briefcase className='size-3.5 text-muted-foreground' />
                                  )}
                                  {type.value === 'part-time' && (
                                    <Clock className='size-3.5 text-muted-foreground' />
                                  )}
                                  {type.value === 'contract' && (
                                    <FileEdit className='size-3.5 text-muted-foreground' />
                                  )}
                                  {type.value === 'freelance' && (
                                    <Sparkles className='size-3.5 text-muted-foreground' />
                                  )}
                                  {type.value === 'internship' && (
                                    <GraduationCap className='size-3.5 text-muted-foreground' />
                                  )}
                                  <span>{type.label}</span>
                                </div>
                              </SelectItem>
                            ))}
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
                      <FormItem className='sm:col-span-2'>
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
                            {statuses.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                <div className='flex items-center gap-2'>
                                  {s.value === 'active' && (
                                    <CheckCircle2 className='size-3.5 text-emerald-500' />
                                  )}
                                  {s.value === 'completed' && (
                                    <Clock className='size-3.5 text-blue-500' />
                                  )}
                                  {s.value === 'draft' && (
                                    <FileEdit className='size-3.5 text-amber-500' />
                                  )}
                                  <span>{s.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Location & Timeline */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Globe className='size-4 text-muted-foreground' />
                  Location & Timeline
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-2 lg:col-span-3'>
                        <FormLabel>Location / Work Arrangement</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <MapPin className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                            <Input
                              {...field}
                              placeholder='e.g. San Francisco, CA · Hybrid, or Remote (Worldwide)'
                              className='w-full pl-9'
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Specify location and arrangement (Remote, Hybrid,
                          On-site).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                              placeholder='e.g. Jan 2022'
                              className='w-full pl-9'
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Month & Year or Year (e.g. Jan 2022)
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
                                isCurrent ? 'Present' : 'e.g. Dec 2024'
                              }
                              className='w-full pl-9 disabled:bg-muted disabled:text-muted-foreground'
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {isCurrent
                            ? 'Locked to Present while working here.'
                            : 'Month & Year (e.g. Dec 2024)'}
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
                            I currently work here
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

              {/* Section 3: Skills & Technologies */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Wrench className='size-4 text-muted-foreground' />
                  Skills & Tech Stack
                </h3>

                <FormField
                  control={form.control}
                  name='skills'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies & Skills</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='e.g. React, TypeScript, Next.js, Tailwind CSS, PostgreSQL'
                          className='w-full'
                        />
                      </FormControl>
                      <FormDescription>
                        Separate items with commas. Click quick tags below to
                        append.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quick-add skills suggestion chips */}
                <div className='flex flex-wrap items-center gap-1.5 pt-1'>
                  <span className='mr-1 text-xs font-medium text-muted-foreground'>
                    Suggestions:
                  </span>
                  {commonSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant='outline'
                      role='button'
                      className='cursor-pointer text-xs transition-colors select-none hover:bg-primary hover:text-primary-foreground'
                      onClick={() => handleAddSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Section 4: Description & Responsibilities */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <FileEdit className='size-4 text-muted-foreground' />
                  Description & Highlights
                </h3>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Key Responsibilities & Accomplishments
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='min-h-[160px] w-full resize-y font-normal'
                          placeholder={`• Led engineering team of 6 engineers across 3 time zones...
• Architected real-time notification service handling 10k req/sec...
• Redesigned developer docs, decreasing onboarding time by 40%...`}
                        />
                      </FormControl>
                      <FormDescription>
                        Detail your impact, leadership responsibilities, and
                        quantified achievements.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className='flex flex-wrap items-center justify-between gap-3 border-t bg-muted/10 p-6'>
              <Button variant='outline' asChild>
                <Link to='/experiences'>Cancel</Link>
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
                      Save Experience
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
