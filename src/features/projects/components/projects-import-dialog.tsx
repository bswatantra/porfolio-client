import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  projectImportDialogSchema as formSchema,
  type ProjectImportDialogValues,
} from '../schemas'
import { type ProjectsImportDialogProps } from '../types'

export function ProjectsImportDialog({
  open,
  onOpenChange,
}: ProjectsImportDialogProps) {
  const form = useForm<ProjectImportDialogValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { file: undefined },
  })

  const fileRef = form.register('file')

  const onSubmit = () => {
    const file = form.getValues('file')

    if (file && file[0]) {
      const fileDetails = {
        name: file[0].name,
        size: file[0].size,
        type: file[0].type,
      }
      showSubmittedData(
        fileDetails,
        'You have imported the following projects file:'
      )
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='text-start'>
          <DialogTitle>Import Projects</DialogTitle>
          <DialogDescription>
            Import your portfolio projects from a CSV or JSON file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='projects-import-form'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='file'
              render={() => (
                <FormItem className='my-2'>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type='file'
                      accept='.csv, .json'
                      {...fileRef}
                      className='h-auto py-1.5'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button type='submit' form='projects-import-form'>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
