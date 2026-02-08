---
title: "도메인 구매하고 연결하기"
description: "myapp.vercel.app 대신 myapp.com으로. Namecheap에서 도메인 사서 DNS 설정하고 Vercel에 연결하는 법."
emoji: "\U0001F3F7\uFE0F"
category: deploy
difficulty: easy
order: 4
---

## 도메인이 뭐야?

`google.com`, `github.com` — 이런 게 도메인입니다. 인터넷에서의 **주소**죠.

Vercel은 `myapp.vercel.app`을 무료로 줍니다. 잘 작동하지만, *내 것* 같은 느낌은 안 들죠? `vercel.app`은 남의 브랜드니까.

**커스텀 도메인**은 `myapp.com`을 뜻합니다 — 깔끔하고, 전문적이고, 확실히 내 것.

## 어디서 사?

**Namecheap** (namecheap.com)을 추천합니다.

왜?
- 저렴 (`.com`이 연간 약 10달러)
- 대시보드가 간단
- 숨겨진 비용 없음

대안: Cloudflare, Google Domains (현재 Squarespace), GoDaddy. 다 잘 됩니다.

## 단계별: 구매 → 연결

### 1단계: 도메인 구매

1. [namecheap.com](https://namecheap.com)에 가서 계정 만들기
2. 원하는 이름 검색 (예: `coolapp.com`)
3. 장바구니에 넣고 결제 (카드 또는 PayPal)
4. 끝. `coolapp.com`은 이제 내 것.

### 2단계: Vercel에 도메인 추가

```
Vercel 대시보드 → 내 프로젝트 → Settings → Domains
→ "coolapp.com" 입력 → Add
```

Vercel이 설정할 **DNS 레코드**를 알려줍니다:

```
Type: A      | Value: 76.76.21.21
Type: CNAME  | Name: www | Value: cname.vercel-dns.com
```

### 3단계: DNS 설정 (핵심 단계)

**DNS가 뭐야?**

전화번호부라고 생각하세요. 누군가 `coolapp.com`을 입력하면, DNS가 인터넷에게 실제로 어느 서버로 가야 하는지 알려줍니다.

Namecheap에서:
1. Dashboard → Domain List → `coolapp.com` → Manage
2. **Advanced DNS** 탭 클릭
3. 기존 레코드 삭제
4. Vercel이 알려준 대로 정확히 추가:

| Type | Host | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

저장하고 **10분에서 1시간 기다리기**. (DNS가 전 세계로 퍼지는 데 시간이 걸립니다.)

### 4단계: 확인

브라우저에 `coolapp.com` 입력 → 내 앱이 뜨면 → 성공!

HTTPS (자물쇠 아이콘)는 Vercel이 **자동으로** 설정합니다. 건드릴 것 없음.

## 자주 묻는 질문

**"DNS 전파는 얼마나 걸려?"**
→ 보통 5분~1시간. 드물게 24시간. 안 되면 기다리세요.

**"www랑 www 없는 것의 차이가 뭐야?"**
→ `coolapp.com`과 `www.coolapp.com` 둘 다 작동해야 합니다. 위 설정이 둘 다 처리합니다.

**"도메인 꼭 사야 해?"**
→ 아니요. `myapp.vercel.app`도 완벽하게 작동합니다. 커스텀 도메인은 **있으면 좋은 것**, 필수는 아닙니다.

**".com 말고 다른 확장자는?"**
→ `.dev`, `.io`, `.app` 다 유효합니다. 이 사이트도 `jasonmoon.dev`입니다. 가격은 다양합니다.

## 비용 정리

| 항목 | 비용 | 빈도 |
|------|------|------|
| Vercel 호스팅 | 무료 | — |
| .com 도메인 | ~10달러 | 연간 |
| HTTPS 인증서 | 무료 (Vercel 자동) | — |

**연간 10달러로 나만의 인터넷 주소.** 커피 두 잔 값.

다음: 왜 비밀번호를 코드에 **절대** 쓰면 안 되는지 — 그리고 대신 어떻게 해야 하는지.
