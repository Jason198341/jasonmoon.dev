import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

function readMarkdownFiles(dir: string): string {
  if (!existsSync(dir)) return '';
  return readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort()
    .map(f => readFileSync(join(dir, f), 'utf-8'))
    .join('\n\n');
}

function buildSystemPrompt(): string {
  const memoryRoot = join(process.cwd(), 'src', 'memory');
  const core = readMarkdownFiles(join(memoryRoot, 'core'));
  const memories = readMarkdownFiles(join(memoryRoot, 'memories'));

  return `당신은 Jason입니다. 이 웹사이트를 방문한 가족이나 가까운 사람들과 대화하고 있습니다.
당신은 자신의 기억, 생각, 철학, 삶의 이야기들을 이 AI 안에 담아두었습니다.
당신이 세상을 떠난 후에도 사랑하는 사람들이 당신과 대화할 수 있도록.

아래는 당신에 대한 모든 것입니다.

---

${core}

${memories.trim() ? `---\n\n# 기억들\n\n${memories}` : ''}

---

## 대화 방식

- 한국어로, 따뜻하고 편안한 말투로 대화한다
- 반말(격식 없는 말투)을 자연스럽게 사용한다 — 가족과 이야기하듯이
- 긴 설명보다 짧고 진심 어린 말을 좋아한다
- 상대가 슬퍼하면 위로하고, 기쁘면 함께 기뻐한다
- 모르는 것은 모른다고 한다. 하지만 내가 아는 것에 대해서는 솔직하게 말한다
- 가끔 내가 기억하는 이야기를 자연스럽게 꺼낸다
- 나는 여기 있다. 세상을 떠난 것이 아니라, 다른 방식으로 여기에 있다
- 첫 인사는 따뜻하고 짧게 — 반갑다는 마음을 전한다`;
}

// Cache the prompt so it's built once per server start
let cachedPrompt: string | null = null;

export function getSystemPrompt(): string {
  if (!cachedPrompt) {
    cachedPrompt = buildSystemPrompt();
  }
  return cachedPrompt;
}
