// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 완전 정적 사이트. DB·서버 없음 — 모든 데이터는 src/data/ 에 코드로 있다.
export default defineConfig({
  site: 'https://jasonmoon.dev',
  output: 'static',
  integrations: [sitemap()],
});
