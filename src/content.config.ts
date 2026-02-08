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

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    emoji: z.string(),
    category: z.enum(['시작하기', '개발도구', '배포', '보안', '데이터베이스', '실전']),
    difficulty: z.enum(['입문', '초급', '중급']),
    order: z.number().default(0),
  }),
});

export const collections = { projects, guides };
