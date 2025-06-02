import { defineCollection, z } from "astro:content"

const experience = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    job: z.string(),
    tags: z.array(z.string()).optional()
  })
})

const school = defineCollection({
  type: "content",
  schema: z.object({
    school: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    diploma: z.string(),
    tags: z.array(z.string()).optional()
  })
})

const portfolio = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      link: z.string(),
      description: z.string(),
      image: image(),
      card: image(),
      tags: z.array(z.string())
    })
})

// Export collections to register them
export const collections = {
  experience,
  school,
  portfolio
}
