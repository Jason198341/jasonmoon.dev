---
title: "데이터베이스가 뭐야? Supabase 시작하기"
description: "브라우저 닫으면 사라지는 데이터를 저장하세요. Supabase로 진짜 데이터베이스를 5분 만에 셋업하는 법."
emoji: "\U0001F5C4\uFE0F"
category: database
difficulty: easy
order: 6
---

## 왜 데이터베이스가 필요해?

지금까지 만든 것들은 브라우저를 닫으면 다 사라집니다.

맞아요, `localStorage`는 *내 브라우저*에 데이터를 보관하지만, 다른 기기에서 열면 없어요. 다른 사용자의 데이터? 전혀 접근 불가.

**데이터베이스**는 모든 사람의 데이터를 **중앙 서버**에 저장합니다.

비유: localStorage는 **내 책상 서랍** — 나만 열 수 있어요. 데이터베이스는 **도서관** — 체계적이고, 공유되고, 어디서든 접근 가능합니다.

## Supabase가 뭐야?

**무료 데이터베이스 서비스**입니다. 클라우드에 있는 개발자용 스프레드시트라고 생각하세요.

| 스프레드시트 | Supabase |
|------------|----------|
| 시트 | 테이블 |
| 행 | 레코드 (하나의 항목) |
| 열 | 컬럼 (이름, 이메일 등) |
| 로컬에 저장 | 클라우드에 저장 |

차이점? 스프레드시트는 내 컴퓨터에 있어요. Supabase는 **인터넷에** 있어서 앱이 실시간으로 데이터를 읽고 쓸 수 있습니다.

## 실습: 5분 셋업

### 1단계: 가입
[supabase.com](https://supabase.com) → GitHub로 로그인. 무료.

### 2단계: 프로젝트 만들기
"New Project" → 이름 입력 → 비밀번호 설정 → 리전 선택 (가장 가까운 곳) → Create.

약 2분간 셋업 대기.

### 3단계: 테이블 만들기

할 일 앱을 만든다고 해봐요:

```sql
CREATE TABLE todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  done boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

번역:
- `id`: 각 할 일의 고유 식별자 (자동 생성)
- `title`: 할 일 내용 ("수학 숙제하기")
- `done`: 완료 여부 (true/false)
- `created_at`: 생성 시간 (자동 기록)

Supabase의 "SQL Editor"에 붙여넣고 Run. 테이블 완성.

### 4단계: 앱에서 연결

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxx.supabase.co',  // 프로젝트 URL
  'eyJhbGciOi...'             // 공개 키 (anon key)
)
```

두 값 모두 Supabase 대시보드 → Settings → API에서 찾을 수 있습니다.

### 5단계: 데이터 읽고 쓰기

```javascript
// 할 일 추가
await supabase.from('todos').insert({ title: '숙제하기' })

// 모든 할 일 가져오기
const { data } = await supabase.from('todos').select('*')

// 완료 표시
await supabase.from('todos').update({ done: true }).eq('id', '...')

// 삭제
await supabase.from('todos').delete().eq('id', '...')
```

영어처럼 읽힙니다:
- "todos에서, title '숙제하기'인 행 삽입"
- "todos에서, 전부 선택"

## RLS: 행 수준 보안

**RLS** = 누가 어떤 데이터를 볼 수 있는지 정하는 규칙.

예시: "사용자는 자기 할 일만 볼 수 있다"

```sql
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);
```

이렇게 하면 사용자 A는 사용자 B의 데이터를 절대 볼 수 없습니다. **데이터베이스 레벨에서** 강제됩니다 — 해커도 우회할 수 없어요.

## 무료 플랜 한도

| 항목 | 한도 |
|------|------|
| 데이터베이스 저장소 | 500 MB |
| 파일 저장소 | 1 GB |
| API 요청 | 무제한 |
| 프로젝트 | 2개 |

개인 프로젝트에 충분하고도 남습니다.

## 언제 뭘 쓸까

| 상황 | 선택 |
|------|------|
| 혼자 쓰는 앱, 적은 데이터 | localStorage |
| 다중 기기, 다중 사용자 | Supabase |
| 사용자 로그인 필요 | Supabase Auth |
| 파일 업로드 (이미지 등) | Supabase Storage |

## 다음은?

이 6개 가이드가 기본기를 다뤘습니다:
1. AI가 앱을 만들 수 있다
2. Git으로 작업 저장하기
3. Vercel로 배포하기
4. 커스텀 도메인
5. 보안 기초
6. Supabase 데이터베이스

**이제 뭔가 만드세요.** 막히면 AI한테 물어보고 이 가이드를 다시 보세요. 처음부터 다 이해할 필요 없어요 — 만들면서 배우는 겁니다.
