import { useEffect } from 'react'

export interface SeoHeadProps {
  title: string
  description: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  authorName?: string
  category?: string
  tags?: string[]
}

export function SeoHead({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  ogType = 'article',
  publishedTime,
  authorName = 'Swatantra Chaudhary',
  category,
  tags = [],
}: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes('Swatantra') ? title : `${title} | Swatantra Chaudhary`
    document.title = fullTitle

    const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
      let el = document.querySelector(`meta[${attributeName}="${attributeValue}"]`) as HTMLMetaElement | null
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attributeName, attributeValue)
        document.head.appendChild(el)
      }
      el.content = content
    }

    const setLinkTag = (rel: string, href: string, type?: string, titleAttr?: string) => {
      let el = document.querySelector(`link[rel="${rel}"][href="${href}"]`) as HTMLLinkElement | null
      if (!el) {
        el = document.createElement('link')
        el.rel = rel
        el.href = href
        if (type) el.type = type
        if (titleAttr) el.title = titleAttr
        document.head.appendChild(el)
      }
    }

    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '')

    // Standard Meta
    setMetaTag('name', 'description', description)
    if (tags.length > 0) {
      setMetaTag('name', 'keywords', tags.join(', '))
    }
    setMetaTag('name', 'author', authorName)
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    // OpenGraph Meta
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:url', currentUrl)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:image', ogImage)
    setMetaTag('property', 'og:site_name', 'Swatantra Chaudhary - Engineering & AI')
    if (publishedTime) {
      setMetaTag('property', 'article:published_time', publishedTime)
    }
    if (authorName) {
      setMetaTag('property', 'article:author', authorName)
    }
    if (category) {
      setMetaTag('property', 'article:section', category)
    }

    // Twitter Card Meta
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', ogImage)
    setMetaTag('name', 'twitter:creator', '@swatantra_dev')

    // Canonical Link
    if (canonicalUrl) {
      let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!canonicalEl) {
        canonicalEl = document.createElement('link')
        canonicalEl.rel = 'canonical'
        document.head.appendChild(canonicalEl)
      }
      canonicalEl.href = canonicalUrl
    }

    // RSS Feed Link
    setLinkTag('alternate', '/api/v1/blogs/rss.xml', 'application/rss+xml', 'Swatantra Chaudhary Engineering RSS')

    // JSON-LD Structured Data Schema for Google Search
    const schemaScriptId = 'blog-schema-jsonld'
    let scriptEl = document.getElementById(schemaScriptId) as HTMLScriptElement | null
    if (!scriptEl) {
      scriptEl = document.createElement('script')
      scriptEl.id = schemaScriptId
      scriptEl.type = 'application/ld+json'
      document.head.appendChild(scriptEl)
    }

    const structuredData = ogType === 'article' ? {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description: description,
      image: [ogImage],
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: authorName,
      },
      publisher: {
        '@type': 'Person',
        name: 'Swatantra Chaudhary',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': currentUrl,
      },
      keywords: tags.join(','),
      articleSection: category || 'Technology',
    } : {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: title,
      description: description,
      url: currentUrl,
      author: {
        '@type': 'Person',
        name: authorName,
      },
    }

    scriptEl.textContent = JSON.stringify(structuredData)

    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl)
      }
    }
  }, [title, description, canonicalUrl, ogImage, ogType, publishedTime, authorName, category, tags])

  return null
}
