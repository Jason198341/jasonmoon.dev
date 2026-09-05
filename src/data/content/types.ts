/** 사이트 콘텐츠 — 전부 정적. Supabase 안 씀. */

export type BlankStatus = 'todo' | 'doing' | 'done';

/** 개념별 백지 숙달도 */
export interface Progress {
  status: BlankStatus;
  /** 0~5 */
  mastery: number;
  /** 마지막 확인일 YYYY-MM-DD */
  reviewed?: string;
}

/** 백지 훈련 기록 */
export interface RecordEntry {
  conceptId: string;
  date: string;
  who: '세연' | '아빠' | '같이';
  /** 설명 듣기 전 백지 */
  before?: string;
  /** 설명 들은 뒤 백지 */
  after?: string;
  /** 0~5 자평 */
  score?: number;
  /** 아빠 관찰 */
  note?: string;
  /** public/ 기준 이미지 경로 */
  images?: string[];
}

/** 일지 */
export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  body: string;
  mood?: 'good' | 'soso' | 'hard' | 'break';
  conceptIds?: string[];
}

/** 게시판 */
export type PostCategory = 'thought' | 'feedback' | 'question' | 'notice';

export interface Post {
  id: string;
  category: PostCategory;
  date: string;
  title: string;
  body: string;
  author: '아빠' | '세연';
  conceptId?: string;
  pinned?: boolean;
  comments?: { author: string; date: string; body: string }[];
}

/** 강의 노트 */
export interface Note {
  id: string;
  date: string;
  title: string;
  body: string;
  conceptId?: string;
  tags?: string[];
}

/** 자료실 — 파일은 public/files/ 에 둔다 */
export type FileCategory = 'homework' | 'worksheet' | 'material' | 'photo';

export interface FileItem {
  id: string;
  date: string;
  title: string;
  category: FileCategory;
  /** public 기준 경로. 예: /files/2026-09-05_소수곱셈.pdf */
  path: string;
  by: '아빠' | '세연';
  conceptId?: string;
  note?: string;
}

export const MOOD_LABEL: Record<NonNullable<JournalEntry['mood']>, string> = {
  good: '잘 됐다', soso: '그럭저럭', hard: '힘들었다', break: '돌파했다',
};

export const CAT_LABEL: Record<PostCategory, string> = {
  thought: '단상', feedback: '피드백', question: '질문', notice: '공지',
};

export const FILE_LABEL: Record<FileCategory, string> = {
  homework: '숙제', worksheet: '학습지', material: '자료', photo: '백지 사진',
};
