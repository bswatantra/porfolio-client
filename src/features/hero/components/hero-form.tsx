import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
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
  heroFormSchema as formSchema,
  type Hero,
  type HeroFormData,
} from '../schemas'
import {
  useCreateHeroMutation,
  useUpdateHeroMutation,
} from '../api/hero-api'

export function HeroForm({ hero }: { hero?: Hero }) {
  const navigate = useNavigate()
  const createMutation = useCreateHeroMutation()
  const updateMutation = useUpdateHeroMutation()

  const defaultValues: HeroFormData = {
    name: hero?.name ?? '',
    title: hero?.title ?? '',
    roles: hero?.roles ? hero.roles.join(', ') : '',
    tagline: hero?.tagline ?? '',
    specializations: hero?.specializations ? hero.specializations.join(', ') : '',
    terminalChips: hero?.terminalChips ? hero.terminalChips.join(', ') : '',
    location: hero?.location ?? '',
    email: hero?.email ?? '',
    github: hero?.github ?? '',
    linkedin: hero?.linkedin ?? '',
    availableForWork: hero?.availableForWork ?? true,
    isActive: hero?.isActive ?? true,
  }

  const form = useForm<HeroFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (values: HeroFormData) => {
    const payload = {
      name: values.name.trim(),
      title: values.title.trim(),
      roles: values.roles
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
      tagline: values.tagline.trim(),
      specializations: values.specializations
        ? values.specializations
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      terminalChips: values.terminalChips
        ? values.terminalChips
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean)
        : [],
      location: values.location.trim(),
      email: values.email.trim(),
      github: values.github.trim(),
      linkedin: values.linkedin.trim(),
      availableForWork: values.availableForWork,
      isActive: values.isActive,
    }

    try {
      if (hero?.id) {
        await updateMutation.mutateAsync({ id: hero.id, payload })
        toast.success(`Hero section "${values.name}" updated successfully.`)
      } else {
        await createMutation.mutateAsync(payload)
        toast.success(`Hero section "${values.name}" created successfully.`)
      }
      navigate({ to: '/hero' })
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
              {hero ? 'Edit Hero Section' : 'Create Hero Section'}
            </CardTitle>
            <CardDescription>
              Configure how your introduction, headlines, typewriter roles, and specializations appear on the landing page.
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' asChild className='gap-1.5'>
            <Link to='/hero'>
              <ArrowLeft className='size-4' />
              <span>Back</span>
            </Link>
          </Button>
        </div>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name / Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Swatantra' {...field} />
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
                    <FormLabel>Professional Title</FormLabel>
                    <FormControl>
                      <Input placeholder='AI Engineer & Full Stack Developer' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='roles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Typewriter Animated Roles (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='AI / ML Engineer, Full Stack Developer, Open Source Contributor'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    These rotate with a dynamic typing animation right below your name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='tagline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Tagline / Narrative Pitch</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder='I craft intelligent systems and production-grade web applications...'
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
                name='specializations'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specializations (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder='LLMs & RAG, Full Stack SaaS, DevOps & Cloud' {...field} />
                    </FormControl>
                    <FormDescription>Displayed as highlight pills with sparkle icons.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='terminalChips'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Terminal Chips (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder='python train.py --model llama, bun dev, kubectl apply -f deploy.yaml' {...field} />
                    </FormControl>
                    <FormDescription>Code commands styled as interactive terminal chips.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-3'>
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder='San Francisco, CA (or Remote)' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='alex@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='github'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://github.com/username' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='linkedin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URL</FormLabel>
                  <FormControl>
                    <Input placeholder='https://linkedin.com/in/username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex flex-wrap gap-8 pt-2'>
              <FormField
                control={form.control}
                name='availableForWork'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-2 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-sm font-medium'>Available for Work</FormLabel>
                      <FormDescription className='text-xs'>
                        Displays the pulsing green &apos;Open to new opportunities&apos; badge.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-2 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-sm font-medium'>Publish as Active</FormLabel>
                      <FormDescription className='text-xs'>
                        Mark this configuration to be served on the public landing page.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>

          <CardFooter className='flex justify-end gap-3 border-t pt-4'>
            <Button variant='outline' asChild>
              <Link to='/hero'>Cancel</Link>
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
                  <span>{hero ? 'Update Hero' : 'Create Hero'}</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

