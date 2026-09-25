import type { BlogSection } from '../types'

/**
 * Converts an array of structured sections to a clean markdown document.
 */
export function sectionsToMarkdown(sections?: BlogSection[]): string {
  if (!sections || sections.length === 0) return ''

  return sections
    .map((section) => {
      let md = `## ${section.heading}\n\n${section.body}`
      if (section.codeSnippet && section.codeSnippet.code?.trim()) {
        const lang = section.codeSnippet.language || 'typescript'
        md += `\n\n\`\`\`${lang}\n${section.codeSnippet.code.trim()}\n\`\`\``
      }
      return md
    })
    .join('\n\n')
}

/**
 * Parses a markdown document into structured sections based on ## or # headings.
 */
export function markdownToSections(markdown: string): BlogSection[] {
  if (!markdown || !markdown.trim()) {
    return [
      {
        heading: 'Introduction',
        body: '',
      },
    ]
  }

  const lines = markdown.split('\n')
  const sections: BlogSection[] = []
  let currentHeading = 'Introduction'
  let currentBodyLines: string[] = []
  let currentCodeSnippet: { language: string; code: string } | undefined
  let inCodeBlock = false
  let codeLines: string[] = []
  let codeLang = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeLang = line.trim().slice(3).trim() || 'typescript'
        codeLines = []
      } else {
        inCodeBlock = false
        currentCodeSnippet = {
          language: codeLang,
          code: codeLines.join('\n'),
        }
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    // Heading detected outside code block
    if (line.startsWith('## ') || line.startsWith('# ')) {
      if (currentBodyLines.length > 0 || currentCodeSnippet) {
        sections.push({
          heading: currentHeading,
          body: currentBodyLines.join('\n').trim(),
          codeSnippet: currentCodeSnippet,
        })
        currentBodyLines = []
        currentCodeSnippet = undefined
      }
      currentHeading = line.replace(/^#{1,6}\s+/, '').trim()
    } else {
      currentBodyLines.push(line)
    }
  }

  if (currentBodyLines.length > 0 || currentCodeSnippet || sections.length === 0) {
    sections.push({
      heading: currentHeading,
      body: currentBodyLines.join('\n').trim(),
      codeSnippet: currentCodeSnippet,
    })
  }

  return sections
}
