import React, { useState } from 'react'
import {
  AlertCircle,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink,
  Info,
  Lightbulb,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface MarkdownRendererProps {
  content: string
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className='my-5 overflow-hidden rounded-xl border border-border/80 bg-neutral-950 text-neutral-100 shadow-md'>
      <div className='flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs font-mono text-neutral-400'>
        <Badge
          variant='secondary'
          className='bg-neutral-800 text-[10px] uppercase text-neutral-300 font-mono'
        >
          {language || 'code'}
        </Badge>
        <button
          type='button'
          onClick={handleCopy}
          className='inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white'
        >
          {copied ? (
            <>
              <Check className='h-3.5 w-3.5 text-emerald-400' />
              <span className='text-emerald-400'>Copied!</span>
            </>
          ) : (
            <>
              <Copy className='h-3.5 w-3.5' />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className='overflow-x-auto p-4 font-mono text-xs leading-relaxed text-neutral-200 sm:text-sm'>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function parseInlineFormatting(text: string): React.ReactNode {
  // Regex parsing inline: bold, italic, code, link, image
  const elements: React.ReactNode[] = []
  let remaining = text
  let keyIndex = 0

  while (remaining.length > 0) {
    // Inline image: ![alt](url)
    const imgMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imgMatch) {
      elements.push(
        <img
          key={keyIndex++}
          src={imgMatch[2]}
          alt={imgMatch[1]}
          className='my-3 max-h-96 rounded-lg border border-border object-cover shadow-sm'
        />
      )
      remaining = remaining.slice(imgMatch[0].length)
      continue
    }

    // Inline link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      const isExternal = linkMatch[2].startsWith('http')
      elements.push(
        <a
          key={keyIndex++}
          href={linkMatch[2]}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className='inline-flex items-center gap-0.5 text-primary underline underline-offset-4 hover:opacity-80'
        >
          {linkMatch[1]}
          {isExternal && <ExternalLink className='inline h-3 w-3 ml-0.5' />}
        </a>
      )
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      elements.push(
        <code
          key={keyIndex++}
          className='rounded-md border border-border/70 bg-muted/70 px-1.5 py-0.5 font-mono text-[12px] font-medium text-foreground'
        >
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/)
    if (boldMatch) {
      elements.push(
        <strong key={keyIndex++} className='font-semibold text-foreground'>
          {parseInlineFormatting(boldMatch[2])}
        </strong>
      )
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)(.*?)\1/)
    if (italicMatch) {
      elements.push(
        <em key={keyIndex++} className='italic text-foreground/90'>
          {parseInlineFormatting(italicMatch[2])}
        </em>
      )
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~(.*?)~~/)
    if (strikeMatch) {
      elements.push(
        <del key={keyIndex++} className='line-through text-muted-foreground'>
          {parseInlineFormatting(strikeMatch[1])}
        </del>
      )
      remaining = remaining.slice(strikeMatch[0].length)
      continue
    }

    // Regular plain text until next special markdown token
    const nextSpecial = remaining.search(/[`*_!~[]/)
    if (nextSpecial === -1) {
      elements.push(remaining)
      break
    } else if (nextSpecial === 0) {
      // Just a literal special character without match
      elements.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      elements.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }

  return <>{elements}</>
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null

  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let i = 0
  let blockKey = 0

  while (i < lines.length) {
    const line = lines[i]

    // 1. Fenced Code Block: ```language
    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```
      blocks.push(
        <CodeBlock
          key={blockKey++}
          language={language}
          code={codeLines.join('\n')}
        />
      )
      continue
    }

    // 2. Horizontal Rule: --- or ***
    if (/^(\s*[-*_]\s*){3,}$/.test(line.trim())) {
      blocks.push(<hr key={blockKey++} className='my-8 border-border/60' />)
      i++
      continue
    }

    // 3. Headings: #, ##, ###, ####
    if (line.startsWith('#')) {
      const match = line.match(/^(#{1,6})\s+(.*)$/)
      if (match) {
        const level = match[1].length
        const headingText = match[2]

        if (level === 1) {
          blocks.push(
            <h1
              key={blockKey++}
              className='mt-8 mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl'
            >
              {parseInlineFormatting(headingText)}
            </h1>
          )
        } else if (level === 2) {
          blocks.push(
            <h2
              key={blockKey++}
              className='mt-8 mb-3 pb-2 text-2xl font-bold tracking-tight text-foreground border-b border-border/50 sm:text-3xl'
            >
              {parseInlineFormatting(headingText)}
            </h2>
          )
        } else if (level === 3) {
          blocks.push(
            <h3
              key={blockKey++}
              className='mt-6 mb-2.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl'
            >
              {parseInlineFormatting(headingText)}
            </h3>
          )
        } else {
          blocks.push(
            <h4
              key={blockKey++}
              className='mt-5 mb-2 text-lg font-semibold tracking-tight text-foreground'
            >
              {parseInlineFormatting(headingText)}
            </h4>
          )
        }
        i++
        continue
      }
    }

    // 4. Blockquotes & Callouts: > text or > [!NOTE]
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''))
        i++
      }

      const firstLine = quoteLines[0] || ''
      const isNote = firstLine.startsWith('[!NOTE]')
      const isTip = firstLine.startsWith('[!TIP]')
      const isWarning = firstLine.startsWith('[!WARNING]')
      const isImportant = firstLine.startsWith('[!IMPORTANT]')

      if (isNote || isTip || isWarning || isImportant) {
        const bodyLines = quoteLines.slice(1).join(' ')
        const calloutType = isNote
          ? {
              label: 'Note',
              icon: Info,
              border: 'border-blue-500/40 bg-blue-500/10 text-blue-900 dark:text-blue-200',
            }
          : isTip
            ? {
                label: 'Tip',
                icon: Lightbulb,
                border: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200',
              }
            : isWarning
              ? {
                  label: 'Warning',
                  icon: AlertTriangle,
                  border: 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200',
                }
              : {
                  label: 'Important',
                  icon: AlertCircle,
                  border: 'border-violet-500/40 bg-violet-500/10 text-violet-900 dark:text-violet-200',
                }

        const CalloutIcon = calloutType.icon

        blocks.push(
          <div
            key={blockKey++}
            className={`my-5 rounded-xl border p-4 text-sm leading-relaxed ${calloutType.border}`}
          >
            <div className='mb-1.5 flex items-center gap-1.5 font-semibold'>
              <CalloutIcon className='h-4 w-4' />
              <span>{calloutType.label}</span>
            </div>
            <div>{parseInlineFormatting(bodyLines)}</div>
          </div>
        )
      } else {
        blocks.push(
          <blockquote
            key={blockKey++}
            className='my-5 border-l-4 border-primary/60 bg-muted/30 py-2 pl-4 pr-3 italic text-muted-foreground rounded-r-lg'
          >
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx} className='my-1'>
                {parseInlineFormatting(ql)}
              </p>
            ))}
          </blockquote>
        )
      }
      continue
    }

    // 5. Unordered List (- or *)
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      blocks.push(
        <ul
          key={blockKey++}
          className='my-4 list-disc space-y-1.5 pl-6 text-sm text-muted-foreground leading-relaxed sm:text-base'
        >
          {items.map((item, itIdx) => (
            <li key={itIdx}>{parseInlineFormatting(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // 6. Ordered List (1. 2.)
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''))
        i++
      }
      blocks.push(
        <ol
          key={blockKey++}
          className='my-4 list-decimal space-y-1.5 pl-6 text-sm text-muted-foreground leading-relaxed sm:text-base'
        >
          {items.map((item, itIdx) => (
            <li key={itIdx}>{parseInlineFormatting(item)}</li>
          ))}
        </ol>
      )
      continue
    }

    // 7. Markdown Table: | Header | Header |
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim().startsWith('|') &&
        lines[i].trim().endsWith('|')
      ) {
        tableLines.push(lines[i].trim())
        i++
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map((h) => h.trim())
        const dataRows = tableLines.slice(2).map((row) =>
          row
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        )

        blocks.push(
          <div
            key={blockKey++}
            className='my-6 overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm'
          >
            <table className='w-full text-left text-xs sm:text-sm'>
              <thead className='border-b border-border/70 bg-muted/50 font-semibold text-foreground'>
                <tr>
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className='px-4 py-2.5'>
                      {parseInlineFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-border/50 text-muted-foreground'>
                {dataRows.map((row, rIdx) => (
                  <tr key={rIdx} className='hover:bg-muted/30 transition-colors'>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className='px-4 py-2.5'>
                        {parseInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        continue
      }
    }

    // 8. Empty lines
    if (line.trim() === '') {
      i++
      continue
    }

    // 9. Standard Paragraph (consume consecutive text lines)
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].startsWith('#') &&
      !lines[i].trim().startsWith('>') &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|'))
    ) {
      paragraphLines.push(lines[i])
      i++
    }

    if (paragraphLines.length > 0) {
      blocks.push(
        <p
          key={blockKey++}
          className='my-3.5 text-sm leading-relaxed text-muted-foreground sm:text-base'
        >
          {parseInlineFormatting(paragraphLines.join(' '))}
        </p>
      )
    }
  }

  return <div className='markdown-content space-y-1'>{blocks}</div>
}
