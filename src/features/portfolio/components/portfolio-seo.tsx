import { useEffect } from 'react'
import type { PortfolioData } from '../types'

interface PortfolioSEOProps {
  data: PortfolioData
}

function updateMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

/**
 * Dynamic SEO component that injects Title, Meta, Open Graph, Twitter Cards,
 * and Schema.org JSON-LD structured data whenever portfolio data updates.
 */
export function PortfolioSEO({ data }: PortfolioSEOProps) {
  const { owner, experiences, skills, education } = data

  useEffect(() => {
    // 1. Dynamic document title
    const fullTitle = `${owner.name} — ${owner.title}`
    document.title = fullTitle

    // 2. Primary Meta tags
    const desc = owner.about || owner.tagline
    updateMetaTag('name', 'description', desc)
    updateMetaTag('name', 'author', owner.name)

    const skillKeywords = skills.map((s) => s.name).join(', ')
    const defaultKeywords = `${owner.name}, AI Engineer, Full Stack Developer, Machine Learning, LLM, Software Engineer`
    updateMetaTag('name', 'keywords', `${defaultKeywords}, ${skillKeywords}`)

    // 3. Open Graph
    const currentUrl = window.location.href
    updateMetaTag('property', 'og:title', fullTitle)
    updateMetaTag('property', 'og:description', owner.tagline)
    updateMetaTag('property', 'og:url', currentUrl)
    updateMetaTag('property', 'og:type', 'profile')
    updateMetaTag('property', 'og:site_name', `${owner.name} Portfolio`)

    // 4. Twitter Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', fullTitle)
    updateMetaTag('name', 'twitter:description', owner.tagline)

    // 5. Canonical Link
    updateLinkTag('canonical', currentUrl)

    // 6. Structured Data: Schema.org JSON-LD (Person & WebSite)
    const currentExperience = experiences.find((e) => e.current)

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${currentUrl}#person`,
          name: owner.name,
          jobTitle: owner.title,
          description: owner.about,
          url: currentUrl,
          email: owner.email ? `mailto:${owner.email}` : undefined,
          sameAs: [owner.github, owner.linkedin].filter(Boolean),
          address: {
            '@type': 'PostalAddress',
            addressLocality: owner.location,
          },
          knowsAbout: skills.map((s) => s.name),
          worksFor: currentExperience
            ? {
                '@type': 'Organization',
                name: currentExperience.company,
              }
            : undefined,
          alumniOf: education.map((edu) => ({
            '@type': 'EducationalOrganization',
            name: edu.institution,
          })),
        },
        {
          '@type': 'WebSite',
          '@id': `${currentUrl}#website`,
          url: currentUrl,
          name: `${owner.name} — Portfolio`,
          description: owner.tagline,
          author: {
            '@id': `${currentUrl}#person`,
          },
        },
        {
          '@type': 'ProfilePage',
          '@id': `${currentUrl}#profilepage`,
          url: currentUrl,
          name: fullTitle,
          mainEntity: {
            '@id': `${currentUrl}#person`,
          },
        },
      ],
    }

    const scriptId = 'portfolio-schema-jsonld'
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = scriptId
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(structuredData, null, 2)

    return () => {
      // Optional cleanup on unmount
    }
  }, [owner, experiences, skills, education])

  return null
}

