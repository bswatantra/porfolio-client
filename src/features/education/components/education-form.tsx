import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  GraduationCap,
  Loader2,
  MapPin,
  Save,
  School,
  Sparkles,
  Trophy,
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
import {
  commonFieldsOfStudy,
  commonInstitutionsPresets,
  degrees,
  statuses,
} from '../data/data'
import { toast } from 'sonner'
import {
  educationFormSchema as formSchema,
  type Education,
  type EducationFormData,
} from '../schemas'
import { type EducationFormProps } from '../types'
import {
  useCreateEducationMutation,
  useUpdateEducationMutation,
} from '../api/education-api'

export function EducationForm({
  initialData,
  mode = initialData ? 'edit' : 'create',
  onSuccess,
}: EducationFormProps) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const createMutation = useCreateEducationMutation()
  const updateMutation = useUpdateEducationMutation()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const form = useForm<EducationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          institution: initialData.institution,
          degree: initialData.degree,
          fieldOfStudy: initialData.fieldOfStudy,
          startDate: initialData.startDate,
          endDate: initialData.endDate,
          current: initialData.current,
          grade: initialData.grade ?? '',
          location: initialData.location,
          activities: initialData.activities ?? '',
          description: initialData.description,
          status: initialData.status,
        }
      : {
          institution: '',
          degree: 'bachelor',
          fieldOfStudy: '',
          startDate: '',
          endDate: 'Present',
          current: false,
          grade: '',
          location: '',
          activities: '',
          description: '',
          status: 'completed',
        },
  })

  const isCurrent = useWatch({
    control: form.control,
    name: 'current',
    defaultValue: initialData?.current ?? false,
  })

  const onSubmit = async (data: EducationFormData) => {
    const payload = {
      institution: data.institution.trim(),
      degree: data.degree as Education['degree'],
      fieldOfStudy: data.fieldOfStudy.trim(),
      startDate: data.startDate.trim(),
      endDate: data.current ? 'Present' : data.endDate.trim(),
      current: data.current,
      grade: data.grade?.trim() || undefined,
      location: data.location.trim(),
      activities: data.activities?.trim() || undefined,
      description: data.description.trim(),
      status: data.status as Education['status'],
    }

    try {
      if (isEdit && initialData) {
        const updated = await updateMutation.mutateAsync({
          id: initialData.id,
          payload,
        })
        toast.success('Education record updated successfully!')
        onSuccess?.(updated)
      } else {
        const created = await createMutation.mutateAsync(payload)
        toast.success('Education record created successfully!')
        onSuccess?.(created)
      }
      navigate({ to: '/education' })
    } catch {
      // Handled by query client
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Top Action Bar */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => navigate({ to: '/education' })}
          >
            <ArrowLeft className='mr-1.5 size-4' /> Back to Education
          </Button>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={() => navigate({ to: '/education' })}
            >
              Cancel
            </Button>
            <Button type='submit' size='sm' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-1.5 size-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='mr-1.5 size-4' />{' '}
                  {isEdit ? 'Update Education' : 'Save Education'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Form Card */}
        <Card className='border shadow-sm'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2.5'>
              <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                <GraduationCap className='size-5' />
              </div>
              <div>
                <CardTitle className='text-lg'>
                  {isEdit ? 'Edit Education Record' : 'Add New Education'}
                </CardTitle>
                <CardDescription>
                  {isEdit
                    ? 'Update the academic credentials, program details, and achievements for this record.'
                    : 'Add a university degree, certification, bootcamp, or academic course to your portfolio.'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className='space-y-6 pt-2'>
            {/* Quick Fill Presets */}
            {!isEdit && (
              <div className='rounded-lg border border-dashed bg-muted/30 p-3.5'>
                <div className='mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground'>
                  <Sparkles className='size-3.5 text-primary' />
                  <span>Quick Suggestion Presets:</span>
                </div>
                <div className='space-y-2'>
                  <div className='flex flex-wrap items-center gap-1.5'>
                    <span className='mr-1 text-[11px] text-muted-foreground'>
                      Institutions:
                    </span>
                    {commonInstitutionsPresets.slice(0, 5).map((inst) => (
                      <Badge
                        key={inst}
                        variant='secondary'
                        className='cursor-pointer text-xs transition-colors hover:bg-primary hover:text-primary-foreground'
                        onClick={() => form.setValue('institution', inst)}
                      >
                        {inst}
                      </Badge>
                    ))}
                  </div>
                  <div className='flex flex-wrap items-center gap-1.5'>
                    <span className='mr-1 text-[11px] text-muted-foreground'>
                      Fields:
                    </span>
                    {commonFieldsOfStudy.slice(0, 5).map((field) => (
                      <Badge
                        key={field}
                        variant='secondary'
                        className='cursor-pointer text-xs transition-colors hover:bg-primary hover:text-primary-foreground'
                        onClick={() => form.setValue('fieldOfStudy', field)}
                      >
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 1: Institution & Degree */}
            <div className='space-y-4'>
              <div className='border-b pb-1.5'>
                <h3 className='text-sm font-semibold tracking-wide text-foreground'>
                  Institution & Degree
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Specify the academic institution, degree level, and field of
                  study.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='institution'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution / University / Academy</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <School className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                          <Input
                            placeholder='e.g., Stanford University'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='degree'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Level / Qualification</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select degree' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {degrees.map((deg) => (
                            <SelectItem key={deg.value} value={deg.value}>
                              {deg.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='fieldOfStudy'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study / Major</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <BookOpen className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                          <Input
                            placeholder='e.g., Computer Science & Engineering'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='location'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location / Campus</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <MapPin className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                          <Input
                            placeholder='e.g., Stanford, CA or Remote / Online'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 2: Timeline & Status */}
            <div className='space-y-4'>
              <div className='border-b pb-1.5'>
                <h3 className='text-sm font-semibold tracking-wide text-foreground'>
                  Timeline & Status
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Set the duration of study and your current enrollment status.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
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
                            placeholder='e.g., Sep 2019'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
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
                            placeholder={
                              isCurrent ? 'Present' : 'e.g., Jun 2023'
                            }
                            disabled={isCurrent}
                            className='pl-9'
                            {...field}
                            value={isCurrent ? 'Present' : field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((stat) => (
                            <SelectItem key={stat.value} value={stat.value}>
                              {stat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='current'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border bg-muted/20 p-3.5'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          if (checked) {
                            form.setValue('endDate', 'Present')
                            form.setValue('status', 'in-progress')
                          }
                        }}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='cursor-pointer font-medium'>
                        Currently studying / enrolled in this program
                      </FormLabel>
                      <FormDescription>
                        Selecting this marks the end date as &quot;Present&quot;
                        and sets the status to &quot;In Progress&quot;.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Section 3: Academic Record & Extracurriculars */}
            <div className='space-y-4'>
              <div className='border-b pb-1.5'>
                <h3 className='text-sm font-semibold tracking-wide text-foreground'>
                  Academic Record & Extracurriculars
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Highlight grades, honors, GPA, societies, and clubs.
                </p>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='grade'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Grade / GPA / Classification (Optional)
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Trophy className='absolute top-2.5 left-3 size-4 text-muted-foreground' />
                          <Input
                            placeholder='e.g., 3.92 / 4.0 GPA or First Class Honours'
                            className='pl-9'
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Include honors, ranking, or overall score if applicable.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='activities'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activities & Societies (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='e.g., ACM Student Chapter, Robotics Club, Peer Tutor'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Clubs, teams, leadership roles, or volunteer work.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 4: Description & Coursework */}
            <div className='space-y-4'>
              <div className='border-b pb-1.5'>
                <h3 className='text-sm font-semibold tracking-wide text-foreground'>
                  Relevant Coursework, Thesis & Achievements
                </h3>
                <p className='text-xs text-muted-foreground'>
                  Detail your core subjects, capstone projects, research, or
                  thesis topics.
                </p>
              </div>

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description & Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='- Key Coursework: Algorithms, Distributed Systems, Computer Vision...&#10;- Thesis: Real-Time Inference with WebAssembly on Edge Devices&#10;- Awards: Dean&#39;s List for 6 Semesters, CalHacks 1st Place'
                        className='min-h-[140px] resize-y'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Markdown bullet points and paragraphs are recommended.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className='flex items-center justify-between border-t bg-muted/20 px-6 py-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate({ to: '/education' })}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-1.5 size-4 animate-spin' />
                  Saving...
                </>
              ) : (
                <>
                  <Save className='mr-1.5 size-4' />{' '}
                  {isEdit ? 'Update Education' : 'Save Education'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
