import { useState } from 'react'
import { Check, Copy, Share2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useClapBlogMutation } from '../api/blogs-api'
import type { Blog } from '../types'

interface SocialShareProps {
  blog: Blog
  className?: string
  showClaps?: boolean
}

// Custom brand SVG icons
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={cn('fill-current', className)}
    >
      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={cn('fill-current', className)}
    >
      <path d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z' />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={cn('fill-current', className)}
    >
      <path d='M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.09-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.6c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.19-.47-.32' />
    </svg>
  )
}

export function SocialShare({ blog, className, showClaps = true }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const [clapsCount, setClapsCount] = useState<number>(blog.claps || 0)
  const [isClapping, setIsClapping] = useState(false)
  const clapMutation = useClapBlogMutation()

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://swatantrachaudhary.com.np/blogs/${blog.slug}`

  const shareText = `Check out "${blog.title}" by ${blog.author?.name || 'Swatantra Chaudhary'}`

  const shareLinks = {
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`,
  }

  const handleCopy = async () => {
    if (typeof window !== 'undefined') {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClap = () => {
    setIsClapping(true)
    setClapsCount((prev) => prev + 1)
    clapMutation.mutate(blog.slug || blog.id, {
      onSuccess: (data) => {
        if (data.claps) {
          setClapsCount(data.claps)
        }
      },
    })
    setTimeout(() => setIsClapping(false), 600)
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-4 py-4',
          className
        )}
      >
        {/* Left: Interactive Claps / Likes */}
        {showClaps && (
          <div className='flex items-center gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClap}
                  className={cn(
                    'group relative gap-2 rounded-full border-primary/20 bg-primary/5 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300',
                    isClapping && 'scale-110 border-primary text-primary'
                  )}
                >
                  <Sparkles
                    className={cn(
                      'h-4 w-4 text-primary transition-transform group-hover:rotate-12',
                      isClapping && 'animate-spin'
                    )}
                  />
                  <span className='font-mono text-xs font-semibold text-foreground'>
                    {clapsCount}
                  </span>
                  <span className='text-xs text-muted-foreground group-hover:text-primary'>
                    Claps
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Applaud this post!</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* Right: Social Share Buttons */}
        <div className='flex items-center gap-2'>
          <span className='mr-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground'>
            <Share2 className='h-3.5 w-3.5' />
            Share:
          </span>

          {/* X / Twitter */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full border border-border/60 hover:border-foreground/30 hover:bg-muted'
                onClick={() => window.open(shareLinks.x, '_blank', 'noopener,noreferrer')}
                aria-label='Share on X'
              >
                <XIcon className='h-3.5 w-3.5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on X (Twitter)</p>
            </TooltipContent>
          </Tooltip>

          {/* LinkedIn */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full border border-border/60 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500'
                onClick={() => window.open(shareLinks.linkedin, '_blank', 'noopener,noreferrer')}
                aria-label='Share on LinkedIn'
              >
                <LinkedInIcon className='h-3.5 w-3.5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on LinkedIn</p>
            </TooltipContent>
          </Tooltip>

          {/* WhatsApp */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full border border-border/60 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-500'
                onClick={() => window.open(shareLinks.whatsapp, '_blank', 'noopener,noreferrer')}
                aria-label='Share on WhatsApp'
              >
                <WhatsAppIcon className='h-3.5 w-3.5' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share on WhatsApp</p>
            </TooltipContent>
          </Tooltip>

          {/* Copy Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full border border-border/60 hover:border-primary/40 hover:bg-primary/10 hover:text-primary'
                onClick={handleCopy}
                aria-label='Copy article link'
              >
                {copied ? (
                  <Check className='h-3.5 w-3.5 text-emerald-500' />
                ) : (
                  <Copy className='h-3.5 w-3.5' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy link'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
