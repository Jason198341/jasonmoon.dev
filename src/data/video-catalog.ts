// ── 60 Video Template Catalog ──
// Each entry: title, format, duration, skills, stack, tags, prompt (copy-pasteable Claude Code command)

export interface VideoTemplate {
  id: number
  title: string
  titleKo: string
  format: string
  duration: string
  skills: string[]
  stack: string[]
  tags: string[]
  prompt: string
}

export interface CatalogCategory {
  id: string
  label: string
  labelKo: string
  description: string
  icon: string
  color: string
  templates: VideoTemplate[]
}

export const catalog: CatalogCategory[] = [
  // ═══════════════════════════════════════════════════
  // A. READY-MADE — 기존 프로젝트 기반 (즉시 제작)
  // ═══════════════════════════════════════════════════
  {
    id: 'portfolio',
    label: 'Portfolio & Promo',
    labelKo: '포트폴리오 & 프로모션',
    description: 'Cinematic project showcases and brand videos powered by existing Remotion projects.',
    icon: '🎬',
    color: '#818cf8',
    templates: [
      {
        id: 1,
        title: 'Portfolio Cinematic Trailer',
        titleKo: '포트폴리오 시네마틱 트레일러',
        format: '16:9',
        duration: '90s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'React 19', 'TypeScript', 'KenBurns', 'Spring Physics'],
        tags: ['Cinematic', '5-ACT', 'GlassOverlay'],
        prompt: `/remotion-master 포트폴리오 시네마틱 트레일러를 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 90초 (2700프레임)
5-ACT 구조로 설계해줘:
- ACT 1 Intro (8초): 이름/타이틀 spring 등장 + 파티클 배경
- ACT 2 Flagship (27초): 대표작 3개, KenBurns pan + GlassOverlay 정보 카드
- ACT 3 Montage (25초): 나머지 프로젝트 빠른 전환, 그리드 레이아웃
- ACT 4 RapidFire (18초): 기술 스택 배지 연속 등장
- ACT 5 Outro (12초): 연락처 + CTA

스크린샷: public/screenshots/ 폴더
TypeWriter 텍스트 효과, TransitionSeries fade 전환 적용.`,
      },
      {
        id: 2,
        title: 'Project Showcase Shorts',
        titleKo: '프로젝트 쇼케이스 쇼츠',
        format: '9:16',
        duration: '30–45s',
        skills: ['remotion-master'],
        stack: ['Remotion 4', 'React 19', 'Spring Animations', 'TransitionSeries'],
        tags: ['Shorts', 'Reusable', 'Vertical'],
        prompt: `/remotion-master 개별 프로젝트 쇼케이스 쇼츠를 만들어줘.

포맷: 9:16 (1080x1920), 30fps, 35초
구조: Hook 타이틀(3초) → 기능 데모 3컷(각 8초) → CTA(4초)
spring 물리 기반 등장, fade 전환.
프로젝트명/스크린샷/설명을 props로 받는 재사용 가능한 컴포지션.
Zod schema로 파라미터 정의해서 여러 프로젝트에 재활용 가능하게.`,
      },
    ],
  },
  {
    id: 'education',
    label: 'Education & Lectures',
    labelKo: '교육 & 강의',
    description: 'Longform tutorials, short educational content, and lecture series with TTS narration.',
    icon: '📚',
    color: '#22d3ee',
    templates: [
      {
        id: 3,
        title: 'Coding Tutorial (Longform)',
        titleKo: '코딩 튜토리얼 (롱폼)',
        format: '16:9',
        duration: '10–20min',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'React 19', 'Sequence', 'Syntax Highlighting'],
        tags: ['Lecture', 'Code Display', 'Progress Bar'],
        prompt: `/remotion-master 코딩 강의 롱폼 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
scene 파일 기반: src/data/scenes/ 에 각 장면 JSON 정의.
장면 타입: title, code, diagram, demo, summary
코드 블록: 줄 단위 등장 애니메이션 + 신택스 하이라이팅.
하단 프로그레스바, 현재 장면 번호 표시.
rules/text-animations.md, rules/sequencing.md 참고.`,
      },
      {
        id: 4,
        title: 'AI Shorts Lecture (Senior-friendly)',
        titleKo: '어르신 AI 강의 쇼츠',
        format: '9:16',
        duration: '60s',
        skills: ['remotion-master'],
        stack: ['Remotion 4', 'Gemini TTS', 'Large Typography'],
        tags: ['Shorts', 'Accessibility', 'TTS'],
        prompt: `/remotion-master 어르신 AI 강의 쇼츠를 만들어줘.

포맷: 9:16 (1080x1920), 30fps, 60초
에피소드 데이터: src/data/shorts-episodes.ts
구조: 인트로(5초) → 본문 5컷(각 9초) → 아웃트로(6초)
큰 글씨(42px+), 고대비(흰 텍스트 + 어두운 배경), 단순한 그래디언트 배경.
Gemini TTS (Kore 음성) 나레이션 + 하단 고정 자막(박스 스타일).
rules/fonts.md, rules/subtitles.md 참고.`,
      },
      {
        id: 5,
        title: 'Mold Design Engineering Lecture',
        titleKo: '금형설계 전문 강의',
        format: '16:9',
        duration: '5–15min',
        skills: ['remotion-master'],
        stack: ['Remotion 4', 'KenBurns', 'Gemini TTS', 'Technical Diagrams'],
        tags: ['Engineering', 'Technical', 'KenBurns'],
        prompt: `/remotion-master 금형설계 전문 강의 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
장면 구성: 타이틀 → 개념도(KenBurns) → 3D 모델 이미지 → 비교표 → 요약
전문 용어 하이라이트(accent 컬러), 도면/이미지 KenBurns zoom 효과.
Gemini TTS Kore 음성 나레이션, 타임스탬프 기반 자막 동기화.
rules/images.md, rules/text-animations.md 참고.`,
      },
      {
        id: 6,
        title: 'Science Explainer Video',
        titleKo: '과학 개념 설명 영상',
        format: '16:9',
        duration: '5–10min',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'React 19', 'SVG Animation', 'Spring Physics'],
        tags: ['Science', 'Diagram', 'Animation'],
        prompt: `/remotion-master 과학 개념 설명 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
분자/물리 구조 시각화: SVG 노드 + 연결선 애니메이션.
spring 기반 요소 형성, 각 개념별 색상 코딩.
장면: 도입 → 개념A → 개념B → 비교 → 퀴즈 → 정리
rules/animations.md, rules/timing.md 참고.`,
      },
      {
        id: 7,
        title: 'History Documentary Shorts',
        titleKo: '역사 다큐 쇼츠',
        format: '9:16',
        duration: '45–60s',
        skills: ['remotion-master'],
        stack: ['Remotion 4', 'KenBurns', 'Vintage Filter', 'TTS'],
        tags: ['Shorts', 'Documentary', 'Historical'],
        prompt: `/remotion-master 역사 다큐멘터리 쇼츠를 만들어줘.

포맷: 9:16 (1080x1920), 30fps, 50초
구조: 연도 타이틀(3초) → 배경 이미지 + 나레이션(35초) → 핵심 정리(7초) → 다음 편 예고(5초)
KenBurns pan/zoom으로 역사 이미지 전환, 세피아 톤 필터.
하단 타임라인 바, 상단 연도 표시.
Gemini TTS 나레이션 + SRT 자막.`,
      },
    ],
  },
  {
    id: 'drama',
    label: 'Drama & Story',
    labelKo: '드라마 & 스토리',
    description: 'Short-form narrative content with emotion systems and multi-layer compositing.',
    icon: '🎭',
    color: '#f472b6',
    templates: [
      {
        id: 8,
        title: 'Short-form Drama (Emotion System)',
        titleKo: '숏폼 드라마 (감정 시스템)',
        format: '9:16',
        duration: '60s',
        skills: ['remotion-master'],
        stack: ['Remotion 4', '5-Layer Compositing', 'Emotion Engine', 'KenBurns'],
        tags: ['Drama', 'Emotion', '5-Layer'],
        prompt: `/remotion-master 숏폼 드라마 영상을 만들어줘.

포맷: 9:16 (1080x1920), 30fps, 60초
5-layer 합성: 배경(KenBurns) → 캐릭터 오버레이 → 대사 자막 → 감정 이펙트 → BGM
감정 시스템 구현: happy/sad/angry/surprised
→ 감정별 배경 그래디언트 + 파티클 효과 + 폰트 스타일 자동 전환.
fade 전환, 시나리오: src/data/drama-script.ts
rules/sequencing.md, rules/transitions.md 참고.`,
      },
      {
        id: 9,
        title: 'Historical Comedy Skit',
        titleKo: '역사 코미디 숏폼',
        format: '9:16',
        duration: '45s',
        skills: ['remotion-master'],
        stack: ['Remotion 4', 'AI Image Gen', 'KenBurns', 'Character Subtitle'],
        tags: ['Comedy', 'Historical', 'Character'],
        prompt: `/remotion-master 역사 코미디 숏폼을 만들어줘.

포맷: 9:16 (1080x1920), 30fps, 45초
구조: 시대 배경 타이틀(3초) → 상황 설정(10초) → 반전(15초) → 현대 해석(12초) → 펀치라인(5초)
AI 생성 일러스트(Imagen 3) + KenBurns zoom.
대사 자막: 캐릭터별 색상 구분, 말풍선 스타일.
rules/text-animations.md, rules/images.md 참고.`,
      },
    ],
  },
  {
    id: 'auto-shorts',
    label: 'AI Auto-Gen Shorts',
    labelKo: 'AI 자동 생성 쇼츠',
    description: '13 content styles via video-factory CLI. One command generates full script + video.',
    icon: '🤖',
    color: '#a78bfa',
    templates: [
      {
        id: 10,
        title: 'History IF — "What If?"',
        titleKo: '역사 IF — "만약 ~했다면?"',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'History', 'What-If'],
        prompt: `video-factory에서 역사 IF 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "조선시대에 인터넷이 있었다면" --format shorts --style history-if

시나리오 생성 → 검토 → TTS → 이미지 → 합성 순서로 진행.
--tts gemini (Kore 음성) 사용.`,
      },
      {
        id: 11,
        title: 'Virtual Interview',
        titleKo: '가상 인터뷰',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Interview', 'Dialogue'],
        prompt: `video-factory에서 가상 인터뷰 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "아인슈타인과의 가상 인터뷰" --format shorts --style interview

인터뷰어/인터뷰이 대화 형식, Q&A 자막 구분.`,
      },
      {
        id: 12,
        title: 'Movie Scene Review',
        titleKo: '영화/드라마 명장면 분석',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Film', 'Analysis'],
        prompt: `video-factory에서 명장면 분석 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "인터스텔라 도킹 씬 분석" --format shorts --style scene-review

장면 설명 → 기술적 분석 → 감독 의도 → 감상 포인트.`,
      },
      {
        id: 13,
        title: 'Animal Documentary',
        titleKo: '동물 다큐 스타일',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Nature', 'Documentary'],
        prompt: `video-factory에서 동물 다큐 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "문어의 놀라운 위장술" --format shorts --style animal-world

내레이션 톤: 다큐멘터리 경어체, 과학적 사실 기반.`,
      },
      {
        id: 14,
        title: 'Future Vision',
        titleKo: '미래 기술/사회 예측',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Future', 'Tech'],
        prompt: `video-factory에서 미래 예측 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "2050년 자율주행 도시" --format shorts --style future-vision

현재 기술 → 발전 방향 → 미래 예측 → 전문가 인사이트.`,
      },
      {
        id: 15,
        title: 'VS Battle Comparison',
        titleKo: '대결 비교 형식',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'VS', 'Comparison'],
        prompt: `video-factory에서 VS 대결 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "삼성 vs 애플 AI 전략" --format shorts --style vs-battle

좌우 분할 비교, 항목별 스코어링, 최종 판정.`,
      },
      {
        id: 16,
        title: 'Mini Lecture',
        titleKo: '미니 강의 (1분 지식)',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Education', 'Quick'],
        prompt: `video-factory에서 미니 강의 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "양자역학 30초 입문" --format shorts --style mini-lecture

핵심만 짧게: 도입(훅) → 개념 3개 → 한 줄 정리.`,
      },
      {
        id: 17,
        title: 'Mystery / Unsolved Case',
        titleKo: '미스터리 / 미해결 사건',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Mystery', 'Suspense'],
        prompt: `video-factory에서 미스터리 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "버뮤다 삼각지대의 비밀" --format shorts --style mystery

서스펜스 빌드업 → 단서 제시 → 반전/미해결 엔딩.`,
      },
      {
        id: 18,
        title: 'Before / After Transformation',
        titleKo: 'Before/After 변신',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Transformation', 'Visual'],
        prompt: `video-factory에서 변신/변화 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "황무지를 정원으로 바꾸는 과정" --format shorts --style transformation

Before 상태 → 변화 과정 → After 결과 → 비교.`,
      },
      {
        id: 19,
        title: 'Satisfying / ASMR',
        titleKo: 'ASMR / 만족감 계열',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'ASMR', 'Satisfying'],
        prompt: `video-factory에서 만족감(satisfying) 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "완벽한 대칭의 세계" --format shorts --style satisfying

시각적 쾌감 중심, 미니멀 나레이션, 느린 전환.`,
      },
      {
        id: 20,
        title: 'Virtual Experiment',
        titleKo: '가상 실험 / 검증',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Experiment', 'Science'],
        prompt: `video-factory에서 가상 실험 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "지구가 갑자기 멈추면?" --format shorts --style experiment

가설 제시 → 실험 시뮬레이션 → 결과 분석 → 결론.`,
      },
      {
        id: 21,
        title: 'TOP N Ranking',
        titleKo: 'TOP N 랭킹',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'Ranking', 'List'],
        prompt: `video-factory에서 TOP N 랭킹 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "역대 가장 비싼 그림 TOP 5" --format shorts --style ranking

N위부터 1위까지 카운트다운, 항목별 설명 + 스코어.`,
      },
      {
        id: 22,
        title: 'Real Story Retelling',
        titleKo: '실화 기반 재구성',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Auto-Gen', 'True Story', 'Narrative'],
        prompt: `video-factory에서 실화 기반 쇼츠를 생성해줘.

경로: /c/Users/USER/video-factory
명령어: npx tsx src/index.ts generate "최초의 에베레스트 등정 이야기" --format shorts --style real-story

사실 기반 내러티브, 시간순 전개, 감동 포인트.`,
      },
    ],
  },
  {
    id: 'storybook',
    label: 'AI Storybook',
    labelKo: 'AI 동화책',
    description: 'Fully automated children\'s storybook videos with AI-generated illustrations and narration.',
    icon: '📖',
    color: '#fb923c',
    templates: [
      {
        id: 23,
        title: 'AI Storybook Shorts',
        titleKo: 'AI 동화책 쇼츠',
        format: '9:16',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['storybook-factory CLI', 'Gemini Imagen 3', 'KenBurns', 'Gemini TTS', 'ffmpeg'],
        tags: ['Children', 'AI Image', 'Auto Pipeline'],
        prompt: `storybook-factory에서 AI 동화책 쇼츠를 만들어줘.

경로: /c/Users/USER/storybook-factory
명령어: npx tsx src/index.ts create "용감한 아기 고양이의 모험" --format shorts --scenes 6 --animate kenburns

파이프라인: 시나리오(Fireworks) → 이미지(Imagen 3) → KenBurns 애니메이션 → TTS(Gemini Kore) → ffmpeg 합성.
--animate kenburns: 5가지 zoom/pan 효과 자동 적용.`,
      },
      {
        id: 24,
        title: 'AI Storybook Longform',
        titleKo: 'AI 동화책 풀 영상',
        format: '16:9',
        duration: '3–5min',
        skills: ['remotion-master'],
        stack: ['storybook-factory CLI', 'Gemini Imagen 3', 'KenBurns', 'Gemini TTS', 'ffmpeg'],
        tags: ['Children', 'Longform', 'Full Story'],
        prompt: `storybook-factory에서 AI 동화책 풀 영상을 만들어줘.

경로: /c/Users/USER/storybook-factory
명령어: npx tsx src/index.ts create "숲 속 동물 친구들의 축제" --format normal --scenes 12 --animate kenburns

12씬 풀 스토리, 16:9 포맷.
각 씬: AI 이미지(1024x576) + 나레이션 + 자막.`,
      },
    ],
  },
  {
    id: 'data-viz',
    label: 'Data & Sports Visualization',
    labelKo: '데이터 & 스포츠 시각화',
    description: 'GPS maps, audio visualizers, and real-time data animations.',
    icon: '📊',
    color: '#34d399',
    templates: [
      {
        id: 25,
        title: 'Running Map Animation',
        titleKo: '러닝 GPS 지도 애니메이션',
        format: '9:16',
        duration: '30s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Mapbox GL', 'GPS Data', 'Strava API'],
        tags: ['Sports', 'Map', 'GPS'],
        prompt: `/remotion-master 러닝 GPS 지도 애니메이션 쇼츠를 만들어줘.

포맷: 9:16 (1080x1920), 30fps, 30초
Mapbox 지도 위에 GPS 경로가 그려지는 애니메이션.
구간별 페이스 색상 코딩(초록→노랑→빨강), 총 거리/시간/칼로리 오버레이.
Mapbox 토큰: .env MAPBOX_TOKEN
rules/maps.md 참고해서 카메라 이동 + 경로 그리기 구현.`,
      },
      {
        id: 26,
        title: 'Music Visualizer',
        titleKo: '뮤직 비주얼라이저',
        format: '9:16',
        duration: 'Auto (audio length)',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Audio FFT', 'Particles', 'CircularSpectrum'],
        tags: ['Music', 'Reactive', '5-Layer'],
        prompt: `/remotion-master 뮤직 비주얼라이저 쇼츠를 만들어줘.

포맷: 9:16 (1080x1920), 30fps, 오디오 길이에 맞춤
5-layer 합성: Background(그래디언트) → ParticleField → CircularSpectrum → CenterInfo(곡명/아티스트) → ProgressBar
useWindowedAudioData() + visualizeAudio() 64-bin FFT.
bass(0-7), mid(8-31), treble(32+) 대역 분리, 각 대역별 반응.
오디오: public/music.mp3
rules/audio-visualization.md 참고.`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // B. BUILD NEW — Remotion 기능 기반 (새로 제작)
  // ═══════════════════════════════════════════════════
  {
    id: 'motion',
    label: 'Motion Graphics',
    labelKo: '모션 그래픽',
    description: 'Kinetic typography, infographics, logo animations, and Lottie integrations.',
    icon: '✨',
    color: '#f59e0b',
    templates: [
      {
        id: 27,
        title: 'Kinetic Typography',
        titleKo: '키네틱 타이포그래피',
        format: '16:9 / 9:16',
        duration: '15–30s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Spring Physics', 'Text Split', 'CSS Transform'],
        tags: ['Typography', 'Motion', 'Dynamic'],
        prompt: `/remotion-master 키네틱 타이포그래피 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 20초
텍스트가 단어/글자 단위로 분해되어 각각 spring 물리로 등장/퇴장.
효과: bounce, slide, rotate, scale, blur reveal.
텍스트 데이터를 배열로 받아서 순차 표시. 배경색 전환.
rules/text-animations.md 참고. Google Fonts에서 Syne 또는 Bebas Neue 사용.`,
      },
      {
        id: 28,
        title: 'Infographic Animation',
        titleKo: '인포그래픽 애니메이션',
        format: '16:9',
        duration: '30–60s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Spring Physics', 'CountUp', 'SVG'],
        tags: ['Data', 'Infographic', 'CountUp'],
        prompt: `/remotion-master 인포그래픽 애니메이션 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 45초
숫자 카운트업(0→목표값), 프로그레스 바 채워지기, 아이콘 스태거 등장.
데이터 포인트를 props로 받는 재사용 컴포넌트:
{ label, value, unit, icon, color }[]
rules/animations.md, rules/timing.md 참고.`,
      },
      {
        id: 29,
        title: 'Logo Intro / Outro',
        titleKo: '로고 인트로 / 아웃트로',
        format: '16:9',
        duration: '3–5s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Spring Physics', 'Light Leaks', 'Glow Effects'],
        tags: ['Branding', 'Logo', 'Short'],
        prompt: `/remotion-master 로고 인트로/아웃트로 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 4초 (120프레임)
로고 이미지: public/logo.png
spring 기반 등장(scale 0→1, damping: 12), 도착 시 glow pulse 효과.
Light Leak 오버레이로 필름 감성 추가.
rules/timing.md (spring config), rules/light-leaks.md 참고.`,
      },
      {
        id: 30,
        title: 'Lottie Animation Integration',
        titleKo: 'Lottie 애니메이션 통합',
        format: '16:9 / 9:16',
        duration: 'Variable',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', '@remotion/lottie', 'After Effects', 'LottieFiles'],
        tags: ['Lottie', 'After Effects', 'Vector'],
        prompt: `/remotion-master Lottie 애니메이션 통합 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
Lottie JSON 파일: public/animations/ 폴더
@remotion/lottie 패키지로 타임라인 동기화.
여러 Lottie를 Sequence로 순차 배치, 사이에 텍스트 장면 삽입.
rules/lottie.md 참고. LottieFiles에서 무료 에셋 활용 가능.`,
      },
    ],
  },
  {
    id: '3d',
    label: '3D Content',
    labelKo: '3D 콘텐츠',
    description: 'Three.js powered 3D product showcases, text, and data visualizations.',
    icon: '🧊',
    color: '#60a5fa',
    templates: [
      {
        id: 31,
        title: '3D Product Rotation',
        titleKo: '3D 제품 회전 쇼케이스',
        format: '16:9',
        duration: '15–30s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'React Three Fiber', 'Three.js', '@react-three/drei'],
        tags: ['3D', 'Product', 'Rotation'],
        prompt: `/remotion-master 3D 제품 회전 쇼케이스 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 20초
React Three Fiber + @react-three/drei로 3D 모델(GLB) 로드.
카메라: 오비탈 회전(0→360도), spring ease-out.
조명: ambient + directional + rim light.
제품명 + 특징 텍스트 오버레이.
rules/3d.md 참고. useThree()로 frame 기반 카메라 제어.`,
      },
      {
        id: 32,
        title: '3D Text Animation',
        titleKo: '3D 텍스트 애니메이션',
        format: '16:9',
        duration: '10–15s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'React Three Fiber', 'Three.js', 'TextGeometry'],
        tags: ['3D', 'Typography', 'Cinematic'],
        prompt: `/remotion-master 3D 텍스트 애니메이션 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 12초
Three.js TextGeometry로 3D 텍스트 생성.
카메라: dolly in + orbit, 글자별 시차 등장(stagger).
머티리얼: metallic + roughness + environment map 반사.
rules/3d.md 참고. font JSON은 public/fonts/에 배치.`,
      },
      {
        id: 33,
        title: '3D Data Globe',
        titleKo: '3D 데이터 지구본',
        format: '16:9',
        duration: '20–30s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'React Three Fiber', 'Three.js', 'GeoJSON'],
        tags: ['3D', 'Globe', 'Data'],
        prompt: `/remotion-master 3D 데이터 지구본 시각화 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 25초
Three.js sphere + GeoJSON 국경선 + 데이터 포인트(arc).
카메라: 자동 회전 + 특정 지점 줌인.
데이터 포인트 연결선(arc)이 순차적으로 그려지는 애니메이션.
rules/3d.md 참고.`,
      },
    ],
  },
  {
    id: 'charts',
    label: 'Charts & Data',
    labelKo: '차트 & 데이터',
    description: 'Animated bar races, pie charts, line charts, and stock market visualizations.',
    icon: '📈',
    color: '#eab308',
    templates: [
      {
        id: 34,
        title: 'Bar Chart Race',
        titleKo: '바 차트 레이스',
        format: '16:9',
        duration: '30–60s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'React 19', 'Spring Physics', 'Dynamic Layout'],
        tags: ['Chart', 'Race', 'Animated'],
        prompt: `/remotion-master 바 차트 레이스 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 45초
시간(연도/월)별 데이터가 바로 애니메이션되면서 순위 변동.
spring 기반 위치/너비 전환, 순위 라벨 + 값 표시.
데이터: src/data/chart-data.ts — { year, items: { name, value, color }[] }[]
상단 연도 카운터, 하단 출처 표기.
rules/charts.md 참고.`,
      },
      {
        id: 35,
        title: 'Pie Chart Animation',
        titleKo: '파이 차트 애니메이션',
        format: '16:9',
        duration: '15–20s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'SVG Arc', 'interpolate', 'Spring'],
        tags: ['Chart', 'Pie', 'SVG'],
        prompt: `/remotion-master 파이 차트 애니메이션 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 18초
SVG arc path로 파이 차트 구현, 0%→100% 채워지는 애니메이션.
각 조각(segment)이 순차 등장, 라벨 + 퍼센트 팝업.
비율 데이터: props로 전달 { label, value, color }[]
rules/charts.md 참고.`,
      },
      {
        id: 36,
        title: 'Line Chart Drawing',
        titleKo: '라인 차트 그리기',
        format: '16:9',
        duration: '15–20s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'SVG Path', 'strokeDashoffset', 'interpolate'],
        tags: ['Chart', 'Line', 'Draw Effect'],
        prompt: `/remotion-master 라인 차트 그리기 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 18초
SVG path + strokeDashoffset 으로 선이 그려지는 효과.
X축 라벨, Y축 눈금 순차 등장 → 라인 그리기 → 데이터 포인트 팝업.
데이터: props로 { x, y }[] 전달.
rules/charts.md 참고.`,
      },
      {
        id: 37,
        title: 'Stock Chart Video',
        titleKo: '주식 캔들스틱 차트',
        format: '16:9',
        duration: '30–45s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'SVG Candlestick', 'interpolate', 'Indicators'],
        tags: ['Chart', 'Stock', 'Candlestick'],
        prompt: `/remotion-master 주식 캔들스틱 차트 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 35초
캔들스틱 하나씩 순차 등장(좌→우), 양봉(초록)/음봉(빨강) 색상.
이동평균선(MA5, MA20) 동시 그리기.
거래량 바 차트 하단 배치.
OHLCV 데이터: src/data/stock-data.ts
rules/charts.md 참고.`,
      },
    ],
  },
  {
    id: 'maps',
    label: 'Maps & Location',
    labelKo: '지도 & 위치',
    description: 'Mapbox camera animations and travel route visualizations.',
    icon: '🗺️',
    color: '#2dd4bf',
    templates: [
      {
        id: 38,
        title: 'Mapbox Camera Animation',
        titleKo: 'Mapbox 카메라 애니메이션',
        format: '16:9',
        duration: '15–30s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Mapbox GL JS', 'Camera Keyframes'],
        tags: ['Map', 'Camera', 'Flyover'],
        prompt: `/remotion-master Mapbox 카메라 플라이오버 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 25초
Mapbox GL JS 지도 위에 카메라 키프레임 이동:
[{ center, zoom, bearing, pitch, frame }] 배열로 경로 정의.
interpolate()로 부드러운 카메라 이동, 주요 지점에 마커 팝업.
MAPBOX_TOKEN은 .env에서 로드.
rules/maps.md 참고.`,
      },
      {
        id: 39,
        title: 'Travel Route Video',
        titleKo: '여행 경로 영상',
        format: '16:9 / 9:16',
        duration: '20–40s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Mapbox GL JS', 'Dashed Line', 'Photo Overlay'],
        tags: ['Map', 'Travel', 'Route'],
        prompt: `/remotion-master 여행 경로 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 30초
Mapbox 지도 위에 점선 경로가 그려지는 애니메이션.
각 정거장(도시)에 도착하면: 마커 팝업 + 작은 사진 오버레이 + 도시명.
경로 데이터: [{ name, coords, photo }]
rules/maps.md 참고.`,
      },
    ],
  },
  {
    id: 'photo',
    label: 'Photo & Image',
    labelKo: '사진 & 이미지',
    description: 'Ken Burns slideshows, montages, and comparison sliders.',
    icon: '🖼️',
    color: '#c084fc',
    templates: [
      {
        id: 40,
        title: 'Ken Burns Slideshow',
        titleKo: 'Ken Burns 슬라이드쇼',
        format: '16:9 / 9:16',
        duration: 'Variable',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Img Component', 'CSS Transform', 'TransitionSeries'],
        tags: ['Photo', 'KenBurns', 'Slideshow'],
        prompt: `/remotion-master Ken Burns 슬라이드쇼 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
각 사진마다 랜덤 Ken Burns 효과(zoom in, zoom out, pan left/right, diagonal).
TransitionSeries로 crossfade 전환 (15프레임).
사진 배열: public/photos/ 폴더의 이미지 자동 로드.
각 사진 위에 캡션 오버레이(하단 그래디언트 + 텍스트).
rules/images.md, rules/transitions.md 참고.`,
      },
      {
        id: 41,
        title: 'Photo Montage',
        titleKo: '사진 몽타주',
        format: '16:9',
        duration: '20–40s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Grid Layout', 'Stagger Animation', 'TransitionSeries'],
        tags: ['Photo', 'Montage', 'Grid'],
        prompt: `/remotion-master 사진 몽타주 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 30초
여러 사진이 그리드로 하나씩 등장(stagger), 전체가 모이면 줌아웃.
중간중간 개별 사진 풀스크린 하이라이트 → 다시 그리드로.
사진 목록: public/montage/ 폴더
rules/images.md, rules/sequencing.md 참고.`,
      },
      {
        id: 42,
        title: 'Before / After Slider',
        titleKo: 'Before/After 비교 슬라이더',
        format: '16:9 / 9:16',
        duration: '10–15s',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'CSS clip-path', 'interpolate'],
        tags: ['Photo', 'Comparison', 'Slider'],
        prompt: `/remotion-master Before/After 비교 슬라이더 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps, 12초
두 이미지를 겹쳐놓고 clip-path로 슬라이더가 좌→우로 이동.
"BEFORE" / "AFTER" 라벨, 슬라이더 라인 + 핸들.
interpolate()로 부드러운 이동, 중간에 잠시 멈추기(3초).
rules/animations.md 참고.`,
      },
    ],
  },
  {
    id: 'audio',
    label: 'Audio & Music',
    labelKo: '오디오 & 음악',
    description: 'Spectrum visualizers, waveforms, bass-reactive effects, and podcast visuals.',
    icon: '🎵',
    color: '#f472b6',
    templates: [
      {
        id: 43,
        title: 'Audio Spectrum Bars',
        titleKo: '오디오 스펙트럼 바',
        format: '16:9 / 9:16',
        duration: 'Auto (audio length)',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'visualizeAudio()', 'FFT', 'CSS Transform'],
        tags: ['Audio', 'Spectrum', 'Bars'],
        prompt: `/remotion-master 오디오 스펙트럼 바 영상을 만들어줘.

포맷: 9:16 (1080x1920), 30fps
하단에 주파수 대역별 바 시각화 (32~64 bars).
visualizeAudio()로 FFT 데이터 추출, 각 바 높이 = 주파수 amplitude.
바 색상: 저음(파랑) → 중음(초록) → 고음(빨강) 그래디언트.
오디오: public/audio.mp3
rules/audio-visualization.md 참고.`,
      },
      {
        id: 44,
        title: 'Waveform Visualization',
        titleKo: '웨이브폼 시각화',
        format: '16:9',
        duration: 'Auto (audio length)',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'getWaveformPortion()', 'SVG Path', 'Canvas'],
        tags: ['Audio', 'Waveform', 'Wave'],
        prompt: `/remotion-master 웨이브폼 시각화 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
오디오 파형을 SVG path 또는 Canvas로 실시간 렌더링.
현재 재생 위치 하이라이트(accent 색상), 앞부분은 dim.
곡명/아티스트 + 재생시간 오버레이.
rules/audio-visualization.md 참고.`,
      },
      {
        id: 45,
        title: 'Bass Reactive Effects',
        titleKo: '베이스 리액티브 이펙트',
        format: '9:16',
        duration: 'Auto (audio length)',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'visualizeAudio()', 'Particles', 'Scale Transform'],
        tags: ['Audio', 'Bass', 'Reactive'],
        prompt: `/remotion-master 베이스 리액티브 이펙트 영상을 만들어줘.

포맷: 9:16 (1080x1920), 30fps
저음(bass) 대역 amplitude에 반응하는 비주얼 이펙트:
- 배경 scale pulse (1.0 → 1.05)
- 파티클 속도/크기 변화
- 중앙 도형(원/사각) 크기 맥동
bass = visualizeAudio() bins 0-7의 평균.
rules/audio-visualization.md 참고.`,
      },
      {
        id: 46,
        title: 'Podcast Visual',
        titleKo: '팟캐스트 비주얼',
        format: '16:9',
        duration: 'Auto (audio length)',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Audio Waveform', 'Subtitles', 'Speaker Avatars'],
        tags: ['Audio', 'Podcast', 'Speaker'],
        prompt: `/remotion-master 팟캐스트 비주얼 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
좌/우에 화자 아바타(원형), 발화 중인 화자의 테두리 glow.
중앙에 실시간 파형, 하단에 자막.
화자 전환은 자막 데이터의 speaker 필드로 판별.
rules/audio.md, rules/subtitles.md 참고.`,
      },
    ],
  },
  {
    id: 'subtitles',
    label: 'Subtitles & Captions',
    labelKo: '자막 & 캡션',
    description: 'SRT imports, AI auto-captioning with Whisper, and karaoke-style lyrics.',
    icon: '💬',
    color: '#38bdf8',
    templates: [
      {
        id: 47,
        title: 'SRT Subtitle Overlay',
        titleKo: 'SRT 자막 오버레이',
        format: '16:9 / 9:16',
        duration: 'Variable',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', '@remotion/captions', 'SRT Parser'],
        tags: ['Subtitle', 'SRT', 'Overlay'],
        prompt: `/remotion-master SRT 자막 오버레이 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
기존 영상 위에 SRT 파일 기반 자막 오버레이.
@remotion/captions으로 SRT 파싱 → 타이밍 동기화.
자막 스타일: 하단 중앙, 반투명 검정 배경, 흰 텍스트(Outline).
rules/import-srt-captions.md, rules/subtitles.md 참고.`,
      },
      {
        id: 48,
        title: 'AI Auto Caption (Whisper)',
        titleKo: 'AI 자동 자막 (Whisper)',
        format: '16:9 / 9:16',
        duration: 'Variable',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', '@remotion/install-whisper-cpp', 'Word Highlight'],
        tags: ['AI', 'Whisper', 'Auto Caption'],
        prompt: `/remotion-master AI 자동 자막 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
@remotion/install-whisper-cpp로 Whisper 설치,
오디오에서 자동 단어 단위 타임스탬프 추출.
현재 발화 단어 하이라이트(accent 색상 + scale 1.1).
rules/transcribe-captions.md 참고. 모델: whisper-base 또는 whisper-small.`,
      },
      {
        id: 49,
        title: 'Karaoke Style Lyrics',
        titleKo: '가라오케 스타일 가사',
        format: '16:9 / 9:16',
        duration: 'Auto (audio length)',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'Word-level Timing', 'Gradient Fill', 'Audio Sync'],
        tags: ['Lyrics', 'Karaoke', 'Sing-along'],
        prompt: `/remotion-master 가라오케 스타일 가사 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
단어 단위 타이밍에 맞춰 가사가 왼→오 그래디언트로 채워지는 효과.
현재 줄 크게 표시, 다음 줄 미리보기.
가사 데이터: { word, startFrame, endFrame }[]
rules/display-captions.md 참고.`,
      },
    ],
  },
  {
    id: 'effects',
    label: 'Special Effects',
    labelKo: '특수 효과',
    description: 'Light leaks, transparent video export, and synchronized GIF embeds.',
    icon: '🌈',
    color: '#e879f9',
    templates: [
      {
        id: 50,
        title: 'Light Leak Overlay',
        titleKo: '라이트 리크 오버레이',
        format: '16:9 / 9:16',
        duration: 'Variable',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', '@remotion/light-leaks', 'Blend Modes'],
        tags: ['Effect', 'Film', 'Light Leak'],
        prompt: `/remotion-master 라이트 리크 오버레이 효과를 만들어줘.

포맷: 16:9 (1920x1080), 30fps
@remotion/light-leaks 패키지로 필름 감성 빛 번짐 효과.
기존 영상/이미지 위에 오버레이 레이어로 합성.
mix-blend-mode: screen, opacity 조절.
rules/light-leaks.md 참고.`,
      },
      {
        id: 51,
        title: 'Transparent Background Video',
        titleKo: '투명 배경 영상',
        format: '16:9 / 9:16',
        duration: 'Variable',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', 'ProRes 4444', 'WebM VP9 Alpha'],
        tags: ['Effect', 'Transparent', 'Alpha'],
        prompt: `/remotion-master 투명 배경 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
배경 없이 오브젝트/텍스트만 렌더링 (투명 배경).
렌더 옵션: --codec=prores --prores-profile=4444 (macOS)
또는 --codec=vp8 --pixel-format=yuva420p (WebM alpha).
rules/transparent-videos.md 참고.`,
      },
      {
        id: 52,
        title: 'GIF Loop Integration',
        titleKo: 'GIF 루프 통합',
        format: '16:9 / 9:16',
        duration: 'Variable',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['Remotion 4', '@remotion/gif', 'Timeline Sync'],
        tags: ['GIF', 'Loop', 'Embed'],
        prompt: `/remotion-master GIF 루프 통합 영상을 만들어줘.

포맷: 16:9 (1920x1080), 30fps
@remotion/gif 패키지로 GIF를 Remotion 타임라인에 동기화.
<Gif src={...} /> 컴포넌트, 루프 제어 + 속도 조절.
여러 GIF를 레이아웃에 배치하고 텍스트와 조합.
rules/gifs.md 참고.`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // C. TTS & VOICE — 음성 옵션
  // ═══════════════════════════════════════════════════
  {
    id: 'tts',
    label: 'TTS & Voice',
    labelKo: 'TTS & 음성',
    description: 'Text-to-speech engines: Gemini, Qwen3 voice cloning, and ElevenLabs.',
    icon: '🎙️',
    color: '#fb7185',
    templates: [
      {
        id: 53,
        title: 'Gemini TTS — Korean Male (Kore)',
        titleKo: 'Gemini TTS 한국어 남성 (Kore)',
        format: 'Audio (WAV)',
        duration: 'Text length',
        skills: ['remotion-master'],
        stack: ['@google/genai', 'Gemini 2.5 Flash TTS', 'PCM→WAV', 'Node.js'],
        tags: ['TTS', 'Korean', 'Male'],
        prompt: `/remotion-master Gemini TTS로 한국어 남성 나레이션을 생성해줘.

@google/genai 패키지 사용:
모델: gemini-2.5-flash-preview-tts
음성: Kore (한국어 남성, 자연스러운 톤)
출력: 24kHz, 16-bit, mono WAV

텍스트: "여기에 나레이션 텍스트 입력"
환경변수: GEMINI_API_KEY
주의: Free tier 일일 10회 제한.`,
      },
      {
        id: 54,
        title: 'Gemini TTS — Korean Female (Aoede)',
        titleKo: 'Gemini TTS 한국어 여성 (Aoede)',
        format: 'Audio (WAV)',
        duration: 'Text length',
        skills: ['remotion-master'],
        stack: ['@google/genai', 'Gemini 2.5 Flash TTS', 'PCM→WAV', 'Node.js'],
        tags: ['TTS', 'Korean', 'Female'],
        prompt: `/remotion-master Gemini TTS로 한국어 여성 나레이션을 생성해줘.

@google/genai 패키지 사용:
모델: gemini-2.5-flash-preview-tts
음성: Aoede (한국어 여성, 부드러운 톤)
출력: 24kHz, 16-bit, mono WAV

텍스트: "여기에 나레이션 텍스트 입력"
환경변수: GEMINI_API_KEY
주의: Free tier 일일 10회 제한.`,
      },
      {
        id: 55,
        title: 'Qwen3 Voice Clone',
        titleKo: 'Qwen3 음성 복제',
        format: 'Audio (WAV)',
        duration: 'Text length',
        skills: ['remotion-master'],
        stack: ['Qwen3 TTS Server', 'Python', 'reference.wav', 'Voice Cloning'],
        tags: ['TTS', 'Voice Clone', 'Custom'],
        prompt: `Qwen3 TTS로 음성 복제 나레이션을 생성해줘.

1. TTS 서버 실행:
   cd /c/Users/USER/video-factory/tts-server && python server.py
   (포트 8000, reference.wav 필요)

2. API 호출:
   POST http://localhost:8000/tts
   { "text": "나레이션 텍스트", "reference": "reference.wav" }

3. reference.wav: 복제할 목소리 샘플 (5~15초, 깨끗한 음성)
출력: 24kHz WAV`,
      },
      {
        id: 56,
        title: 'ElevenLabs TTS',
        titleKo: 'ElevenLabs TTS',
        format: 'Audio (MP3)',
        duration: 'Text length',
        skills: ['remotion-master', 'remotion-best-practices'],
        stack: ['ElevenLabs API', '@remotion/eleven-labs', 'Node.js'],
        tags: ['TTS', 'Premium', 'Multi-language'],
        prompt: `/remotion-master ElevenLabs TTS로 나레이션을 생성해줘.

rules/voiceover.md 참고:
@remotion/eleven-labs 패키지 사용.
API 키: .env ELEVEN_LABS_API_KEY
음성 ID: voice gallery에서 선택.

사용법:
1. eleven-labs voice 선택 (한국어: "Joon" 등)
2. 텍스트 전달 → MP3 생성
3. Remotion <Audio> 컴포넌트로 영상에 삽입.`,
      },
    ],
  },

  // ═══════════════════════════════════════════════════
  // D. AUTOMATION PIPELINES — 자동화 파이프라인
  // ═══════════════════════════════════════════════════
  {
    id: 'pipelines',
    label: 'Full Automation Pipelines',
    labelKo: '자동화 파이프라인',
    description: 'End-to-end workflows: script generation → image → TTS → render → YouTube upload.',
    icon: '⚡',
    color: '#4ade80',
    templates: [
      {
        id: 57,
        title: 'Full Auto Pipeline (Script→Render→Upload)',
        titleKo: '풀 오토 파이프라인',
        format: 'Any',
        duration: 'Variable',
        skills: ['remotion-master'],
        stack: ['Fireworks AI', 'Gemini Imagen 3', 'Gemini TTS', 'Remotion', 'ffmpeg', 'YouTube API'],
        tags: ['Pipeline', 'End-to-End', 'Auto'],
        prompt: `/remotion-master 풀 오토 영상 생성 파이프라인을 만들어줘.

7단계 자동화:
1. Script   → AI(Fireworks deepseek-v3)로 시나리오 생성
2. Image    → Gemini Imagen 3로 장면별 이미지 생성
3. TTS      → Gemini TTS(Kore)로 나레이션 생성
4. Compose  → Remotion Sequence + Audio + Img 합성
5. Render   → npx remotion render → MP4
6. Post     → ffmpeg로 자막 번인 + BGM 믹싱
7. Upload   → YouTube API 자동 업로드

환경변수: GEMINI_API_KEY, FIREWORKS_API_KEY
인증: youtube_token.json + client_secret.json`,
      },
      {
        id: 58,
        title: 'Batch Shorts Renderer',
        titleKo: '배치 쇼츠 렌더러',
        format: '9:16',
        duration: 'Multiple',
        skills: ['remotion-master'],
        stack: ['Remotion renderMedia()', 'Node.js Script', 'Batch Processing'],
        tags: ['Pipeline', 'Batch', 'Shorts'],
        prompt: `/remotion-master 배치 쇼츠 렌더러를 만들어줘.

에피소드 데이터 배열을 순회하며 자동 렌더링:

import { bundle } from '@remotion/bundler'
import { renderMedia } from '@remotion/renderer'

const bundleLocation = await bundle(...)
for (const ep of episodes) {
  await renderMedia({
    composition: ep.compositionId,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: \`out/\${ep.id}.mp4\`,
    inputProps: ep.props,
  })
}

에피소드 목록: src/data/episodes.ts`,
      },
      {
        id: 59,
        title: 'Video Factory Pipeline',
        titleKo: 'Video Factory 파이프라인',
        format: '9:16 / 16:9',
        duration: '30–60s',
        skills: ['remotion-master'],
        stack: ['video-factory CLI', 'Commander', 'Fireworks AI', 'Gemini TTS', 'ffmpeg'],
        tags: ['Pipeline', 'CLI', '13 Styles'],
        prompt: `video-factory 전체 파이프라인을 실행해줘.

경로: /c/Users/USER/video-factory

1단계 - 시나리오 생성:
npx tsx src/index.ts generate "주제" --format shorts --style history-if

2단계 - 생성된 디렉토리 확인 후 빌드:
npx tsx src/index.ts build output/[생성된_디렉토리]

파이프라인: Validate → Parse → TTS(Gemini) → Audio Merge → Subtitles → Compose → Report
13개 스타일: history-if, interview, scene-review, animal-world, future-vision, vs-battle, mini-lecture, mystery, transformation, satisfying, experiment, ranking, real-story`,
      },
      {
        id: 60,
        title: 'Storybook Factory Pipeline',
        titleKo: 'Storybook Factory 파이프라인',
        format: '9:16 / 16:9',
        duration: '1–5min',
        skills: ['remotion-master'],
        stack: ['storybook-factory CLI', 'Gemini Imagen 3', 'KenBurns', 'Gemini TTS', 'ffmpeg', 'YouTube API'],
        tags: ['Pipeline', 'Children', 'Full Auto'],
        prompt: `storybook-factory 전체 파이프라인을 실행해줘.

경로: /c/Users/USER/storybook-factory

명령어:
npx tsx src/index.ts create "동화 주제" --format shorts --scenes 8 --animate kenburns

파이프라인:
1. Script   → Fireworks AI(deepseek-v3)로 동화 시나리오 생성
2. Image    → Gemini Imagen 3로 장면별 일러스트 생성
3. Animate  → kenburns(ffmpeg zoompan 5종) 또는 grok(Playwright)
4. TTS      → Gemini TTS(Kore) 나레이션
5. Compose  → ffmpeg로 이미지+오디오+자막 합성
6. Upload   → YouTube API 자동 업로드 (선택)

--animate 옵션: kenburns (안정적) / grok (AI 비디오, fallback 포함)`,
      },
    ],
  },
]

// ── Helpers ──

export function getAllTemplates(): VideoTemplate[] {
  return catalog.flatMap((cat) => cat.templates)
}

export function getTemplateById(id: number): VideoTemplate | undefined {
  return getAllTemplates().find((t) => t.id === id)
}

export function getAllSkills(): string[] {
  const skills = new Set<string>()
  for (const t of getAllTemplates()) {
    for (const s of t.skills) skills.add(s)
  }
  return [...skills].sort()
}

export function getTotalCount(): number {
  return getAllTemplates().length
}
