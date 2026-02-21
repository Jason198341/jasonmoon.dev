// Imported as raw strings at build time — no filesystem access at runtime
import personaMd from '../memory/core/persona.md?raw';
import philosophyMd from '../memory/core/philosophy.md?raw';
import interestsMd from '../memory/core/interests.md?raw';
import familyMd from '../memory/memories/family.md?raw';
import childhoodMd from '../memory/memories/childhood.md?raw';

function stripComments(md: string): string {
  return md.replace(/<!--[\s\S]*?-->/g, '').trim();
}

// Keyword → section [태그] routing table
const KEYWORD_ROUTES: { keywords: string[]; tag: string }[] = [
  { keywords: ['마라톤', '체나이', '32km', '완주했을', 'chennai', 'marathon'], tag: '[체나이 마라톤]' },
  { keywords: ['달리기', '러닝', '런닝', '음악 없이', '달릴 때', 'running'], tag: '[달리기]' },
  { keywords: ['인도', '주재원', '체육대회', '사랑한다고', '팀원', 'india'], tag: '[인도 주재원]' },
  { keywords: ['보람', '의미있', '결과 없어도'], tag: '[보람]' },
  { keywords: ['자존감 수업', '100회', '이호선', '숫자 목표', '백 번'], tag: '[자존감 수업]' },
  { keywords: ['성과 중독', '아웃풋 강박', '존재 증명', '관찰자'], tag: '[성과 패턴]' },
  { keywords: ['성과', '체계화', '인정받지'], tag: '[성과 패턴]' },
  { keywords: ['톨스토이', '필사'], tag: '[톨스토이]' },
  { keywords: ['삶 철학', '삶 자체로', '인생 철학'], tag: '[톨스토이]' },
  { keywords: ['고통'], tag: '[고통]' },
  { keywords: ['관계 어떻게', '사람을 바꾸', '조직 문화', '사람과 관계'], tag: '[사람과 관계]' },
  { keywords: ['어떤 사람이고 싶어', '리더십', '영감 어디서', '정체성'], tag: '[정체성]' },
  { keywords: ['전통', '규칙 따르', '남 눈치'], tag: '[전통과 규칙]' },
];

/** Extract a single section from family.md by [태그]. */
function extractSection(tag: string): string {
  const start = familyMd.indexOf(`## ${tag}`);
  if (start === -1) return '';
  const next = familyMd.indexOf('\n## [', start + 1);
  return (next === -1 ? familyMd.slice(start) : familyMd.slice(start, next)).trim();
}

/**
 * Given the user's question, return the single most relevant memory section.
 * Returns empty string if no keyword matches (caller falls back to full prompt).
 */
export function routeQuestion(question: string): string {
  const lower = question.toLowerCase().normalize('NFC');
  for (const route of KEYWORD_ROUTES) {
    const matched = route.keywords.find(k => lower.includes(k.normalize('NFC')));
    if (matched) {
      console.log('[routeQuestion] matched keyword:', JSON.stringify(matched), '→ tag:', route.tag);
      const sec = extractSection(route.tag);
      console.log('[routeQuestion] section length:', sec.length);
      return sec;
    }
  }
  console.log('[routeQuestion] no match for:', JSON.stringify(lower.slice(0, 40)));
  return '';
}

/** Full system prompt used when server-side routing finds no match. */
export function getSystemPrompt(): string {
  const core = [personaMd, philosophyMd, interestsMd].join('\n\n');

  const memoryParts = [familyMd, childhoodMd]
    .map(stripComments)
    .filter(Boolean);
  const memories = memoryParts.join('\n\n');

  return buildPrompt(core, memories ? `# 기억들\n\n${memories}` : '');
}

/** Focused prompt with only one relevant memory section. */
export function getFocusedPrompt(section: string): string {
  const core = [personaMd, philosophyMd, interestsMd].join('\n\n');
  return buildPrompt(core, `# 관련 기억\n\n${section}`);
}

function buildPrompt(core: string, memoriesBlock: string): string {
  return `You are Jason. Rules:
1. Respond in Korean 반말 only (no ~해요, no ~입니다).
2. Never greet or introduce yourself.
3. Answer in 2~4 sentences using ONLY the content in 관련 기억 or 기억들.

---

${core}

${memoriesBlock ? `---\n\n${memoriesBlock}` : ''}

---

반말만. 자기소개 금지. 주어진 기억 내용으로만 답할 것.`;
}
