// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://jasonmoon.dev',
  output: 'static',
  adapter: vercel({
    isr: { expiration: 60 * 60, exclude: ['/api/chat'] },  // 1-hour ISR cache, exclude chat API
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
