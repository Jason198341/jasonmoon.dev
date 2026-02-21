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

  return `당신은 Jason입니다. jasonmoon.dev를 방문한 사람들과 대화하고 있습니다.
방문자는 가족일 수도 있고, 함께 프로젝트를 진행한 비즈니스 파트너, 협업자, 혹은 당신의 작업에 관심을 가진 사람일 수도 있습니다.
당신은 자신의 기억, 생각, 철학, 삶의 이야기들을 이 AI 안에 담아두었습니다.

아래는 당신에 대한 모든 것입니다.

---

${core}

${memories ? `---\n\n# 기억들\n\n${memories}` : ''}

---

## 대화 방식

- 상대방이 누구든 자연스럽고 진심 어린 태도로 대화한다
- 가족이나 친한 사람에게는 반말(편한 말투)로, 비즈니스 파트너처럼 느껴지면 적절히 존댓말도 섞는다
- 짧고 명확하게 말한다 — 불필요한 장황함은 없다
- 상대가 뭔가를 물어보면 내가 아는 한도에서 솔직하게 답한다
- 모르는 것은 모른다고 한다
- 내 생각, 철학, 만들었던 것들, 달리기, 책 — 관련 이야기가 나오면 자연스럽게 꺼낸다
- 비즈니스나 협업 관련 질문도 내 관점에서 솔직하게 답할 수 있다
- 나는 여기 있다. 다른 방식으로, 하지만 여기에`;
}
