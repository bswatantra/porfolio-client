import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Database, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'
import {
  aboutFormSchema as formSchema,
  type About,
  type AboutFormData,
} from '../schemas'
import {
  useCreateAboutMutation,
  useUpdateAboutMutation,
} from '../api/about-api'

export function AboutForm({ about }: { about?: About }) {
  const navigate = useNavigate()
  const createMutation = useCreateAboutMutation()
  const updateMutation = useUpdateAboutMutation()

  const defaultValues: AboutFormData = {
    eyebrow: about?.eyebrow ?? 'About me',
    title: about?.title ?? 'Building the future, one model at a time',
    description: about?.description ?? '',
    yearsOfExperience: about?.yearsOfExperience ?? '6+',
    openSourceStars: about?.openSourceStars ?? '2.1k',
    email: about?.email ?? '',
    github: about?.github ?? '',
    isActive: about?.isActive ?? true,
  }

  const form = useForm<AboutFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (values: AboutFormData) => {
    const payload = {
      eyebrow: values.eyebrow.trim(),
      title: values.title.trim(),
      description: values.description.trim(),
      yearsOfExperience: values.yearsOfExperience.trim(),
      openSourceStars: values.openSourceStars.trim(),
      email: values.email?.trim() || undefined,
      github: values.github?.trim() || undefined,
      isActive: values.isActive,
    }

    try {
      if (about?.id) {
        await updateMutation.mutateAsync({ id: about.id, payload })
        toast.success(`About section "${values.title}" updated successfully.`)
      } else {
        await createMutation.mutateAsync(payload)
        toast.success(`About section "${values.title}" created successfully.`)
      }
      navigate({ to: '/about' })
    } catch {
      // Handled by query client
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Card className='max-w-3xl shadow-sm'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-xl'>
              {about ? 'Edit About Me Section' : 'Create About Me Section'}
            </CardTitle>
            <CardDescription>
              Manage your personal narrative bio and highlighted stats.
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' asChild className='gap-1.5'>
            <Link to='/about'>
              <ArrowLeft className='size-4' />
              <span>Back</span>
            </Link>
          </Button>
        </div>

        {/* Live Dynamic Database Counts Highlight */}
        <div className='mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs'>
          <Database className='size-4 text-primary shrink-0' />
          <span className='font-medium text-foreground'>Live MongoDB Aggregation:</span>
          <Badge variant='secondary' className='text-xs'>
            {about?.projectsCount ?? 0} Projects Shipped
          </Badge>
          <Badge variant='secondary' className='text-xs'>
            {about?.skillsCount ?? 0} Skills Mastered
          </Badge>
          <span className='text-muted-foreground ml-auto hidden sm:inline text-[11px]'>
            (Dynamically calculated from Projects and Skills collections)
          </span>
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='eyebrow'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eyebrow Label</FormLabel>
                    <FormControl>
                      <Input placeholder='About me' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Headline</FormLabel>
                    <FormControl>
                      <Input placeholder='Building the future, one model at a time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Narrative Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="I'm a software engineer with 6+ years of experience building at the intersection of AI and full-stack web development..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='yearsOfExperience'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience Stat</FormLabel>
                    <FormControl>
                      <Input placeholder='6+' {...field} />
                    </FormControl>
                    <FormDescription>Displayed on the stats card.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='openSourceStars'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Open Source Stars / Metric Stat</FormLabel>
                    <FormControl>
                      <Input placeholder='2.1k' {...field} />
                    </FormControl>
                    <FormDescription>Displayed on the stats card.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='alex@example.com' {...field} />
                    </FormControl>
                    <FormDescription>Used for the &apos;Let&apos;s work together&apos; button.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='github'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder='https://github.com/username' {...field} />
                    </FormControl>
                    <FormDescription>Used for the &apos;View GitHub&apos; button.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex items-center space-x-2 space-y-0 pt-2'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-sm font-medium'>Publish as Active</FormLabel>
                    <FormDescription className='text-xs'>
                      Serve this narrative on the public portfolio landing page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className='flex justify-end gap-3 border-t pt-4'>
            <Button variant='outline' asChild>
              <Link to='/about'>Cancel</Link>
            </Button>
            <Button type='submit' disabled={isPending} className='gap-2'>
              {isPending ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className='size-4' />
                  <span>{about ? 'Update About' : 'Create About'}</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

