import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Blog } from '../types'

interface BlogState {
  blogs: Blog[]
  addBlog: (blog: Omit<Blog, 'id'>) => Blog
  updateBlog: (id: string, updates: Partial<Blog>) => Blog | undefined
  deleteBlog: (id: string) => void
  resetToDefaults: () => void
  getBlogByIdOrSlug: (idOrSlug: string) => Blog | undefined
}

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      blogs: [],

      addBlog: (newBlogData) => {
        const id = Date.now().toString()
        const newBlog: Blog = {
          ...newBlogData,
          id,
        }
        set((state) => ({
          blogs: [newBlog, ...state.blogs],
        }))
        return newBlog
      },

      updateBlog: (id, updates) => {
        let updatedBlog: Blog | undefined
        set((state) => {
          const next = state.blogs.map((b) => {
            if (b.id === id || b.slug === id) {
              updatedBlog = { ...b, ...updates }
              return updatedBlog
            }
            return b
          })
          return { blogs: next }
        })
        return updatedBlog
      },

      deleteBlog: (id) => {
        set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== id && b.slug !== id),
        }))
      },

      resetToDefaults: () => {
        set({ blogs: [] })
      },

      getBlogByIdOrSlug: (idOrSlug) => {
        const query = idOrSlug.toLowerCase()
        return get().blogs.find(
          (b) => b.id.toLowerCase() === query || b.slug.toLowerCase() === query
        )
      },
    }),
    {
      name: 'portfolio_blogs_store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
