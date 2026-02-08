import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, basename } from 'path';

const BASE = 'C:/obsidian/05_코딩-AI/개발가이드';

const CHAPTER_NAMES = {
  '01_환경설정': '환경설정',
  '02_Git': 'Git',
  '03_웹기초': '웹 기초',
  '04_TypeScript': 'TypeScript',
  '05_React': 'React',
  '06_상태관리': '상태관리',
  '07_스타일링': '스타일링',
  '08_빌드와번들링': '빌드와 번들링',
  '09_API통신': 'API 통신',
  '10_배포': '배포',
  '11_데이터베이스': '데이터베이스',
  '12_보안': '보안',
  '13_디버깅': '디버깅',
  '14_실전사례': '실전 사례',
  '15_AI코딩': 'AI 코딩',
};

const CHAPTER_ICONS = {
  '01_환경설정': '🔧',
  '02_Git': '📦',
  '03_웹기초': '🌐',
  '04_TypeScript': '🛡️',
  '05_React': '⚛️',
  '06_상태관리': '🧠',
  '07_스타일링': '🎨',
  '08_빌드와번들링': '📦',
  '09_API통신': '🔌',
  '10_배포': '🚀',
  '11_데이터베이스': '🗄️',
  '12_보안': '🔒',
  '13_디버깅': '🐛',
  '14_실전사례': '💼',
  '15_AI코딩': '🤖',
};

const chapters = [];

const dirs = readdirSync(BASE)
  .filter(d => statSync(join(BASE, d)).isDirectory())
  .sort();

for (const dir of dirs) {
  const chapterName = CHAPTER_NAMES[dir];
  if (!chapterName) continue;

  const icon = CHAPTER_ICONS[dir] || '📄';
  const files = readdirSync(join(BASE, dir))
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort();

  const articles = [];
  for (const file of files) {
    const content = readFileSync(join(BASE, dir, file), 'utf-8');
    const title = basename(file, '.md');
    const slug = title.replace(/[^a-zA-Z0-9가-힣\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
    articles.push({ slug, title, content });
  }

  chapters.push({
    id: dir,
    icon,
    title: chapterName,
    articles,
  });
}

// Generate TypeScript file
const output = `// Auto-generated from Obsidian vault — do not edit manually
// Generated: ${new Date().toISOString()}

export interface Article {
  slug: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  icon: string;
  title: string;
  articles: Article[];
}

export const chapters: Chapter[] = ${JSON.stringify(chapters, null, 2)};

export const totalArticles = ${chapters.reduce((s, c) => s + c.articles.length, 0)};
export const totalChapters = ${chapters.length};
`;

writeFileSync('src/data/devguide.ts', output, 'utf-8');

console.log(`Generated ${chapters.length} chapters, ${chapters.reduce((s, c) => s + c.articles.length, 0)} articles`);
chapters.forEach(c => console.log(`  ${c.icon} ${c.title}: ${c.articles.length} articles`));
