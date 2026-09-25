export interface BlogAuthor {
  name: string
  role?: string
  avatarUrl?: string
}

export interface BlogSection {
  heading: string
  body: string
  codeSnippet?: {
    language: string
    code: string
  }
}

export interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content?: string
  sections?: BlogSection[]
  coverImage: string
  publishedAt: string
  readTime: string
  category: string
  tags: string[]
  author: BlogAuthor
  featured?: boolean
  published?: boolean
  claps?: number
  views?: number
}
