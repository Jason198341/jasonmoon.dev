---
title: 데이터베이스가 뭔데? Supabase 시작하기
description: 사용자가 입력한 데이터를 저장하고 꺼내쓰는 법. Supabase로 5분 만에 데이터베이스 만들기.
emoji: "\U0001F5C4\uFE0F"
category: 데이터베이스
difficulty: 초급
order: 6
---

## 왜 데이터베이스가 필요해?

지금까지 만든 앱은 브라우저를 닫으면 **데이터가 사라진다.**

localStorage를 쓰면 내 브라우저에는 남지만, 다른 기기에서 접속하면 없다. 다른 사용자의 데이터는 당연히 볼 수 없다.

**데이터베이스**는 모든 사용자의 데이터를 **중앙 서버에 저장**하는 것이다.

비유: localStorage는 **내 서랍**, 데이터베이스는 **공용 도서관**. 서랍은 나만 열 수 있지만, 도서관은 누구든 와서 자기 책을 빌리고 반납할 수 있다.

## Supabase가 뭐야?

**무료 데이터베이스 서비스.** 개발자 버전의 엑셀 시트라고 생각하면 된다.

| 엑셀 | Supabase |
|------|----------|
| 시트 | 테이블 |
| 행 | 레코드 (데이터 한 줄) |
| 열 | 컬럼 (이름, 이메일 같은 항목) |
| 파일 저장 | 클라우드에 자동 저장 |

차이점? 엑셀은 네 컴퓨터에 있고, Supabase는 **인터넷에 있어서** 앱에서 바로 데이터를 읽고 쓸 수 있다.

## 실전: 5분 만에 시작

### Step 1: 가입
[supabase.com](https://supabase.com)에서 GitHub 계정으로 로그인. 무료.

### Step 2: 프로젝트 만들기
"New Project" → 이름 입력 → 비밀번호 설정 → 지역 선택 (Northeast Asia 추천) → Create

2분 정도 기다리면 프로젝트가 만들어진다.

### Step 3: 테이블 만들기

예를 들어 "할 일 목록" 앱을 만든다면:

```sql
CREATE TABLE todos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  done boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
```

이게 무슨 뜻이냐면:
- `id`: 각 할 일의 고유 번호 (자동 생성)
- `title`: 할 일 내용 ("수학 숙제")
- `done`: 완료 여부 (true/false)
- `created_at`: 만든 시간 (자동 기록)

Supabase 대시보드에서 "SQL Editor"에 붙여넣고 Run 하면 끝.

### Step 4: 앱에서 연결

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://xxx.supabase.co',  // 프로젝트 URL
  'eyJhbGciOi...'             // 공개 키 (anon key)
)
```

이 두 값은 Supabase 대시보드 → Settings → API에서 복사할 수 있다.

### Step 5: 데이터 읽고 쓰기

```javascript
// 할 일 추가
await supabase.from('todos').insert({ title: '수학 숙제' })

// 전체 목록 가져오기
const { data } = await supabase.from('todos').select('*')

// 완료 표시
await supabase.from('todos').update({ done: true }).eq('id', '...')

// 삭제
await supabase.from('todos').delete().eq('id', '...')
```

영어로 읽으면 거의 문장이다:
- "todos에서 insert해라 title이 수학 숙제인 것을"
- "todos에서 select해라 전부(*)"

## RLS: 보안 설정

**RLS (Row Level Security)** = 누가 어떤 데이터를 볼 수 있는지 규칙을 정하는 것.

예: "자기가 만든 할 일만 볼 수 있다"

```sql
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "자기 할일만 보기" ON todos
  FOR SELECT USING (auth.uid() = user_id);
```

이렇게 하면 A 사용자가 B 사용자의 데이터를 절대 볼 수 없다. **데이터베이스 레벨에서 차단**하니까 해킹으로도 못 뚫는다.

## 무료 한도

Supabase 무료 티어:

| 항목 | 한도 |
|------|------|
| 데이터베이스 | 500MB |
| 파일 저장소 | 1GB |
| API 호출 | 무제한 |
| 프로젝트 수 | 2개 |

개인 프로젝트에는 충분하고도 남는다.

## 정리: 언제 뭘 쓰나?

| 상황 | 선택 |
|------|------|
| 나만 쓰는 앱, 데이터 소량 | localStorage |
| 여러 기기에서 접속, 다른 사용자 | Supabase |
| 사용자 로그인이 필요 | Supabase Auth |
| 파일 업로드 (이미지 등) | Supabase Storage |

## 다음은?

이 6편의 가이드로 기본기는 충분하다:
1. AI로 앱 만들기
2. Git으로 코드 관리
3. Vercel로 배포
4. 도메인 연결
5. 보안 기본기
6. 데이터베이스

**이제 네가 만들고 싶은 걸 만들어봐.** 막히면 AI한테 물어보고, 이 가이드를 다시 읽으면 된다. 처음에 다 이해 안 돼도 괜찮다. 만들면서 이해하는 거다.
