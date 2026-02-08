---
title: 내 앱을 인터넷에 올리는 법 (Vercel 배포)
description: 내 컴퓨터에서만 보이던 앱을 전 세계 누구나 접속할 수 있게 만드는 과정. 5분이면 된다.
emoji: "\U0001F310"
category: 배포
difficulty: 초급
order: 3
---

## "localhost"에서 탈출하기

개발할 때 브라우저 주소창에 `localhost:3000` 이런 거 보이잖아. 이건 **내 컴퓨터에서만** 접속 가능한 주소야. 친구한테 "localhost:3000 들어와봐" 해봤자 안 열린다.

**배포(deploy)**는 이걸 `myapp.vercel.app` 같은 진짜 주소로 바꿔서 누구나 접속할 수 있게 만드는 거다.

## Vercel이 뭔데?

네가 만든 웹앱을 올려두는 **무료 호스팅 서비스**.

비유하면: 네가 그림을 그렸어. Vercel은 그 그림을 걸어두는 **전시관**이다. 전시관 주소(URL)를 공유하면 누구든 와서 볼 수 있어.

**왜 Vercel?**
- **무료** (개인 프로젝트는 0원)
- **빠르다** (전 세계에 서버가 있어서 어디서 접속해도 빠름)
- **GitHub이랑 자동 연결** (코드 올리면 자동으로 배포)

## 실전: 5분 배포

### Step 1: Vercel 가입
[vercel.com](https://vercel.com)에서 **GitHub 계정으로 로그인**. 끝.

### Step 2: 프로젝트 연결

방법 A — 웹에서:
1. Vercel 대시보드 → "New Project"
2. GitHub 저장소 선택
3. "Deploy" 클릭
4. 2분 기다리면 URL이 나온다: `https://내프로젝트.vercel.app`

방법 B — 터미널에서 (Claude Code):
```bash
npx vercel --prod
```
이 한 줄이면 끝. 진짜로.

### Step 3: 자동 배포 설정

한 번 연결하면, GitHub에 코드를 push할 때마다 Vercel이 **자동으로 새 버전을 배포**한다.

```
코드 수정 → git push → Vercel이 감지 → 자동 배포 → 새 버전 라이브!
```

매번 배포 버튼을 누를 필요가 없다.

## 환경 변수: 비밀 설정값 넣기

앱에 API 키 같은 비밀 값이 있을 수 있다. 이런 건 코드에 직접 쓰면 안 되고(다음 보안 글에서 자세히 설명), Vercel의 **환경 변수**에 넣는다.

```
Vercel 대시보드 → Settings → Environment Variables
→ Key: VITE_API_KEY
→ Value: abc123xxx (비밀 값)
→ Save
```

코드에서는 이렇게 가져다 쓴다:
```javascript
const apiKey = import.meta.env.VITE_API_KEY
```

코드에는 비밀 값이 없고, Vercel 서버에만 있으니까 안전하다.

## 배포 실패하면?

빨간 글씨로 "Build Failed"가 뜰 수 있다. 당황하지 마.

1. "Logs" 탭 클릭 → 에러 메시지 확인
2. 그 에러 메시지를 AI한테 보여주기
3. AI가 고쳐줌 → 다시 push → 자동 재배포

**90%의 빌드 에러**는 이 세 가지 중 하나다:
- 오타 (파일 이름 대소문자)
- 빠진 패키지 (`npm install` 안 한 것)
- 환경 변수 미설정

## 정리

| 전 | 후 |
|----|-----|
| `localhost:3000` | `myapp.vercel.app` |
| 나만 볼 수 있음 | 전 세계 누구나 접속 |
| 수동 실행 | 자동 배포 |
| 무료 | 여전히 무료 |

다음 글에서는 `myapp.vercel.app` 말고 `myapp.com` 같은 **나만의 도메인**을 사서 연결하는 법을 알려줄게.
