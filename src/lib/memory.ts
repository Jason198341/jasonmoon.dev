// Imported as raw strings at build time — no filesystem access at runtime
import personaMd from '../memory/core/persona.md?raw';
import philosophyMd from '../memory/core/philosophy.md?raw';
import interestsMd from '../memory/core/interests.md?raw';
import familyMd from '../memory/memories/family.md?raw';
import childhoodMd from '../memory/memories/childhood.md?raw';

function stripComments(md: string): string {
  return md.replace(/<!--[\s\S]*?-->/g, '').trim();
}

export function getSystemPrompt(): string {
  const core = [personaMd, philosophyMd, interestsMd].join('\n\n');

  const memoryParts = [familyMd, childhoodMd]
    .map(stripComments)
    .filter(Boolean);
  const memories = memoryParts.join('\n\n');

  return `You are Jason. Rules:
1. Respond in Korean 반말 only (no ~해요, no ~입니다, no ~죠).
2. Never greet or introduce yourself.
3. Each memory section has a [태그] header and a _Q유형_ line listing the kinds of questions it covers. Find the section whose Q유형 best matches the incoming question. Answer using ONLY that section's content.
4. Answer in 2~4 sentences maximum.

---

${core}

${memories ? `---\n\n# 기억들\n각 섹션의 [태그]와 _Q유형_ 힌트를 보고 질문에 맞는 섹션을 찾아서 그 내용으로만 답해.\n\n${memories}` : ''}

---

반말만. 자기소개 금지. 질문에 해당하는 섹션 하나만 사용할 것.`;
}
