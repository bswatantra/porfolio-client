import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Star,
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
import {
  categories,
  commonSkillsPresets,
  proficiencies,
  statuses,
} from '../data/data'
import {
  skillFormSchema as formSchema,
  type Skill,
  type SkillFormData,
} from '../schemas'
import { type SkillFormProps } from '../types'
import {
  useCreateSkillMutation,
  useUpdateSkillMutation,
} from '../api/skills-api'

export function SkillForm({
  initialData,
  mode = initialData ? 'edit' : 'create',
  onSuccess,
}: SkillFormProps) {
  const navigate = useNavigate()
  const isEdit = mode === 'edit'
  const createMutation = useCreateSkillMutation()
  const updateMutation = useUpdateSkillMutation()
  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const form = useForm<SkillFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          proficiency: initialData.proficiency,
          yearsOfExperience: initialData.yearsOfExperience,
          featured: initialData.featured,
          status: initialData.status,
          description: initialData.description,
        }
      : {
          name: '',
          category: 'frontend',
          proficiency: 'advanced',
          yearsOfExperience: 3,
          featured: false,
          status: 'active',
          description: '',
        },
  })

  const onSubmit = async (data: SkillFormData) => {
    const payload = {
      name: data.name.trim(),
      category: data.category as Skill['category'],
      proficiency: data.proficiency as Skill['proficiency'],
      yearsOfExperience: data.yearsOfExperience,
      featured: data.featured,
      status: data.status as Skill['status'],
      description: data.description.trim(),
    }

    try {
      if (isEdit && initialData) {
        const updated = await updateMutation.mutateAsync({
          id: initialData.id,
          payload,
        })
        toast.success('Skill updated successfully!')
        onSuccess?.(updated)
      } else {
        const created = await createMutation.mutateAsync(payload)
        toast.success('Skill added successfully!')
        onSuccess?.(created)
      }
      navigate({ to: '/skills' })
    } catch {
      // Handled by query client
    }
  }

  return (
    <div className='flex w-full flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Button variant='outline' size='icon' asChild>
            <Link to='/skills'>
              <ArrowLeft className='size-4' />
              <span className='sr-only'>Back to Skills</span>
            </Link>
          </Button>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {isEdit ? 'Edit Skill' : 'Add Skill'}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {isEdit
                ? `Update proficiency, years of experience, or category for ${initialData?.name ?? 'this skill'}.`
                : 'Add a new technology, framework, language, or tool to your portfolio profile.'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' asChild>
            <Link to='/skills'>Cancel</Link>
          </Button>
          <Button type='submit' form='skill-form' disabled={isSubmitting}>
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
                Save Skill
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className='w-full'>
        <Form {...form}>
          <form
            id='skill-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-0'
          >
            <CardHeader className='border-b'>
              <div className='flex items-center gap-2'>
                <Sparkles className='size-5 text-primary' />
                <CardTitle>
                  {isEdit ? 'Edit Skill Details' : 'Skill Details'}
                </CardTitle>
              </div>
              <CardDescription>
                {isEdit
                  ? `Editing ${initialData?.name} (${initialData?.id})`
                  : 'Define skill name, category, proficiency level, and experience notes.'}
              </CardDescription>
            </CardHeader>

            <CardContent className='space-y-8 p-6'>
              {/* Section 1: Core Information */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <Wrench className='size-4 text-muted-foreground' />
                  General Information
                </h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-2'>
                        <FormLabel>Skill / Technology Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder='e.g. TypeScript, React, Docker, PostgreSQL'
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
                        <FormLabel>Domain / Category</FormLabel>
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
                    name='proficiency'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-1'>
                        <FormLabel>Proficiency Level</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Select level' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {proficiencies.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                <div className='flex items-center justify-between gap-4'>
                                  <span>{p.label}</span>
                                  <span className='text-xs text-muted-foreground'>
                                    {p.percentage}%
                                  </span>
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
                    name='yearsOfExperience'
                    render={({ field }) => (
                      <FormItem className='sm:col-span-1'>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            min={0}
                            max={50}
                            step={1}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ''
                                  ? 0
                                  : Number(e.target.value)
                              )
                            }
                            className='w-full'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='featured'
                    render={({ field }) => (
                      <FormItem className='mt-2 flex flex-row items-center gap-2 space-y-0 self-start rounded-lg border bg-muted/20 p-3.5 sm:col-span-2 sm:mt-0'>
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
                            Featured Skill
                          </FormLabel>
                          <p className='mt-1 text-xs text-muted-foreground'>
                            Highlight in hero / summary section on portfolio
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quick Presets */}
                <div className='pt-2'>
                  <div className='flex flex-wrap items-center gap-1.5'>
                    <span className='mr-1 text-xs font-medium text-muted-foreground'>
                      Quick presets:
                    </span>
                    {commonSkillsPresets.map((preset) => (
                      <Badge
                        key={preset}
                        variant='outline'
                        role='button'
                        className='cursor-pointer text-xs transition-colors select-none hover:bg-primary hover:text-primary-foreground'
                        onClick={() =>
                          form.setValue('name', preset, {
                            shouldValidate: true,
                          })
                        }
                      >
                        + {preset}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Notes & Context */}
              <div className='space-y-4'>
                <h3 className='flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground uppercase'>
                  <BookOpen className='size-4 text-muted-foreground' />
                  Experience Notes & Context
                </h3>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Usage Context</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='min-h-[140px] w-full resize-y font-normal'
                          placeholder='e.g. Primary language for full-stack and frontend development across client and production platforms. Extensive experience with strict typing, generics, and AST tooling.'
                        />
                      </FormControl>
                      <FormDescription>
                        Explain where you apply this skill, key libraries, and
                        your practical experience.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className='flex flex-wrap items-center justify-between gap-3 border-t bg-muted/10 p-6'>
              <Button variant='outline' asChild>
                <Link to='/skills'>Cancel</Link>
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
                      Save Skill
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
