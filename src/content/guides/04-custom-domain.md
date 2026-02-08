---
title: 나만의 도메인 사서 연결하기
description: myapp.vercel.app 대신 myapp.com으로 접속하게 만들기. Namecheap에서 도메인 사서 DNS 설정하는 법.
emoji: "\U0001F3F7\uFE0F"
category: 배포
difficulty: 초급
order: 4
---

## 도메인이 뭐야?

`google.com`, `naver.com` — 이게 도메인이다. 인터넷 세상에서의 **주소**.

Vercel로 배포하면 `myapp.vercel.app` 같은 주소를 공짜로 받는다. 작동은 잘 되지만, 뭔가 "내 것"이 아닌 느낌이지? `vercel.app`이 붙어있으니까.

**자기 도메인**을 사면 `myapp.com`처럼 깔끔해진다. 그리고 진짜 프로페셔널해 보인다.

## 도메인은 어디서 사?

**Namecheap** (namecheap.com)을 추천한다.

왜?
- 가격이 싸다 (.com 기준 연 $10 내외)
- 관리 화면이 심플하다
- 숨겨진 비용이 없다

다른 곳: Google Domains (지금은 Squarespace), GoDaddy, Cloudflare 등도 있다. 어디서 사든 상관없다.

## 실전: 도메인 구매 → 연결

### Step 1: 도메인 구매

1. [namecheap.com](https://namecheap.com) 가입
2. 원하는 이름 검색 (예: `coolapp.com`)
3. 장바구니에 담고 결제 (카드/PayPal)
4. 끝. 이제 `coolapp.com`은 네 거다.

### Step 2: Vercel에 도메인 등록

```
Vercel 대시보드 → 프로젝트 → Settings → Domains
→ "coolapp.com" 입력 → Add
```

Vercel이 **DNS 설정값**을 알려준다. 이런 식으로:

```
Type: A      | Value: 76.76.21.21
Type: CNAME  | Name: www | Value: cname.vercel-dns.com
```

### Step 3: DNS 설정 (이게 핵심!)

**DNS가 뭐냐?**

전화번호부라고 생각해. `coolapp.com`을 치면 실제로 어느 서버로 가야 하는지 알려주는 안내판.

Namecheap에서:
1. Dashboard → Domain List → `coolapp.com` → Manage
2. **Advanced DNS** 탭 클릭
3. 기존 레코드 삭제
4. Vercel이 알려준 대로 추가:

| Type | Host | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

저장하고 **10분~1시간** 기다린다. (DNS가 전 세계에 퍼지는 시간)

### Step 4: 확인

브라우저에 `coolapp.com` 입력 → 네 앱이 뜨면 성공!

HTTPS(자물쇠)도 Vercel이 **자동으로** 설정해준다. 신경 쓸 거 없다.

## 자주 묻는 질문

**"DNS 전파에 얼마나 걸려요?"**
→ 보통 5분~1시간. 드물게 24시간까지. 안 되면 그냥 기다려.

**"www 붙이고 안 붙이고 차이가 뭐예요?"**
→ `coolapp.com`과 `www.coolapp.com` 둘 다 작동하게 설정하는 게 좋다. 위 설정대로 하면 둘 다 된다.

**"도메인 안 사면 안 돼요?"**
→ 안 사도 된다. `myapp.vercel.app`으로도 완벽하게 작동한다. 도메인은 **있으면 좋은 것**이지 필수가 아니다.

**".com 말고 다른 건?"**
→ `.dev`, `.io`, `.app` 같은 것도 있다. 이 사이트도 `jasonmoon.dev`다. 가격은 조금씩 다르다.

## 비용 정리

| 항목 | 비용 | 주기 |
|------|------|------|
| Vercel 호스팅 | 무료 | - |
| .com 도메인 | ~$10 | 연간 |
| HTTPS 인증서 | 무료 (Vercel 자동) | - |

**연 $10이면 나만의 웹사이트 주소를 가질 수 있다.** 스타벅스 커피 두 잔 가격.

다음 글에서는 보안 — **비밀번호를 코드에 쓰면 왜 큰일 나는지** 알려줄게.
