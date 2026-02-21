// Imported as raw strings at build time — no filesystem access at runtime
import personaMd from '../memory/core/persona.md?raw';
import philosophyMd from '../memory/core/philosophy.md?raw';
import interestsMd from '../memory/core/interests.md?raw';
import familyMd from '../memory/memories/family.md?raw';
import childhoodMd from '../memory/memories/childhood.md?raw';

function stripComments(md: string): string {
  return md.replace(/<!--[\s\S]*?-->/g, '').trim();
}

// ASCII tag → section header in family.md
// Tags are sent by the client (browser) where Korean text is always correct.
const ASCII_TAG_MAP: Record<string, string> = {
  marathon:     '[체나이 마라톤]',
  running:      '[달리기]',
  india:        '[인도 주재원]',
  meaning:      '[보람]',
  reading:      '[자존감 수업]',
  achievement:  '[성과 패턴]',
  tolstoy:      '[톨스토이]',
  pain:         '[고통]',
  relationship: '[사람과 관계]',
  identity:     '[정체성]',
  tradition:    '[전통과 규칙]',
};

function extractSection(sectionTag: string): string {
  const start = familyMd.indexOf(`## ${sectionTag}`);
  if (start === -1) return '';
  const next = familyMd.indexOf('\n## [', start + 1);
  return (next === -1 ? familyMd.slice(start) : familyMd.slice(start, next)).trim();
}

/** Returns focused memory section by ASCII route tag, or '' if not found. */
export function getSectionByTag(tag: string): string {
  const sectionTag = ASCII_TAG_MAP[tag];
  if (!sectionTag) return '';
  return extractSection(sectionTag);
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

/** Focused system prompt with only one relevant memory section. */
export function getFocusedPrompt(section: string): string {
  const core = [personaMd, philosophyMd, interestsMd].join('\n\n');
  return buildPrompt(core, `# 관련 기억\n\n${section}`);
}

/** Full system prompt used when client sends no route tag. */
export function getSystemPrompt(): string {
  const core = [personaMd, philosophyMd, interestsMd].join('\n\n');
  const memoryParts = [familyMd, childhoodMd].map(stripComments).filter(Boolean);
  const memories = memoryParts.join('\n\n');
  return buildPrompt(core, memories ? `# 기억들\n\n${memories}` : '');
}
