import { cn } from '@/lib/utils'
import { type MainProps } from './types'

export function Main({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        'px-4 py-6',

        // If layout is fixed, make the main container flex and grow
        fixed && 'flex grow flex-col overflow-hidden',

        // If layout is not fluid, keep full width without centering mx-auto
        !fluid && 'w-full',
        className
      )}
      {...props}
    />
  )
}
