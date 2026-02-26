---
title: "Claude Code Bible — The Complete Guide (2026)"
description: "15-chapter comprehensive guide covering Claude Code's origin, design philosophy, CLAUDE.md memory, hooks, plugins, MCP, Agent SDK, multi-agent teams, and real-world workflows. Written so anyone can become an expert."
date: "2026-02-26"
category: tutorial
tags: ["claude-code", "ai-coding", "agentic-ai", "mcp", "agent-sdk", "hooks", "plugins", "guide"]
featured: true
---

> **2026년 2월 기준 최신판**
> 이 책 한 권이면 Claude Code의 탄생 배경부터 설계 철학, 핵심 기능, 실전 활용법까지 모두 이해할 수 있습니다.

---

## 목차

- [제1장. Claude Code란 무엇인가?](#제1장-claude-code란-무엇인가)
- [제2장. 탄생 배경 — 왜 만들었을까?](#제2장-탄생-배경--왜-만들었을까)
- [제3장. 설계 철학 — 개발자의 머릿속](#제3장-설계-철학--개발자의-머릿속)
- [제4장. 핵심 개념 5가지](#제4장-핵심-개념-5가지)
- [제5장. 기억 시스템 — CLAUDE.md](#제5장-기억-시스템--claudemd)
- [제6장. 훅(Hooks) — 자동화의 핵심](#제6장-훅hooks--자동화의-핵심)
- [제7장. 플러그인 — 나만의 확장](#제7장-플러그인--나만의-확장)
- [제8장. MCP — 외부 세계와 연결](#제8장-mcp--외부-세계와-연결)
- [제9장. Agent SDK — 나만의 AI 만들기](#제9장-agent-sdk--나만의-ai-만들기)
- [제10장. 멀티에이전트 팀 — AI 팀을 구성하다](#제10장-멀티에이전트-팀--ai-팀을-구성하다)
- [제11장. 실전 워크플로우 10가지](#제11장-실전-워크플로우-10가지)
- [제12장. 경쟁 도구 비교](#제12장-경쟁-도구-비교)
- [제13장. 실제 사례와 숫자들](#제13장-실제-사례와-숫자들)
- [제14장. 한계와 주의점](#제14장-한계와-주의점)
- [제15장. 미래 — 어디로 가고 있는가](#제15장-미래--어디로-가고-있는가)
- [부록 A. 슬래시 명령어 전체 목록](#부록-a-슬래시-명령어-전체-목록)
- [부록 B. 환경변수 주요 목록](#부록-b-환경변수-주요-목록)
- [부록 C. 추천 학습 자료](#부록-c-추천-학습-자료)

---

## 제1장. Claude Code란 무엇인가?

### 한 줄 요약

> **터미널(검은 화면)에서 자연어(말)로 코딩하는 AI 도구**

### 쉬운 비유

학교에서 조별과제를 한다고 상상해봐. 너는 조장이야.

- **GitHub Copilot** = 옆에서 답을 속삭여주는 친구. "여기 이렇게 쓰면 돼" 하고 한 줄씩 알려줌.
- **Cursor** = 네 노트를 보고 알아서 요약도 하고 그림도 그려주는 똑똑한 친구.
- **Claude Code** = **조별과제 전체를 맡길 수 있는 만능 팀원**. "이 프로젝트 전체 코드 읽고, 버그 찾아서 고치고, 테스트 돌리고, 커밋해줘"라고 말하면 **혼자 다 함**.

### 핵심 특징

| 특징 | 설명 |
|------|------|
| **터미널 기반** | VSCode나 특별한 프로그램 없이도, 터미널(명령어 입력 창)에서 바로 실행 |
| **에이전틱(Agentic)** | 명령 하나로 여러 단계를 스스로 판단하고 실행. 파일 읽기→분석→수정→테스트→커밋을 자동으로 |
| **대화형** | 채팅하듯 자연어로 명령. "이 함수를 더 빠르게 만들어줘" |
| **코드베이스 전체 이해** | 프로젝트의 모든 파일을 읽고, 파일 간 관계를 파악 |
| **도구 사용** | 파일 읽기/쓰기, 터미널 명령 실행, 웹 검색까지 가능 |

### 첫 실행 예제

```bash
# 1. 설치 (npm이 있으면 이 한 줄이면 됨)
npm install -g @anthropic-ai/claude-code

# 2. 실행
claude

# 3. 대화 시작
> 이 프로젝트의 구조를 설명해줘

# Claude의 응답:
# 이 프로젝트는 Next.js 16 기반 웹앱입니다.
# src/app/ — 페이지 라우팅
# src/components/ — 재사용 UI 컴포넌트
# src/lib/ — 유틸리티 함수
# ...
```

이게 전부야. 설치하고, 실행하고, 말하면 돼.

---

## 제2장. 탄생 배경 — 왜 만들었을까?

### 개발자: 보리스 체르니(Boris Cherny)

Claude Code는 Anthropic의 엔지니어 **보리스 체르니**가 **사이드 프로젝트**로 시작한 것이다. 2025년 12월, 그가 트위터에 이 사실을 공개했을 때 게시물 조회수가 **440만 회**, 좋아요 **2만 개**를 기록했다.

### 왜 만들었나?

기존 AI 코딩 도구들의 문제:

1. **코드 한 줄씩만 도움** — Copilot은 자동완성만. "프로젝트 전체를 리팩토링해줘"는 불가능
2. **특정 IDE에 종속** — Cursor는 VSCode 포크(변형판). 다른 에디터 쓰면 사용 불가
3. **실행 능력 없음** — 코드를 제안만 하지, 직접 실행하거나 테스트하지 못함
4. **맥락 부족** — 프로젝트 전체를 이해하지 못하고, 열려있는 파일 몇 개만 봄

### 핵심 통찰

> "개발자에게 필요한 건 더 나은 자동완성이 아니라, **자율적으로 일하는 팀원**이다."

이것이 Claude Code의 설계를 관통하는 핵심 아이디어다.

### 성장 속도

| 시점 | 이정표 |
|------|--------|
| 2025년 2월 | 프리뷰 출시 |
| 2025년 5월 | 정식 출시 (GA) |
| 2025년 9월 | 연간 매출 $500M(약 7,000억원) 돌파 |
| 2025년 10월 | 플러그인 시스템 + 웹 버전 출시 |
| 2026년 1월 | Claude Cowork(일반 업무용 확장판) 출시 |
| 2026년 2월 | 엔터프라이즈 마켓플레이스, 주간 1억 9,500만 줄 코드 생성 |

ChatGPT의 비슷한 성장 속도보다 **더 빠르게** $10억 매출을 돌파했다.

---

## 제3장. 설계 철학 — 개발자의 머릿속

### 철학 1: "도구가 아니라 동료"

대부분의 AI 코딩 도구는 **도구(Tool)** 로 설계됐다. 사용자가 버튼을 누르면 결과를 돌려주는 계산기 같은 것.

Claude Code는 **동료(Colleague)** 로 설계됐다. 지시를 받으면 스스로 판단하고, 필요한 정보를 찾고, 여러 단계를 거쳐 결과를 만든다.

```
[기존 AI 도구]
사용자 → 질문 → AI → 답변 → 사용자가 직접 적용

[Claude Code]
사용자 → 지시 → Claude가 알아서:
   ├── 파일을 찾고
   ├── 코드를 읽고
   ├── 문제를 분석하고
   ├── 수정하고
   ├── 테스트를 돌리고
   └── 커밋까지 완료
```

### 철학 2: "80% 계획, 20% 실행"

Claude Code의 내부에는 **Plan Mode(계획 모드)** 라는 개념이 있다.

가장 능숙한 개발자들은 코드를 치기 전에 **설계**에 80%의 시간을 쓴다. Claude Code도 마찬가지다.

```
[나쁜 사용법]
"이 앱 전부 만들어줘" → 실패 확률 높음

[좋은 사용법]
1단계: "이 기능의 구현 계획을 세워줘" → 계획 검토
2단계: "이 계획대로 구현해줘" → 실행
3단계: "테스트 돌려줘" → 확인
```

### 철학 3: "실수는 규칙이 된다"

보리스 체르니의 팀에서는 Claude가 실수할 때마다 **CLAUDE.md** 파일에 규칙을 추가한다.

> "Claude가 잘못할 때마다 CLAUDE.md에 추가합니다. 그러면 Claude는 다음에 같은 실수를 하지 않아요. 모든 실수가 규칙이 됩니다."

이건 마치 학교에서 **오답 노트**를 만드는 것과 같다. 틀린 문제를 기록하면 다음에 안 틀리듯이.

### 철학 4: "결정적인 것은 코드로, 제안은 AI로"

Claude Code는 네 가지 레이어로 나뉜다:

| 레이어 | 역할 | 성격 |
|--------|------|------|
| **CLAUDE.md** | 규칙과 지침 | 제안 (AI가 참고) |
| **Hooks** | 자동 실행 스크립트 | **강제** (무조건 실행) |
| **MCP** | 외부 서비스 연결 | 도구 |
| **Slash Commands** | 재사용 워크플로우 | 단축키 |

중요한 구분: CLAUDE.md에 "코드 저장 후 린트 돌려"라고 쓰면 AI가 **가끔 잊는다**. 하지만 Hook으로 설정하면 **100% 실행된다**. 결정적인 것은 Hook, 가이드라인은 CLAUDE.md.

### 철학 5: "점진적 공개(Progressive Disclosure)"

Claude Code의 플러그인/스킬 시스템은 **필요할 때만** 정보를 로딩한다.

비유: 도서관에 10,000권의 책이 있어. 전부 읽는 건 불가능하지?
- 기존 AI: 10,000권을 다 들고 다님 → 무겁고 느림
- Claude Code: 목차(제목과 설명)만 읽고, **필요한 책만** 꺼내 읽음

이 방식으로 컨텍스트(AI가 한 번에 읽을 수 있는 양) 사용을 **최대 95%** 절약한다.

---

## 제4장. 핵심 개념 5가지

### 개념 1: 컨텍스트 윈도우 (Context Window)

> AI가 한 번에 읽고 기억할 수 있는 텍스트의 양

| 도구 | 컨텍스트 크기 | 비유 |
|------|--------------|------|
| GitHub Copilot | ~8,000 토큰 | 교과서 2~3 페이지 |
| Cursor | ~128,000 토큰 | 소설책 한 권 |
| Claude Code | **200,000 토큰** | 소설책 두 권 |
| Claude Code (베타) | **1,000,000 토큰** | 소설책 열 권 |

**토큰**이란? 대략 한국어 한 글자가 1~2 토큰, 영어 한 단어가 1 토큰 정도.

Claude Code의 20만 토큰은 대략 **한국어 10만 글자** = A4 용지 약 200장 분량을 한 번에 이해할 수 있다는 뜻이다.

### 개념 2: 에이전틱(Agentic) 실행

> AI가 스스로 판단하여 여러 도구를 순서대로 사용하는 것

일반 AI:
```
사용자: "이 버그 고쳐줘"
AI: "이렇게 고치면 됩니다: [코드 제안]"
사용자: (직접 파일 열고, 코드 수정하고, 저장하고, 테스트 실행)
```

에이전틱 AI (Claude Code):
```
사용자: "이 버그 고쳐줘"
Claude:
  1. grep으로 관련 파일 검색
  2. 파일 3개 읽기
  3. 버그 원인 분석
  4. Edit 도구로 코드 수정
  5. 테스트 실행
  6. "버그를 수정했습니다. 원인은 ..."
```

사용자는 **결과만 확인**하면 된다.

### 개념 3: 권한 모드 (Permission Modes)

Claude Code가 하는 모든 작업에는 **권한**이 필요하다. 왜? AI가 실수로 중요한 파일을 지우면 큰일이니까.

| 모드 | 비유 | 설명 |
|------|------|------|
| **Normal** | 학생이 매번 선생님께 허락 받기 | 파일 수정, 명령 실행 전에 매번 물어봄 |
| **Plan** | 읽기만 가능한 도서관 모드 | 코드를 읽고 계획만 세움. 수정 불가 |
| **Auto-accept** | 숙제는 알아서, 외출은 물어보기 | 파일 읽기/쓰기는 자동, 위험한 명령만 물어봄 |
| **Bypass** | 완전 자유 | 아무 확인 없이 전부 실행. **위험!** CI/CD 전용 |

```bash
# 모드 전환 예시
/plan          # 계획 모드로 전환
/autoaccept    # 자동 승인 모드로 전환
```

### 개념 4: 서브에이전트 (Sub-agents)

> AI가 자기 밑에 또 다른 AI를 만들어서 일을 분담하는 것

회사에서 팀장이 팀원에게 업무를 나눠주는 것과 같다.

```
[메인 에이전트 (팀장)]
├── 서브에이전트 1: "API 엔드포인트 분석해줘" (연구 담당)
├── 서브에이전트 2: "테스트 파일 검색해줘" (탐색 담당)
└── 서브에이전트 3: "코드 리뷰해줘" (검토 담당)
```

각 서브에이전트는 **독립적인 컨텍스트 윈도우**를 가진다. 팀장의 메모리를 공유하지 않으므로, 한 에이전트가 많은 파일을 읽어도 다른 에이전트에게 영향을 주지 않는다.

### 개념 5: 도구(Tools)

Claude Code가 사용할 수 있는 **행동 수단**:

| 도구 | 하는 일 | 예시 |
|------|---------|------|
| **Read** | 파일 읽기 | `Read("src/app.tsx")` |
| **Edit** | 파일 특정 부분 수정 | `Edit("src/app.tsx", old, new)` |
| **Write** | 새 파일 생성 | `Write("src/utils.ts", content)` |
| **Bash** | 터미널 명령 실행 | `Bash("npm test")` |
| **Glob** | 파일 패턴 검색 | `Glob("src/**/*.tsx")` |
| **Grep** | 코드 내용 검색 | `Grep("TODO", "src/")` |
| **Task** | 서브에이전트 생성 | `Task("코드 분석해줘")` |

---

## 제5장. 기억 시스템 — CLAUDE.md

### AI에게 기억력을 주다

기본적으로 AI는 대화가 끝나면 모든 것을 잊는다. 다음 대화에서 같은 설명을 또 해야 한다. CLAUDE.md는 이 문제를 해결한다.

### 6단계 기억 계층

```
우선순위 높음
┌────────────────────────────────────┐
│ 1. 프로젝트 CLAUDE.md              │  팀 전체 규칙
│    (예: "React 19 + TypeScript 사용") │
├────────────────────────────────────┤
│ 2. 사용자 CLAUDE.md                │  개인 습관
│    (~/.claude/CLAUDE.md)            │
├────────────────────────────────────┤
│ 3. 플러그인 CLAUDE.md              │  플러그인별 규칙
├────────────────────────────────────┤
│ 4. Auto-Memory (MEMORY.md)         │  Claude가 스스로 학습한 것
├────────────────────────────────────┤
│ 5. 대화 히스토리                    │  현재 세션 대화
├────────────────────────────────────┤
│ 6. 자동 압축 요약                   │  대화가 길어지면 자동 요약
└────────────────────────────────────┘
우선순위 낮음
```

### 파일 위치와 역할

```
프로젝트 폴더/
├── CLAUDE.md              팀 전체가 공유 (git에 커밋)
├── CLAUDE.local.md        나만의 설정 (git 무시됨)
├── .claude/
│   └── rules/             모듈형 규칙 (v2.0+)
│       ├── testing.md
│       └── style.md

~/.claude/                 내 컴퓨터 전체에 적용
├── CLAUDE.md              모든 프로젝트 공통 규칙
├── rules/                 모듈형 글로벌 규칙
└── projects/
    └── <해시>/
        └── MEMORY.md      Claude가 알아서 적는 메모
```

### 잘 쓴 CLAUDE.md 예시

```markdown
# 프로젝트: 우리 학교 급식 앱

## 기술 스택
- React 19 + TypeScript
- Tailwind CSS v4
- Supabase (데이터베이스)

## 규칙
- 컴포넌트 파일명은 PascalCase (예: MealCard.tsx)
- API 호출은 반드시 src/lib/api.ts를 통해서
- 한국어 주석 사용
- console.log는 커밋 전에 반드시 제거

## 폴더 구조
- src/app/ — 페이지
- src/components/ — UI 컴포넌트
- src/lib/ — 유틸리티

## 자주 하는 실수 (오답 노트)
- Tailwind v4에서는 @theme inline을 쓰지 말 것
- Supabase RLS 정책 설정 시 public.profiles로 정규화된 이름 사용
```

### CLAUDE.md 작성 꿀팁

1. **30~100줄 유지** — 너무 길면 AI가 중요한 것을 놓침
2. **WHAT + WHY + HOW** — 무엇을(기술), 왜(목적), 어떻게(워크플로우)
3. **오답 노트 추가** — Claude가 실수할 때마다 규칙을 추가
4. **`/init` 명령** — 프로젝트를 분석해서 자동으로 CLAUDE.md 초안을 생성

```bash
# 자동 생성
claude
> /init
# Claude가 프로젝트를 분석하고 CLAUDE.md를 만들어줌
```

---

## 제6장. 훅(Hooks) — 자동화의 핵심

### 훅이 뭐야?

> 특정 이벤트가 발생했을 때 **자동으로 실행되는 명령**

비유: 집에 들어오면(이벤트) → 현관등이 자동으로 켜진다(훅).

Claude Code에서: 파일을 수정하면(이벤트) → 자동으로 코드 포맷팅이 실행된다(훅).

### 훅 이벤트 종류

| 이벤트 | 언제 발생 | 실생활 비유 |
|--------|----------|------------|
| `SessionStart` | Claude를 시작할 때 | 학교 도착 → 출석체크 |
| `PreToolUse` | 도구 사용 직전 | 시험지 제출 전 → 이름 확인 |
| `PostToolUse` | 도구 사용 직후 | 요리 후 → 설거지 |
| `Stop` | 작업 완료 시 | 하교 시 → 사물함 정리 |
| `UserPromptSubmit` | 사용자가 입력할 때 | 질문 전 → 손 들기 |

### 실전 예제 1: 파일 저장 시 자동 포맷팅

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATHS"
          }
        ]
      }
    ]
  }
}
```

**해석**: Claude가 `Edit`이나 `Write` 도구를 사용한 **직후(PostToolUse)**, 수정된 파일에 대해 **Prettier**(코드 정리 도구)를 자동 실행한다.

### 실전 예제 2: 위험한 명령 차단

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/block-dangerous.py"
          }
        ]
      }
    ]
  }
}
```

`block-dangerous.py`:
```python
import json, sys

# Claude가 실행하려는 명령 읽기
data = json.loads(sys.stdin.read())
command = data.get("tool_input", {}).get("command", "")

# rm -rf (전체 삭제) 명령이 포함되어 있으면 차단!
if "rm -rf" in command:
    print(json.dumps({
        "decision": "deny",
        "reason": "위험한 삭제 명령은 차단됩니다!"
    }))
else:
    print(json.dumps({"decision": "allow"}))
```

### 실전 예제 3: 작업 끝나면 자동으로 테스트

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npm test 2>&1 | head -20"
          }
        ]
      }
    ]
  }
}
```

Claude가 작업을 끝낼 때마다 **자동으로 테스트**가 돌아간다. 테스트가 실패하면 Claude가 그것을 보고 수정한다.

### 훅 vs CLAUDE.md

| | CLAUDE.md | Hooks |
|---|-----------|-------|
| 성격 | **제안** | **강제** |
| 실행 | AI가 판단 | 무조건 실행 |
| 예시 | "코드 저장 후 린트 돌려" | 코드 저장 → 린트 자동 실행 |
| 실패 가능성 | AI가 가끔 잊음 | 0% (코드니까) |

**핵심 원칙**: 반드시 실행되어야 하는 건 Hook, 참고만 하면 되는 건 CLAUDE.md.

---

## 제7장. 플러그인 — 나만의 확장

### 플러그인이 뭐야?

> Claude Code에 **새로운 기능을 추가하는 확장팩**

스마트폰의 앱스토어에서 앱을 깔듯이, Claude Code에도 기능을 추가할 수 있다.

2026년 2월 기준 **9,000개 이상**의 플러그인이 있다.

### 플러그인의 5가지 구성요소

```
나의-플러그인/
├── .claude-plugin/
│   └── plugin.json        플러그인 정보 (이름, 버전, 설명)
│
├── commands/              슬래시 명령어
│   └── deploy.md            /deploy 명령 정의
│
├── agents/                커스텀 에이전트
│   └── reviewer.md          코드 리뷰 전문 에이전트
│
├── skills/                스킬 (지식 + 행동 패턴)
│   └── react-best/
│       └── SKILL.md         React 베스트 프랙티스
│
├── hooks/                 자동화 훅
│   └── hooks.json
│
└── .mcp.json              외부 서비스 연결
```

### 각 구성요소를 쉽게 비유하면

| 구성요소 | 비유 | 역할 |
|----------|------|------|
| **Command** | TV 리모컨 버튼 | 사용자가 `/명령` 으로 실행 |
| **Agent** | 전문가 팀원 | 특정 분야에 특화된 AI |
| **Skill** | 참고서/교과서 | 지식과 행동 가이드 |
| **Hook** | 자동 센서 | 이벤트 발생 시 자동 실행 |
| **MCP** | 전화 연결 | 외부 서비스(GitHub, Slack 등) 연동 |

### 실전: 간단한 플러그인 만들기

**목표**: `/morning` 치면 아침에 할 일 체크리스트를 보여주는 플러그인

**1단계: 폴더 만들기**
```bash
mkdir -p my-morning-plugin/.claude-plugin
mkdir -p my-morning-plugin/commands
```

**2단계: plugin.json 작성**
```json
{
  "name": "morning-checklist",
  "version": "1.0.0",
  "description": "아침 루틴 체크리스트를 보여주는 플러그인",
  "commands": "./commands/"
}
```

**3단계: 명령어 작성** (`commands/morning.md`)
```markdown
아침 개발 루틴 체크리스트를 실행해줘:

1. `git pull` 로 최신 코드 받기
2. `npm install` 로 의존성 업데이트 확인
3. `npm test` 로 테스트 상태 확인
4. 어제 커밋 내역 요약

각 단계의 결과를 간략히 보고해줘.
```

**4단계: 사용**
```bash
claude --plugin-dir ./my-morning-plugin
> /morning
```

### 플러그인 설치하기

```bash
# 마켓플레이스에서 설치
/plugin install context7@claude-plugins-official

# 인기 플러그인 예시
/plugin install sentry          # 에러 모니터링
/plugin install pr-review-toolkit  # PR 리뷰 자동화
/plugin install playwright      # 브라우저 테스트
```

---

## 제8장. MCP — 외부 세계와 연결

### MCP가 뭐야?

> **Model Context Protocol** — AI가 외부 서비스와 소통하는 표준 규격

비유: USB가 모든 기기를 컴퓨터에 연결하는 **표준 포트**이듯, MCP는 AI가 GitHub, Slack, 데이터베이스 등 모든 서비스에 연결하는 **표준 프로토콜**.

```
[MCP 없이]
Claude ---- GitHub (별도 설정 필요)
Claude ---- Slack (또 다른 설정)
Claude ---- DB (또 또 다른 설정)

[MCP 있으면]
Claude ---- MCP ---+--- GitHub
                   +--- Slack
                   +--- DB
                   +--- 무엇이든!
```

### 설정 방법

`.mcp.json` 파일 하나면 된다:

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN"
      }
    },
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["@anthropic-ai/mcp-server-filesystem", "/home/user/projects"]
    }
  }
}
```

### 사용 예시

MCP를 설정하면, Claude에게 이렇게 말할 수 있다:

```
> GitHub에서 내 레포의 열린 이슈 목록을 가져와줘
> 이슈 #42번의 내용을 읽고 해결 방안을 제안해줘
> PR을 만들어서 이 수정사항을 올려줘
```

Claude가 **직접 GitHub API를 호출**해서 처리한다.

### MCP 도구의 이름 규칙

```
mcp__서버이름__도구이름

예시:
mcp__github__search_repositories    GitHub 레포 검색
mcp__github__create_pull_request    PR 생성
mcp__slack__send_message            Slack 메시지 전송
```

### 인기 MCP 서버 (2026년 2월 기준)

| MCP 서버 | 하는 일 |
|----------|---------|
| GitHub | 이슈, PR, 코드 검색 |
| Slack | 메시지 읽기/보내기 |
| PostgreSQL | 데이터베이스 쿼리 |
| Playwright | 브라우저 자동화 |
| Google Drive | 문서 읽기/쓰기 |
| Firebase | 앱 배포/관리 |
| Sentry | 에러 모니터링 |
| Context7 | 최신 라이브러리 문서 검색 |

---

## 제9장. Agent SDK — 나만의 AI 만들기

### Agent SDK란?

> Claude Code의 엔진을 가져다가 **나만의 AI 앱**을 만드는 개발 키트

비유: Claude Code가 **완제품 자동차**라면, Agent SDK는 **자동차 엔진**이다. 이 엔진으로 트럭도, 버스도, 스포츠카도 만들 수 있다.

### 왜 필요해?

| Claude Code 그대로 사용 | Agent SDK로 커스텀 |
|-------------------------|-------------------|
| 터미널에서 대화 | 웹앱, 모바일앱에 AI 내장 |
| 범용 코딩 도우미 | 특화된 AI (예: 코드 리뷰 봇) |
| 수동 실행 | 자동화/배치 처리 |
| 개인 사용 | 서비스/제품으로 배포 |

### TypeScript 예제: 간단한 코드 분석기

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

// Claude Code의 두뇌를 사용하는 나만의 코드 분석기
async function analyzeCode(filePath: string) {
  const messages = [];

  for await (const message of query({
    prompt: `${filePath} 파일을 분석하고:
      1. 버그가 있는지 확인
      2. 성능 개선점 제안
      3. 보안 취약점 체크`,
    options: {
      maxTurns: 10,  // 최대 10번까지 도구 사용
    }
  })) {
    if (message.type === 'assistant') {
      messages.push(message.content);
    }
  }

  return messages.join('\n');
}

// 실행
const result = await analyzeCode('src/app.tsx');
console.log(result);
```

### Python 예제: PR 자동 리뷰 봇

```python
from anthropic_agent_sdk import query

async def review_pr(pr_number: int):
    """GitHub PR을 자동으로 리뷰하는 봇"""
    prompt = f"""
    GitHub PR #{pr_number}을 리뷰해줘:
    - 코드 품질 확인
    - 버그 가능성 체크
    - 테스트 커버리지 확인
    - 개선 제안
    """

    async for message in query(
        prompt=prompt,
        setting_sources=["project"],  # 프로젝트 CLAUDE.md 규칙 적용
    ):
        print(message)
```

### Agent SDK의 강점

| 기능 | 일반 AI API | Agent SDK |
|------|------------|-----------|
| 파일 읽기/쓰기 | 직접 구현 | 내장 |
| 터미널 명령 실행 | 직접 구현 | 내장 |
| MCP 연결 | 없음 | 내장 |
| 서브에이전트 | 없음 | 내장 |
| 자동 컨텍스트 관리 | 없음 | 내장 |
| 플러그인 지원 | 없음 | 내장 |

---

## 제10장. 멀티에이전트 팀 — AI 팀을 구성하다

### 개념

> 하나의 Claude가 아니라, **여러 Claude가 팀을 이루어** 일하는 것

비유: 혼자서 조별과제 전부 하는 것 vs. 각자 역할을 나눠서 동시에 하는 것.

### 구조

```
[리드 에이전트 — 팀장]
    │
    ├── [팀원 1: 프론트엔드]  독립 컨텍스트
    ├── [팀원 2: 백엔드]     독립 컨텍스트
    └── [팀원 3: 테스트]     독립 컨텍스트
```

각 팀원은:
- **독립적인 기억**을 가짐 (서로의 파일 읽기 결과를 공유하지 않음)
- **독립적인 작업 공간** (git worktree로 격리)
- **인박스**를 통해 서로에게 메시지를 보낼 수 있음

### 실전 예제

```bash
# 환경변수 설정으로 활성화
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1

# Claude 실행
claude

# 팀 작업 지시
> 이 프로젝트에 다크모드를 추가하려고 해.
> - 팀원 1: CSS 변수 시스템 설계
> - 팀원 2: 토글 컴포넌트 구현
> - 팀원 3: 기존 컴포넌트 색상 마이그레이션
> 동시에 진행해줘.
```

### 실화: 10만 줄 C 컴파일러

Anthropic의 실제 사례:
- **16개 에이전트**가 팀으로 작업
- 약 **2,000번의 세션** 동안 협업
- 결과: **10만 줄 Rust 코드**로 된 C 컴파일러
- Linux 커널 6.9를 x86, ARM, RISC-V 세 아키텍처에서 빌드 성공
- 비용: 약 **$20,000** (약 2,800만원)

### 팀 운영 팁

| 팁 | 이유 |
|----|------|
| 3~5명이 적절 | 너무 많으면 조율 비용 증가 |
| 명확한 역할 분담 | "프론트엔드 담당" 처럼 구체적으로 |
| 독립적인 작업 단위 | 서로 같은 파일을 건드리면 충돌 |
| 비용 주의 | 에이전트 수 x 비용. 5명이면 5배 |

---

## 제11장. 실전 워크플로우 10가지

### 워크플로우 1: 새 프로젝트 시작

```bash
claude
> /init
# CLAUDE.md 자동 생성
> 이 프로젝트에 React 19 + TypeScript + Tailwind v4 보일러플레이트를 세팅해줘
```

### 워크플로우 2: 버그 수정

```bash
> 로그인 페이지에서 이메일 입력 후 엔터를 치면 페이지가 새로고침돼.
> 원인을 찾고 수정해줘.
```

Claude가 알아서: 파일 검색 → 원인 분석(form의 onSubmit에 preventDefault 누락) → 수정 → 테스트

### 워크플로우 3: PR(Pull Request) 리뷰

```bash
> /review
# 또는
> 이 PR의 변경사항을 리뷰해줘. 버그, 보안, 성능 관점으로.
```

### 워크플로우 4: 테스트 작성

```bash
> src/lib/utils.ts의 모든 함수에 대한 유닛 테스트를 작성해줘.
> 경계값과 에러 케이스를 포함해줘.
```

### 워크플로우 5: 커밋 + PR + 배포 자동화

```bash
> 변경사항을 커밋하고, PR을 만들고, Vercel에 배포해줘.
```

이걸 **슬래시 명령어**로 만들 수 있다:

`.claude/commands/ship.md`:
```markdown
아래 순서로 진행해줘:
1. git status로 변경사항 확인
2. 변경사항을 적절한 커밋 메시지로 커밋
3. 현재 브랜치를 원격에 push
4. PR 생성 (제목은 변경 내용 요약)
5. npx vercel --prod로 배포

각 단계 완료 시 결과를 알려줘.
```

사용: `/ship`

### 워크플로우 6: 레거시 코드 리팩토링

```bash
> src/components/Dashboard.tsx가 500줄이 넘어.
> 적절한 단위로 분리하되, 기존 기능은 100% 유지해줘.
> Plan mode로 먼저 계획을 세워줘.
```

### 워크플로우 7: API 엔드포인트 추가

```bash
> /api/meals 엔드포인트를 만들어줘.
> GET: 급식 목록 조회 (날짜 필터 지원)
> POST: 새 급식 등록 (관리자만)
> 기존 API 패턴을 따르고, Zod로 입력 검증해줘.
```

### 워크플로우 8: 문서 생성

```bash
> src/lib/ 폴더의 모든 유틸리티 함수에 대한 API 문서를 생성해줘.
> 각 함수의 파라미터, 반환값, 사용 예제를 포함해줘.
```

### 워크플로우 9: 성능 최적화

```bash
> 이 페이지의 Lighthouse 점수가 60점이야.
> 코드를 분석하고 성능 병목을 찾아서 90점 이상으로 만들어줘.
```

### 워크플로우 10: 다국어(i18n) 적용

```bash
> 이 앱에 한국어/영어 다국어를 적용해줘.
> 기존 하드코딩된 텍스트를 모두 추출하고,
> src/data/i18n/ 폴더에 ko.json, en.json으로 정리해줘.
```

---

## 제12장. 경쟁 도구 비교

### 한눈에 비교

| 항목 | Claude Code | GitHub Copilot | Cursor | Windsurf |
|------|------------|----------------|--------|----------|
| **타입** | CLI(터미널) | IDE 플러그인 | AI IDE | AI IDE |
| **핵심 능력** | 자율 실행, 대규모 맥락 | 코드 자동완성 | 멀티파일 편집 | 플로우 기반 |
| **컨텍스트** | 200K 토큰 | ~64K 토큰 | ~128K 토큰 | ~128K 토큰 |
| **자율 실행** | 완전 | 없음 | 제한적 | 제한적 |
| **인라인 완성** | 없음 | 최강 | 강함 | 있음 |
| **가격/월** | $20~$200 | $10~$19 | 무료~$40 | 무료~$60 |
| **최적 용도** | 아키텍처, 리뷰, 복잡한 작업 | 빠른 코딩, 반복 작업 | 신규 개발, 편집 | 일반 개발 |

### 2026년 개발자들의 선택

많은 전문 개발자들의 결론:

> **"최고의 개발자는 AI 도구를 레고 블록처럼 조합한다."**

- **일상적인 코딩** → Copilot (빠른 자동완성)
- **새 기능 개발** → Cursor (멀티파일 편집)
- **코드 리뷰/아키텍처/복잡한 리팩토링** → Claude Code (깊은 사고)
- **배포/자동화/CI/CD** → Claude Code (자율 실행)

---

## 제13장. 실제 사례와 숫자들

### Anthropic 회사 자체

| 지표 | 수치 |
|------|------|
| Claude Code 연매출 | $1B+ (약 1.4조원) |
| Anthropic 전체 연매출 | $5B+ (약 7조원) |
| 기업가치 | $380B (약 530조원) |
| 포춘 100 사용률 | 70% |
| 주간 코드 생성량 | 1억 9,500만 줄 |
| 활성 개발자 수 | 115,000명+ |

### 유명 사용 사례

**1. Spotify**
- 엔지니어링 시간 **90% 절감**
- 월 **650개 이상** AI 코드 변경 배포

**2. Epic Games**
- 사용자의 **절반 이상이 비개발자**
- 기획자, 디자이너가 직접 Claude Code로 프로토타입 제작

**3. 보리스 체르니 (Claude Code 창시자)**
- 30일간: **259개 PR**, **497개 커밋**, +40,000 / -38,000 줄
- 모든 코드를 Claude Code + Opus 모델로 작성

**4. Jaana Dogan (Google Gemini API 리드)**
- Google 팀 전체가 2024년 내내 반복 개발한 분산 에이전트 시스템을
- Claude Code로 **60분 만에** 재현

**5. PM이 만든 iOS 앱**
- 개발 경험 없는 프로덕트 매니저가
- Claude Code를 사용해 2개월 만에 iOS 앱 "Little Explorer" 출시

**6. Claude Cowork**
- 4명의 엔지니어가 10일 만에 제작
- 코드 대부분을 Claude Code가 작성 — "vibe coded"라고 공식 인정

---

## 제14장. 한계와 주의점

### 솔직한 한계들

#### 1. 비용이 비쌈
```
무료 사용자: 없음
Pro ($20/월): 기본 사용량
Team ($60/월): 팀 기능 + 더 많은 사용량
Enterprise ($200/월): 최대 사용량

주의: 에이전트 팀 사용 시 비용이 에이전트 수만큼 배가됨
주의: 사용량은 5시간마다 리셋. 웹/모바일/CLI 합산
```

#### 2. 기억력 한계
- 세션 간 기억 없음 (CLAUDE.md로 보완해야 함)
- 긴 대화에서 "중간을 잊는" 현상 발생
- 자동 압축 시 가끔 중요 정보 손실

#### 3. 처음부터 완벽한 앱은 어려움
- 기존 코드를 수정/개선하는 데 탁월
- 하지만 처음부터 전체 아키텍처를 완벽하게 짜는 건 아직 어려움
- **해결법**: Plan Mode로 설계 → 단계별 구현

#### 4. IDE 지원 한계
- VS Code, JetBrains만 공식 지원
- Vim, Neovim, Sublime, Emacs는 미지원
- 웹 IDE (Replit, CodeSandbox 등) 미지원

#### 5. 인라인 코드 완성 없음
- 코드 치다가 자동으로 다음 줄을 제안해주는 기능 없음
- 이건 Copilot/Cursor가 압도적으로 유리
- Claude Code는 **대화형**이므로 성격이 다름

### 현명한 사용 팁

| 하지 말 것 | 대신 할 것 |
|-----------|-----------|
| "이 앱 전부 만들어" | "먼저 구조 설계해줘" → 검토 → "이 부분 구현해줘" |
| CLAUDE.md 200줄 이상 작성 | 30~100줄로 핵심만 |
| Bypass 모드 항상 켜두기 | 작업 시 Normal, 필요할 때만 Auto-accept |
| 한 세션에서 3시간+ 작업 | `/compact` 자주 사용, 새 세션 시작 |
| 결과 검토 없이 배포 | 항상 Plan Mode로 검토 후 실행 |

---

## 제15장. 미래 — 어디로 가고 있는가

### 이미 진행 중인 것들 (2026년 초)

1. **Claude Cowork** — 코딩 외 일반 업무(문서 작성, 데이터 분석, 이메일)까지 확장
2. **엔터프라이즈 마켓플레이스** — 회사별 내부 플러그인 생태계
3. **100만 토큰 컨텍스트** — 베타 테스트 중. 소설책 10권 분량을 한 번에 이해
4. **세션 텔레포트** — 터미널에서 시작한 작업을 웹(claude.ai/code)에서 이어하기
5. **브라우저 제어** — Claude가 Chrome 브라우저를 직접 조작
6. **Analytics API** — 사용량, 비용, 생산성을 데이터로 측정

### 예측되는 미래

| 시기 | 예측 |
|------|------|
| 2026년 중반 | 100만 토큰 정식 출시, 더 많은 IDE 지원 |
| 2026년 하반기 | AI 팀이 전체 프로젝트를 자율적으로 완성하는 수준 |
| 2027년 | 코딩과 비코딩의 경계 소멸. "생각하면 실행되는" 인터페이스 |

### Anthropic의 비전

> "우리는 모든 사람이 자신만의 커스텀 에이전트를 갖게 될 것이라고 믿는다."
> — Anthropic 제품 책임자

코딩을 몰라도, 자연어로 원하는 것을 설명하면 AI가 만들어주는 시대.
Claude Code는 그 시대의 **첫 번째 도구**다.

---

## 부록 A. 슬래시 명령어 전체 목록

| 명령어 | 설명 |
|--------|------|
| `/help` | 도움말 |
| `/init` | 프로젝트 CLAUDE.md 자동 생성 |
| `/compact [주제]` | 대화 압축 (메모리 절약) |
| `/cost` | 토큰 사용량 및 예상 비용 확인 |
| `/clear` | 대화 기록 초기화 |
| `/model` | AI 모델 전환 (Sonnet/Opus/Haiku) |
| `/config` | 설정 패널 열기 |
| `/add-dir` | 추가 폴더를 컨텍스트에 포함 |
| `/context` | 컨텍스트 윈도우 사용량 확인 |
| `/memory` | 메모리 파일 편집 |
| `/login` | API 인증 |
| `/logout` | 로그아웃 |
| `/mcp` | MCP 서버 관리 |
| `/hooks` | 훅 설정 (인터랙티브) |
| `/doctor` | 진단 도구 (문제 해결) |
| `/review` | 코드 리뷰 요청 |
| `/plugin` | 플러그인 관리 |
| `/plan` | 계획 모드 전환 |

### 커스텀 슬래시 명령어 만들기

```
# 프로젝트 전용 (팀 공유 가능)
.claude/commands/fix-issue.md  ->  /fix-issue

# 개인 전용 (모든 프로젝트)
~/.claude/commands/morning.md  ->  /morning

# 인자 전달
> /fix-issue 42
# $ARGUMENTS에 "42"가 들어감
```

`.claude/commands/fix-issue.md`:
```markdown
GitHub 이슈 #$ARGUMENTS 를 확인하고:
1. 이슈 내용 파악
2. 관련 코드 찾기
3. 수정 사항 구현
4. 테스트 통과 확인
5. PR 생성
```

---

## 부록 B. 환경변수 주요 목록

| 변수명 | 역할 | 기본값 |
|--------|------|--------|
| `ANTHROPIC_API_KEY` | API 키 | - |
| `CLAUDE_MODEL` | 사용할 모델 | sonnet |
| `MAX_MCP_OUTPUT_TOKENS` | MCP 출력 한도 | 25,000 |
| `ENABLE_TOOL_SEARCH` | 도구 검색 활성화 | true |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | 멀티에이전트 팀 | false |

---

## 부록 C. 추천 학습 자료

### 공식 문서
- [Claude Code 공식 문서](https://docs.anthropic.com/en/docs/claude-code/overview)
- [훅 가이드](https://code.claude.com/docs/en/hooks-guide)
- [메모리 가이드](https://code.claude.com/docs/en/memory)
- [플러그인 가이드](https://code.claude.com/docs/en/plugins)
- [Agent SDK](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-overview)
- [MCP 가이드](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [에이전트 팀](https://code.claude.com/docs/en/agent-teams)

### 유튜브 (난이도순)
1. **Sabrina Ramonov** — 완전 초보용. 설치부터 첫 사용까지
2. **Peter Yang** — 15분 만에 영화 앱 만들기 (초보)
3. **Indy Dev Dan** — "내가 실제로 Claude Code를 쓰는 방법" (중급)
4. **Nick Saraev** — 4시간 마스터클래스. 에이전트 팀, MCP, 배포 (고급)

### 커뮤니티
- [awesome-claude-code (GitHub)](https://github.com/hesreallyhim/awesome-claude-code) — 스킬, 훅, 플러그인 모음
- [ClaudeLog](https://claudelog.com/) — 뉴스 및 가이드
- [r/ClaudeAI (Reddit)](https://reddit.com/r/ClaudeAI) — 커뮤니티 토론

---

## 에필로그: 이 책을 읽은 당신에게

Claude Code를 이해한다는 건, 단순히 도구 하나를 배운 게 아니다.

당신은 이제 이것을 알고 있다:
- **에이전틱 AI**가 무엇이고 왜 중요한지
- **기억 시스템**(CLAUDE.md)으로 AI를 훈련하는 법
- **훅**으로 자동화를 구축하는 법
- **플러그인**으로 확장하는 법
- **MCP**로 외부 서비스와 연결하는 법
- **Agent SDK**로 나만의 AI를 만드는 법
- **멀티에이전트 팀**으로 복잡한 프로젝트를 운영하는 법

이건 "코딩 도구 사용법"이 아니라, **AI 시대의 소프트웨어 개발 패러다임**을 이해한 것이다.

> 도구는 바뀌지만, 원리는 남는다.
> 이 책에서 배운 것들은 Claude Code가 아닌 다른 AI 도구에서도 적용된다.

---

*2026년 2월 26일 작성 | jasonmoon.dev*
*리서치 소스: Anthropic 공식 문서, GitHub, VentureBeat, TechCrunch, SemiAnalysis, Hacker News, Reddit 외 30+ 소스*
