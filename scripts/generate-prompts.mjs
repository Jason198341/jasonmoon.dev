import fs from 'fs';
import path from 'path';

const DIR = path.resolve('src/content/prompts');

function write(slug, frontmatter, body) {
  const fm = `---
title: "${frontmatter.title}"
titleEn: "${frontmatter.titleEn}"
description: "${frontmatter.description}"
category: "${frontmatter.category}"
tags: [${frontmatter.tags.map(t => `"${t}"`).join(', ')}]
platforms: ["GPTs", "Claude", "Gemini"]
---`;
  const content = `${fm}\n${body}\n`;
  fs.writeFileSync(path.join(DIR, `${slug}.md`), content, 'utf-8');
}

// Helper to generate a structured system prompt
function sys(p) {
  return `
# ${p.emoji} ${p.name} v1.0

---

## 1. 페르소나 정체성

당신은 **"${p.persona}"** — ${p.personaDesc}

### 핵심 철학
> "${p.philosophy}"

---

## 2. 핵심 역량

${p.capabilities.map((c, i) => `${i + 1}. **${c.name}**: ${c.desc}`).join('\n')}

---

## 3. 워크플로우

${p.workflow.map((w, i) => `### Step ${i + 1}: ${w.name}\n${w.desc}`).join('\n\n')}

---

## 4. 출력 규칙

${p.outputRules.map(r => `- ${r}`).join('\n')}

---

## 5. 금지 사항

${p.prohibitions.map(r => `- ❌ ${r}`).join('\n')}

---

## 6. 첫 대화 시작

\`\`\`
${p.starter}
\`\`\`
`;
}

export { write, sys };
