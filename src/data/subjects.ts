/**
 * 과목 레지스트리 — 대문에서 여기로 갈라진다.
 *
 * ⚠️ 과목마다 프레임이 다르다. 수학 틀을 복붙하지 않는다.
 *    위계가 강한 과목(수학·과학·한자)만 "지도" 구조를 쓰고,
 *    시간축(역사) · 텍스트축(국어) · 실천축(경제)은 각자 다른 구조를 쓴다.
 */

export type SubjectId =
  | 'math' | 'science' | 'korean' | 'hanja'
  | 'khistory' | 'whistory' | 'geography'
  | 'english' | 'coding' | 'economy' | 'logic';

/** 이 과목의 뼈대가 무엇으로 조직되는가 */
export type Spine =
  | 'hierarchy'   // 위계 — 선수/후속. 지도가 의미 있다 (수학·과학·한자)
  | 'timeline'    // 시간축 — 연표·인과 사슬 (한국사·세계사)
  | 'space'       // 공간축 — 지도 위 (지리)
  | 'corpus'      // 텍스트 — 읽은 것이 자산 (국어)
  | 'practice'    // 실천·반복 — 하면서 는다 (영어·코딩)
  | 'toolkit';    // 도구 상자 — 상황에 꺼내 쓰는 것 (논리·경제)

export type Status =
  | 'live'      // 완성, 내용 채우는 중
  | 'frame'     // 프레임만 있음, 내용 비어 있음
  | 'external'  // 외부 앱으로 연결
  | 'planned';  // 아직

export interface Subject {
  id: SubjectId;
  name: string;
  /** 학교가 영어라 병기 */
  en: string;
  /** 한 줄 — 이 과목을 왜 하는가 */
  why: string;
  spine: Spine;
  status: Status;
  /** 대문 카드 색 */
  color: string;
  emoji: string;
  /** 링크 (external이면 외부 URL) */
  href: string;
  /** 학습 단위의 이름 (수학=개념, 역사=사건 …) */
  unit: string;
  /** 이 과목에서 "안다"를 증명하는 행위 */
  proof: string;
  /** 귀국(국제학교 → 한국 학교) 갭에서 이 과목이 맡는 몫 */
  gap: string;
  /** 대문 진행 표시용 — 채워진 항목 수 / 전체 (프레임만이면 0) */
  count?: { filled: number; total: number };
}

