---
title: "Microsoft Agent Framework 1.0 GA: Semantic Kernel + AutoGen 통합의 의미"
description: "마이크로소프트가 Semantic Kernel과 AutoGen을 하나로 합친 Microsoft.Agents.AI 1.0을 프로덕션 레디로 릴리스했다. 멀티 프로바이더 추상화 표준의 시작점."
date: "2026-04-20"
category: ai
tags: ["microsoft", "agent-framework", "semantic-kernel", "autogen", "mcp", "multi-provider"]
featured: false
---

## 요약

2026년 4월 3일, Microsoft가 **Microsoft.Agents.AI 1.0**을 프로덕션 레디로 공개했다. 이는 기존 Semantic Kernel과 AutoGen을 병합한 단일 프레임워크이며, .NET/Python에서 동일 API를 제공한다. 두 전임 프로젝트의 GitHub 스타 합산은 **75,000+**로, 마이크로소프트 에이전트 생태계의 사실상 표준으로 자리잡을 기반이 마련됐다.

## 왜 지금 통합인가

Semantic Kernel은 RAG·프롬프트 오케스트레이션에 강했고, AutoGen은 멀티 에이전트 대화와 코드 실행에 강했다. 두 프레임워크는 타겟 유스케이스가 달랐지만 사용자 입장에선 **"둘 중 뭘 먼저 배워야 하냐"**라는 혼란이 지속됐다.

통합 후 Microsoft.Agents.AI의 핵심 기능:

1. **원라인 프로바이더 스왑**: Azure OpenAI / OpenAI / Anthropic Claude / Amazon Bedrock / Google Gemini / Ollama — 6개 프로바이더를 코드 한 줄 변경으로 전환
2. **MCP 풀 서포트**: Model Context Protocol을 1급 시민으로 통합
3. **브라우저 기반 DevUI**: 에이전트 실행, 툴콜, 상태 전이를 실시간 시각화
4. **.NET / Python 대칭 API**: 같은 개념·이름·시그니처를 양쪽에서 유지

## 멀티 프로바이더 추상화: 벤더 락인 종식?

지금까지 에이전트 프레임워크를 고를 때 가장 큰 리스크는 **벤더 락인**이었다. LangChain은 수개월 단위로 API가 바뀌었고, OpenAI의 Agents SDK는 OpenAI 모델에 최적화됐으며, Google Vertex는 Gemini 의존적이었다.

Microsoft.Agents.AI의 접근은 다르다: **프레임워크 계층에서 프로바이더를 완전히 추상화한다.** 코드베이스 한 곳만 바꾸면 Claude에서 Gemini로, Gemini에서 Ollama 로컬 모델로 이동할 수 있다.

이는 세 가지 실질적 가치를 만든다:
- **A/B 테스트 용이성**: 동일 유스케이스에 4개 모델을 병렬로 돌려 비용·품질 비교
- **폴백 전략**: 주 모델 장애 시 세컨더리 프로바이더로 자동 전환
- **컴플라이언스**: EU 규제 때문에 특정 리전 모델만 써야 하는 경우 유연 대응

## Claude를 MS 프레임워크 위에서 돌리는 하이브리드

재미있는 가능성은 **"Anthropic Claude를 Microsoft.Agents.AI 위에서 돌리는 구성"**이다. Claude의 지능과 Microsoft의 엔터프라이즈 인프라(Entra ID 인증, Azure 모니터링, 감사 로그)를 결합할 수 있다. Anthropic의 직접 API는 최신 기능(prompt caching, extended thinking, tool use v2)에서 앞서 있지만, 엔터프라이즈 거버넌스는 마이크로소프트가 여전히 강하다.

## 실행 가능한 인사이트

- **자체 에이전트를 만들고 있다면**: 프레임워크 선택을 한 달만 미루고 Microsoft.Agents.AI를 PoC에 넣어 비교하라. 학습 비용은 낮고 벤더 락인 리스크는 확실히 낮아진다.
- **기존 Semantic Kernel / AutoGen 유저**: 마이그레이션 가이드가 공식 제공된다. 2026년 하반기까지 전환을 완료하는 것이 안전하다.
- **.NET 진영**: 에이전트 프레임워크 선택지가 제한적이었는데, 드디어 Python과 동등한 1급 옵션이 나왔다.
- **전략 관찰**: 75,000 스타를 합친 프레임워크가 MCP를 1급 시민으로 받아들였다는 건 **MCP 생태계 확산이 임계점을 넘었다**는 신호다.

Microsoft.Agents.AI 1.0 GA는 단순 제품 릴리스가 아니다. **"프레임워크 레이어에서 모델이 상품화(commoditized)되는 국면의 시작점"**이다. 이후 개발자가 경쟁력을 갖는 축은 모델이 아니라 "에이전트 설계·툴 설계·프로세스 설계"가 된다.
