---
title: 비밀번호를 코드에 쓰면 안 되는 이유
description: API 키, 비밀번호, 비밀 설정값을 코드에 직접 쓰면 왜 위험한지. 그리고 안전하게 관리하는 법.
emoji: "\U0001F512"
category: 보안
difficulty: 초급
order: 5
---

## 이런 코드를 본 적 있어?

```javascript
const API_KEY = "sk-abc123secretkey456"
const ADMIN_PASSWORD = "rnrud9881@@HH"
```

이렇게 코드에 비밀번호나 API 키를 직접 적는 걸 **하드코딩**이라고 한다.

**이러면 큰일 난다.** 왜?

## 이유 1: GitHub에 올리면 전 세계가 본다

Git으로 코드를 GitHub에 push하면, 기본 설정이 **public**(공개)이다. 즉, 네 코드를 전 세계 누구나 볼 수 있다.

```
너: API 키를 코드에 적음
너: git push (GitHub에 올림)
해커: GitHub에서 "API_KEY" 검색
해커: 네 키 발견 → 네 이름으로 API 수만 건 호출
너: 다음 달 청구서 $5,000
```

**이건 진짜 일어나는 일이다.** GitHub에서 API 키를 자동으로 스캔하는 봇이 수백 개 돌고 있다.

## 이유 2: 브라우저에서 다 보인다

React 같은 프론트엔드 코드는 결국 **사용자의 브라우저에서 실행**된다.

아무나 F12 (개발자 도구) 열어서 → Sources 탭 → JavaScript 파일을 보면, 네가 적어놓은 비밀번호가 **그대로 보인다.**

```
사용자: F12 → Sources → bundle.js 검색
→ "rnrud9881@@HH" 발견
→ 관리자 비밀번호 탈취 완료
```

## 그러면 어떻게 해야 해?

### 방법 1: 환경 변수 (.env 파일)

비밀 값을 `.env`라는 별도 파일에 저장하고, **이 파일은 절대 GitHub에 올리지 않는다**.

```
# .env 파일 (내 컴퓨터에만 있음)
VITE_API_KEY=sk-abc123secretkey456
```

```javascript
// 코드에서는 이렇게 가져다 씀
const apiKey = import.meta.env.VITE_API_KEY
```

`.gitignore` 파일에 `.env`를 추가하면 Git이 이 파일을 무시한다:
```
# .gitignore
.env
```

### 방법 2: 서버 사이드 검증

비밀번호를 코드(프론트엔드)에서 비교하면 안 된다. **서버에서 비교**해야 한다.

나쁜 예:
```javascript
// 프론트엔드 코드 — 누구나 볼 수 있음!
if (inputPassword === "rnrud9881@@HH") {
  // 통과
}
```

좋은 예:
```javascript
// 프론트엔드: 서버한테 "이 비번 맞아?" 물어보기만 함
const res = await fetch('/api/verify', {
  method: 'POST',
  body: JSON.stringify({ password: inputPassword })
})
```

```javascript
// 서버 코드 — 사용자가 볼 수 없음!
if (hash(inputPassword) === storedHash) {
  // 통과
}
```

서버 코드는 사용자 브라우저에서 실행되지 않으니까, F12를 열어도 볼 수 없다.

### 방법 3: 해시 (Hash)

비밀번호를 그대로 저장하는 것도 위험하다. **해시**라는 걸 쓴다.

해시란? 원본을 알아볼 수 없게 변환하는 것.

```
"rnrud9881@@HH" → bcrypt → "$2b$10$xK8f..."
```

이 변환은 **한 방향**이다. 해시값을 보고 원래 비밀번호를 알아내는 건 거의 불가능하다.

데이터베이스에는 해시값만 저장하고, 사용자가 비밀번호를 입력하면:
1. 입력값을 해시로 변환
2. 저장된 해시와 비교
3. 같으면 통과

이렇게 하면 데이터베이스가 해킹당해도 원래 비밀번호는 안전하다.

## Supabase를 쓴다면?

Supabase에는 **RPC (Remote Procedure Call)**이라는 기능이 있다. 서버에서 실행되는 함수를 만들 수 있다.

```sql
-- Supabase에서 비밀번호 검증 함수 만들기
CREATE FUNCTION verify_password(input_pw text, post_id uuid)
RETURNS boolean AS $$
  SELECT password_hash = crypt(input_pw, password_hash)
  FROM posts WHERE id = post_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

이렇게 하면:
- 비밀번호는 서버에서만 비교됨
- 클라이언트 코드에 비밀번호 없음
- 해킹 불가

## 체크리스트

코드를 GitHub에 올리기 전에 확인:

- [ ] API 키가 코드에 직접 적혀있지 않은가?
- [ ] `.env` 파일이 `.gitignore`에 추가되어 있는가?
- [ ] 비밀번호 비교를 프론트엔드에서 하고 있지 않은가?
- [ ] 비밀번호를 해시 없이 그대로 저장하고 있지 않은가?

하나라도 "아니오"면, **지금 당장 고쳐라.** 나중에 하면 늦는다.

다음 글에서는 **데이터베이스(Supabase)**가 뭔지, 왜 필요한지, 어떻게 시작하는지 알려줄게.