export const SUBJECTS: Subject[] = [
  {
    id: 'math', name: '수학', en: 'Mathematics',
    why: '공식을 외우지 않고 백지에서 다시 만들어낸다.',
    spine: 'hierarchy', status: 'live',
    color: '#1D4F9C', emoji: '📐', href: '/math',
    unit: '개념', proof: '백지에 아무것도 없이 다시 유도하기',
    gap: '영어로 배운 용어를 한국어 용어와 잇는다.',
  },
  {
    id: 'science', name: '과학', en: 'Science',
    why: '외운 사실이 아니라 예측하고 확인하는 법.',
    spine: 'hierarchy', status: 'frame',
    color: '#2F855A', emoji: '🔬', href: '/science',
    unit: '현상과 모형', proof: '예측 → 실험 → 어긋난 곳 설명하기',
    gap: 'photosynthesis ↔ 광합성. 용어 전환이 가장 급하다.',
  },
  {
    id: 'korean', name: '국어', en: 'Korean Language',
    why: '한국어를 생활 언어에서 학습 언어로 올린다.',
    spine: 'corpus', status: 'frame',
    color: '#C8102E', emoji: '📖', href: '/korean',
    unit: '텍스트', proof: '읽은 것을 자기 말로 다시 쓰기',
    gap: '가장 큰 갭. 수업을 한국어로 듣는 것 자체가 새 과제.',
  },
  {
    id: 'khistory', name: '한국사', en: 'Korean History',
    why: '학교가 안 가르쳐준 것. 아빠만 할 수 있다.',
    spine: 'timeline', status: 'frame',
    color: '#7C3AED', emoji: '🏛', href: '/khistory',
    unit: '사건과 변화', proof: '왜 그 일이 일어났는지 인과로 다시 말하기',
    gap: '백지에서 시작. 초6 사회 진도와 직결.',
  },
  {
    id: 'whistory', name: '세계사', en: 'World History',
    why: '세연이가 이미 가진 감각. 한국사로 들어가는 문.',
    spine: 'timeline', status: 'frame',
    color: '#B45309', emoji: '🌍', href: '/whistory',
    unit: '사건과 변화', proof: '같은 시기 다른 곳을 나란히 놓고 말하기',
    gap: '오히려 강점. 한국사 진입로로 쓴다.',
  },
  {
    id: 'geography', name: '지리', en: 'Geography',
    why: '역사가 왜 거기서 일어났는지는 땅이 답한다.',
    spine: 'space', status: 'frame',
    color: '#0F766E', emoji: '🗺', href: '/geography',
    unit: '장소와 패턴', proof: '지도를 보고 이유를 설명하기',
    gap: '한국 지리(행정구역·지형)는 새로 배워야 한다.',
  },
  {
    id: 'hanja', name: '한자', en: 'Chinese Characters',
    why: '국어 어휘의 뿌리. 위계가 있어 지도가 잘 맞는다.',
    spine: 'hierarchy', status: 'frame',
    color: '#92400E', emoji: '✍', href: '/hanja',
    unit: '글자', proof: '처음 보는 낱말의 뜻을 한자로 추론하기',
    gap: '국어 교과서 어휘를 못 읽는 원인이 대개 여기다.',
  },
  {
    id: 'coding', name: '컴퓨터', en: 'Computer Science',
    why: '아빠가 제일 잘 가르칠 수 있는 것.',
    spine: 'practice', status: 'frame',
    color: '#334155', emoji: '💻', href: '/coding',
    unit: '만드는 것', proof: '돌아가는 것을 만들고 왜 되는지 설명하기',
    gap: '학교와 무관. 물려주는 영역.',
  },
  {
    id: 'economy', name: '경제', en: 'Economics & Money',
    why: '학교가 안 가르치는데 평생 쓴다.',
    spine: 'toolkit', status: 'frame',
    color: '#065F46', emoji: '💰', href: '/economy',
    unit: '도구', proof: '실제 돈 결정에 써 보기',
    gap: '학교와 무관. 물려주는 영역.',
  },
  {
    id: 'logic', name: '생각하는 법', en: 'Logic & Reasoning',
    why: '다른 모든 과목의 상위 도구.',
    spine: 'toolkit', status: 'frame',
    color: '#5B21B6', emoji: '🧠', href: '/logic',
    unit: '도구', proof: '남의 주장에서 구멍을 찾아내기',
    gap: '학교와 무관. 물려주는 영역.',
  },
  {
    id: 'english', name: '영어', en: 'English',
    why: '이미 강점. 귀국 후 유지가 과제.',
    spine: 'practice', status: 'external',
    color: '#1E40AF', emoji: '🔤', href: 'https://papa-english.vercel.app',
    unit: '반복 항목', proof: '간격반복으로 안 까먹기',
    gap: '거꾸로 — 잃지 않는 것이 과제.',
  },
];

export const BY_SUBJECT: Record<string, Subject> =
  Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

export const SPINE_LABEL: Record<Spine, string> = {
  hierarchy: '위계 — 앞을 알아야 뒤를 안다',
  timeline: '시간축 — 왜 그 일이 일어났나',
  space: '공간축 — 왜 거기였나',
  corpus: '텍스트 — 읽은 것이 쌓인다',
  practice: '실천 — 하면서 는다',
  toolkit: '도구 상자 — 필요할 때 꺼낸다',
};

export const STATUS_LABEL: Record<Status, string> = {
  live: '진행 중',
  frame: '틀만 있음',
  external: '별도 앱',
  planned: '준비 중',
};
