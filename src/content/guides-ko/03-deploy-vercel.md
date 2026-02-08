---
title: "앱을 인터넷에 올리기 (Vercel 배포)"
description: "localhost에서만 돌아가는 앱? 전 세계 누구나 접속할 수 있는 진짜 URL을 만드는 방법. 5분이면 됩니다."
emoji: "\U0001F310"
category: deploy
difficulty: easy
order: 3
---

## localhost 탈출하기

개발할 때 브라우저에 `localhost:3000`이 뜨죠. 이 주소는 **내 컴퓨터에서만** 작동합니다. 친구한테 `localhost:3000`에 접속하라고 하면 아무것도 안 뜹니다.

**배포**란 그걸 `myapp.vercel.app`으로 바꾸는 것 — 누구나 접속할 수 있는 진짜 URL로 만드는 겁니다.

## Vercel이 뭐야?

웹앱을 위한 **무료 호스팅 서비스**입니다.

비유: 그림을 그렸다고 해봐요. Vercel은 그 그림을 걸어두는 **갤러리**입니다. 갤러리 주소(URL)를 공유하면 누구든 와서 볼 수 있죠.

**왜 Vercel?**
- **무료** — 개인 프로젝트는 공짜
- **빠름** — 전 세계 서버로 어디서든 빠르게 로딩
- **GitHub 자동 연동** — 코드 푸시하면 자동 배포

## 실습: 5분 배포

### 1단계: Vercel 가입
[vercel.com](https://vercel.com) → **GitHub 계정으로 로그인**. 끝.

### 2단계: 프로젝트 연결

**방법 A** — 웹에서:
1. Vercel 대시보드 → "New Project"
2. GitHub 저장소 선택
3. "Deploy" 클릭
4. 2분 기다림 → URL 받음: `https://yourproject.vercel.app`

**방법 B** — 터미널에서 (Claude Code):
```bash
npx vercel --prod
```
한 줄. 끝.

### 3단계: 자동 배포

한 번 연결하면, GitHub에 푸시할 때마다 Vercel이 **자동으로 새 버전을 배포**합니다.

```
코드 수정 → git push → Vercel이 감지 → 자동 배포 → 새 버전 라이브!
```

배포 버튼 누를 필요 없음. 영원히.

## 환경 변수: 비밀 값 저장하기

앱에 API 키나 비밀 값이 필요할 수 있습니다. 이런 건 코드에 직접 쓰면 **절대 안 됩니다** (보안 가이드에서 이유를 설명합니다). Vercel의 **환경 변수**에 넣으세요:

```
Vercel 대시보드 → Settings → Environment Variables
→ Key: VITE_API_KEY
→ Value: abc123xxx (비밀 값)
→ Save
```

코드에서는 이렇게 접근:
```javascript
const apiKey = import.meta.env.VITE_API_KEY
```

비밀 값은 Vercel 서버에 있고, 코드에는 없습니다. 안전합니다.

## 배포가 실패하면?

"Build Failed"가 빨간색으로 뜰 수 있어요. 당황하지 마세요.

1. "Logs" 탭 클릭 → 에러 메시지 찾기
2. 에러를 AI한테 보여주기
3. AI가 고침 → 다시 푸시 → 자동 재배포

**배포 에러의 90%**는 이 중 하나:
- 오타 (파일 이름 대소문자)
- 패키지 누락 (`npm install` 안 함)
- 환경 변수 미설정

## 요약

| 이전 | 이후 |
|------|------|
| `localhost:3000` | `myapp.vercel.app` |
| 나만 볼 수 있음 | 전 세계 누구나 |
| 수동 시작 | 자동 배포 |
| 무료 | 여전히 무료 |

다음: `myapp.vercel.app` 대신 `myapp.com`은 어때요? 커스텀 도메인을 사봅시다.
