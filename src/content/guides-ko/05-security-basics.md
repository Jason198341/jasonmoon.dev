---
title: "비밀번호를 코드에 절대 쓰지 마세요"
description: "API 키, 비밀번호, 시크릿이 소스 코드에 있으면 시한폭탄입니다. 왜 위험한지, 안전하게 하는 법을 알려드릴게요."
emoji: "\U0001F512"
category: security
difficulty: easy
order: 5
---

## 이런 코드 본 적 있나요?

```javascript
const API_KEY = "sk-abc123secretkey456"
const ADMIN_PASSWORD = "myS3cretP@ss!"
```

비밀 값을 코드에 직접 쓰는 것을 **하드코딩**이라고 합니다.

**이러면 큰일 납니다.** 이유를 알려드릴게요.

## 이유 1: GitHub은 기본이 공개

코드를 GitHub에 푸시하면 기본 공개 설정은 **public**입니다. 인터넷의 모든 사람이 코드를 볼 수 있습니다.

```
나: API 키를 코드에 하드코딩
나: git push (GitHub에 업로드)
해커: GitHub에서 "API_KEY" 검색
해커: 내 키 발견 → 내 이름으로 API 호출 10,000번
나: 다음 달 청구서 — 500만원
```

**이거 실제로 일어납니다.** GitHub에서 유출된 API 키를 찾는 봇이 24시간 돌아가고 있습니다.

## 이유 2: 브라우저는 다 보여줌

프론트엔드 코드(React, Vue 등)는 **사용자의 브라우저**에서 실행됩니다.

아무나 F12 (개발자 도구) → Sources 탭 → 자바스크립트 번들 검색 → 하드코딩한 모든 문자열을 찾을 수 있습니다.

```
사용자: F12 → Sources → bundle.js → 검색
→ "myS3cretP@ss!" 발견
→ 관리자 비밀번호 유출. 게임 오버.
```

## 그러면 어떻게 해야 해?

### 방법 1: 환경 변수 (.env 파일)

비밀 값을 별도의 `.env` 파일에 저장하고 **GitHub에 절대 올리지 않습니다**.

```
# .env 파일 (내 컴퓨터에만 존재)
VITE_API_KEY=sk-abc123secretkey456
```

```javascript
// 코드에서는 이렇게 접근
const apiKey = import.meta.env.VITE_API_KEY
```

`.gitignore` 파일에 `.env`를 추가해서 Git이 무시하게 합니다:
```
# .gitignore
.env
```

### 방법 2: 서버 측 검증

비밀번호 비교를 프론트엔드에서 하면 안 됩니다. **서버에서** 하세요.

나쁜 예 (누구나 볼 수 있음):
```javascript
// 프론트엔드 코드 — 모두에게 보임!
if (inputPassword === "myS3cretP@ss!") {
  // 접근 허용
}
```

좋은 예 (서버에 숨김):
```javascript
// 프론트엔드: 서버한테 "이거 맞아?"라고 물어봄
const res = await fetch('/api/verify', {
  method: 'POST',
  body: JSON.stringify({ password: inputPassword })
})
```

```javascript
// 서버 코드 — 사용자가 볼 수 없음!
if (hash(inputPassword) === storedHash) {
  // 접근 허용
}
```

서버 코드는 브라우저에서 실행되지 않으니까 F12로 볼 수 없습니다.

### 방법 3: 해싱

비밀번호를 평문으로 저장하는 것도 위험합니다. **해싱**을 사용하세요.

해싱 = 값을 알아볼 수 없는 형태로 변환하는 것:

```
"myS3cretP@ss!" → bcrypt → "$2b$10$xK8f..."
```

이 변환은 **일방향**입니다. 해시에서 원래 비밀번호를 역추적할 수 없습니다.

데이터베이스에는 해시만 저장합니다. 사용자가 로그인하면:
1. 입력값을 해싱
2. 저장된 해시와 비교
3. 일치 = 접근 허용

데이터베이스가 해킹당해도 원래 비밀번호는 안전합니다.

## Supabase를 쓴다면

Supabase에는 **RPC (Remote Procedure Call)** — 서버에서 실행되는 함수가 있습니다.

```sql
-- 서버 측 비밀번호 검증 함수
CREATE FUNCTION verify_password(input_pw text, post_id uuid)
RETURNS boolean AS $$
  SELECT password_hash = crypt(input_pw, password_hash)
  FROM posts WHERE id = post_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

이렇게 하면:
- 비밀번호 비교는 서버에서만 이루어짐
- 클라이언트 코드에 비밀 없음
- 브라우저에서 해킹 불가능

## 푸시 전 체크리스트

GitHub에 코드를 푸시하기 전에 확인하세요:

- [ ] 소스 파일에 API 키가 하드코딩되어 있지 않은가?
- [ ] `.env` 파일이 `.gitignore`에 등록되어 있는가?
- [ ] 프론트엔드 코드에서 비밀번호 비교를 하고 있지 않은가?
- [ ] 비밀번호가 평문이 아닌 해시로 저장되어 있는가?

하나라도 "아니오"면 **지금 고치세요**. 나중이 아니라. 지금.

다음: 데이터베이스가 뭔지, 왜 필요한지, Supabase를 5분 만에 설정하는 법.
