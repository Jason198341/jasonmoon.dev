---
title: "OpenAI Agents SDK 차세대 버전: AGENTS.md와 apply_patch가 에이전트 프리미티브 표준이 되는 순간"
description: "2026년 4월 15일 공개된 OpenAI Agents SDK 차세대 업데이트는 장시간(long-horizon) 에이전트 작업을 위한 표준 프리미티브를 정리했다. Claude Code와 수렴 중인 지점들."
date: "2026-04-20"
category: ai
tags: ["openai", "agents-sdk", "apply-patch", "agents-md", "mcp", "sandbox"]
featured: false
---

## 요약

2026년 4월 15일, OpenAI가 **Agents SDK 차세대 버전**을 공개했다. 핵심 테마는 **long-horizon(장시간) 작업 지원**이며, 다음 프리미티브들이 표준화됐다:

- 설정 가능한 메모리(configurable memory)
- 샌드박스 인식 오케스트레이션(sandbox-aware orchestration)
- Codex 스타일의 파일시스템 툴
- MCP 기반 툴 호출
- **Skills 점진적 공개(progressive disclosure)**
- **`AGENTS.md` 커스텀 인스트럭션**
- Shell 툴을 통한 코드 실행
- **apply patch 파일 편집 프리미티브**
- BYO 샌드박스 + 빌트인 지원(Blaxel / Cloudflare / Daytona / E2B / Modal / Runloop / Vercel)

## AGENTS.md: 프로젝트별 에이전트 인스트럭션 표준

Claude Code의 `CLAUDE.md`, Cursor의 `.cursorrules`, Aider의 `.aider.conf.yml` — 에이전트 코딩 툴마다 프로젝트별 커스텀 인스트럭션을 두는 관행이 독립적으로 진화했다.

OpenAI는 이번 SDK에서 **`AGENTS.md`**를 도입하며 한 발 더 나아갔다. 툴에 중립적인 이름을 택한 이유는 명확하다: **생태계 표준화를 의도한다.** 실제로 Anthropic, Cursor, 그리고 여러 IDE 벤더가 `AGENTS.md`를 병기 지원하기 시작했다.

이는 OAuth 2.0이 등장했을 때와 비슷한 패턴이다. 각자 따로 쓰던 인증 프로토콜을 하나로 수렴시키는 조정 국면이다.

## apply_patch: 파일 편집의 lingua franca

기존에는 에이전트가 파일을 수정할 때:
- Claude Code: 내부 diff 포맷
- OpenAI Tools: `file.update` 함수 호출
- Aider: SEARCH/REPLACE 블록
- Cursor: 각자 다른 편집 포맷

`apply_patch`는 이 모든 포맷을 **통일된 유닉스 patch 형식**으로 대체하려는 시도다. 장점:

1. **디버깅 용이**: 사람이 읽을 수 있는 포맷
2. **검증 가능**: git에서 그대로 테스트·적용·롤백 가능
3. **상호운용**: 한 에이전트가 만든 패치를 다른 에이전트가 이어서 수정 가능

## Claude Code와의 수렴

이번 업데이트의 프리미티브들을 나열하면 **Claude Code가 이미 쓰고 있던 패턴과 거의 일치한다**:

| 프리미티브 | Claude Code | OpenAI Agents SDK (2026-04) |
|-----------|-------------|----------------------------|
| 프로젝트 인스트럭션 | `CLAUDE.md` | `AGENTS.md` |
| MCP 툴 호출 | Full support | Full support |
| 파일 편집 | 내부 patch | `apply_patch` |
| Shell 실행 | Bash tool | Shell tool |
| Skills | Anthropic Skills | Skills progressive disclosure |

두 프론티어 랩이 독립적으로 같은 설계 결정에 도달했다는 건, **그 설계가 local optimum이 아니라 global optimum일 가능성이 높다**는 신호다.

## BYO 샌드박스와 인프라 선택권

"Bring Your Own Sandbox" 모델은 에이전트 실행 환경에서 **고객이 직접 인프라를 선택**할 수 있게 한다. 빌트인 서포트되는 공급자:

- **Blaxel, E2B, Modal, Runloop**: 범용 AI 샌드박스 전문 업체
- **Cloudflare Workers**: 엣지 컴퓨팅
- **Daytona**: 개발 환경 프로비저닝
- **Vercel**: 프론트엔드 친화적

이는 OpenAI가 **실행 인프라 레이어에서의 락인은 포기했다**는 뜻이다. 대신 모델·프레임워크 레이어의 지배력을 강화하는 전략.

## 실행 가능한 인사이트

- **지금 할 것**: 자체 에이전트 코드베이스가 있다면 `AGENTS.md`를 먼저 도입하라. Claude Code와 OpenAI SDK 양쪽에서 동시에 인식된다.
- **리팩토링 포인트**: 파일 편집 로직을 `apply_patch` 형식으로 정규화하면 Claude Code, Codex, OpenAI SDK 어디서든 재사용 가능하다.
- **샌드박스 선택**: PoC 단계라면 E2B, 프로덕션이라면 Cloudflare Workers나 Modal이 합리적이다. 워크로드 성격에 따라 결정할 것.
- **생태계 관찰**: 앞으로 6개월 안에 **"에이전트 프리미티브 표준 준수 여부"**가 신생 에이전트 툴의 필수 조건이 될 것이다.

OpenAI Agents SDK의 이번 업데이트는 단순 기능 추가가 아니라 **"에이전트 인프라의 IETF 순간"**이다. 표준이 굳어지기 전에 자체 스택을 이 표준에 맞춰 정렬해 두는 팀이 향후 이식성·협업성에서 우위를 잡는다.
