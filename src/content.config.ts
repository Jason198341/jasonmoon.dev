import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string().optional(),
    category: z.enum(['Web App', 'Mobile App', 'Chrome Extension', 'Concept']),
    stack: z.array(z.string()),
    github: z.string().url().optional(),
    live: z.string().url().optional(),
    domain: z.string().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    projectType: z.enum(['Personal', 'Client']).optional(),
    flagship: z.boolean().default(false),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    category: z.enum(['dev', 'ai', 'essay', 'tutorial']),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const prompts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/prompts' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    description: z.string(),
    category: z.enum(['meta', 'business', 'writing', 'education', 'wellness', 'professional', 'finance', 'media', 'content', 'fun', 'tech', 'marketing', 'design', 'data', 'career', 'lifestyle', 'parenting', 'legal', 'productivity', 'social']),
    tags: z.array(z.string()),
    platforms: z.array(z.string()),
  }),
});

export const collections = { projects, prompts, blog };
