// ══════════════════════════════════════════════════
// 스타일 좌표 도감 · STYLE COORDINATE ATLAS
// 좌표 = [時代] + [階層·地域·機關] + [用途·장르] + [媒體·물성]
// "형용사는 축 하나만 정한다. 구체적 인공물은 수백 개의 상관된 디테일을 압축한 덩어리다."
// 총 96좌표. 고객은 이 좌표 중 하나(또는 둘을 겹쳐) 고르면, 디자인 방향이 강제된다.
// ══════════════════════════════════════════════════

export interface AtlasStyle {
  ko: string;        // 한글 좌표명
  en: string;        // 영문 좌표
  motif: string;     // 한 줄 모티프 — 좌표가 떠안고 오는 정서
  color: string;     // 좌표가 강제하는 대표색 (왼쪽 띠)
  sample?: string;   // 우리 제작 예시 slug (있으면 "예시 보기" 활성)
}

export interface AtlasCategory {
  key: string;
  label: string;     // 印刷·文書 등
  styles: AtlasStyle[];
}

export const atlas: AtlasCategory[] = [
  {
    key: 'print',
    label: '印刷 · 文書',
    styles: [
      { ko: '1970년대 명문대 대학원 핸드아웃', en: 'univ. seminar handout · 1970s', motif: '등사 잉크 냄새 나는 지식의 밀도', color: '#f4f1ea', sample: 'gojeon-academy' },
      { ko: '1960년대 스위스 국제주의 연차보고서', en: "Swiss Int'l Style annual report", motif: '격자 위의 침묵', color: '#d9252a', sample: 'grid-arch' },
      { ko: '빅토리아 약제상 약병 라벨', en: 'Victorian apothecary label · 19c', motif: '장식 활자의 과잉', color: '#3b2a1a', sample: 'old-apothecary' },
      { ko: '1950년대 미국 로드사이드 다이너 메뉴판', en: '1950s American diner menu', motif: '원자시대의 명랑', color: '#1ec8c8', sample: 'rosie-diner' },
      { ko: '1920년대 바우하우스 전시 도록', en: 'Bauhaus exhibition catalog · 1923', motif: '기능이 곧 형태', color: '#e3002b', sample: 'bau-design' },
      { ko: '중세 채식(彩飾) 필사본', en: 'illuminated manuscript · 14c', motif: '금박과 주서(朱書)', color: '#9a1b1b', sample: 'scriptorium' },
      { ko: '2차대전 영국 배급 수첩', en: 'WWII ration book · 1940s', motif: '전시의 검약', color: '#7a6a4f' },
      { ko: '1960년대 NASA 기술각서', en: 'NASA technical memorandum', motif: '공학의 무미건조', color: '#14171c', sample: 'apollo-motors' },
      { ko: '펑크 진(zine) · 복사 전단', en: 'punk zine / xerox flyer · 1977', motif: '복사기의 분노', color: '#111111' },
      { ko: '1960년대 펭귄 페이퍼백', en: 'Penguin paperback · 1960s', motif: '삼색 띠의 질서', color: '#ff6f00', sample: 'penguin-books' },
      { ko: '조선 후기 방각본(坊刻本)', en: 'Joseon woodblock book · 18c', motif: '먹과 계선의 결', color: '#2b2520', sample: 'banggak-jae' },
      { ko: '19세기 브로드시트 신문 1면', en: 'broadsheet newspaper front · 19c', motif: '활자의 벽', color: '#e8e2d4', sample: 'daily-press' },
    ],
  },
  {
    key: 'music',
    label: '音盤 · 音樂',
    styles: [
      { ko: '1984 일본 시티팝 LP 재킷', en: 'Japanese city pop LP · 1984', motif: '끝나지 않는 여름', color: '#ff5e8a', sample: 'midnight-city' },
      { ko: 'Blue Note 재즈 LP', en: 'Blue Note jazz cover · 1956', motif: '검정 위의 황혼', color: '#1a2f6e', sample: 'bluenote-seoul' },
      { ko: '70년대 프로그레시브 록 게이트폴드', en: 'prog rock gatefold · 1973', motif: '펼치면 우주', color: '#3a1d5d' },
      { ko: '80년대 신스웨이브 / 아웃런', en: 'synthwave / outrun · 198x', motif: '미래였던 과거', color: '#ff2e97', sample: 'neon-run' },
      { ko: '90년대 그런지 CD 부클릿', en: 'grunge CD booklet · 1993', motif: '초점 나간 권태', color: '#5a5347' },
      { ko: '모타운 7인치 45회전 라벨', en: 'Motown 45 label · 196x', motif: '한 바퀴의 영혼', color: '#f0b323' },
      { ko: '80년대 영국 인디 슬리브 (4AD풍)', en: 'UK indie sleeve · 198x', motif: '몽롱한 탐미', color: '#6b7a8f' },
      { ko: '카세트 J카드', en: 'cassette J-card · 198x', motif: '되감기의 정서', color: '#2b2b2b' },
      { ko: '90년대 레이브 플라이어', en: 'rave flyer · 199x', motif: '형광의 밤', color: '#aaff00', sample: 'rave-504' },
    ],
  },
  {
    key: 'screen',
    label: '스크린 · UI',
    styles: [
      { ko: '초대 매킨토시 시스템 매뉴얼 (1984)', en: 'original Macintosh manual', motif: '친절한 1비트', color: '#bdbdbd' },
      { ko: 'MS-DOS / 텍스트 모드', en: 'MS-DOS text mode · 198x', motif: '깜빡이는 커서', color: '#cccccc' },
      { ko: '그린 포스포 CRT 터미널', en: 'green phosphor CRT · 197x', motif: '야간의 형광', color: '#33ff66', sample: 'terminal-academy' },
      { ko: '베이퍼웨이브', en: 'vaporwave (80s 차용)', motif: '기업 유토피아의 유령', color: '#ff71ce', sample: 'vapor-mall' },
      { ko: 'Windows 95 UI', en: 'Windows 95 · 1995', motif: '회색 입체의 안정', color: '#008080', sample: 'reboot-pc' },
      { ko: '텔레텍스트 / 비디오텍스', en: 'teletext / videotex · 198x', motif: '거친 색 블록', color: '#ffcc00' },
      { ko: '90년대 초 개인 홈페이지 (GeoCities)', en: 'GeoCities homepage · 1997', motif: '반짝이는 아마추어리즘', color: '#0000ee', sample: 'geocity-goods' },
      { ko: '80년대 오락실 어트랙트 화면', en: 'arcade attract screen · 198x', motif: '코인을 부르는 점멸', color: '#ff0040' },
      { ko: 'Y2K 프루티거 에어로', en: 'Frutiger Aero · 2005', motif: '투명 유리의 낙관', color: '#3fb6e8' },
      { ko: '8비트 게임 패키지 (패미컴/MSX)', en: '8-bit game box · 198x', motif: '박스가 게임보다 멋졌다', color: '#e60012' },
    ],
  },
  {
    key: 'ad',
    label: '廣告 · 宣傳',
    styles: [
      { ko: '냉전기 소련 우주개발 포스터', en: 'Soviet space poster · 196x', motif: '별을 향한 행진', color: '#c41e1e', sample: 'cosmos-cafe' },
      { ko: '러시아 구성주의 (로드첸코)', en: 'Constructivism · 1923', motif: '사선의 선동', color: '#d62828' },
      { ko: '아르누보 포스터 (무하풍)', en: 'Art Nouveau poster · 1896', motif: '곡선의 관능', color: '#b59a5a', sample: 'mucha-floral' },
      { ko: '1950년대 미국 광고 (매드맨)', en: '1950s American ad', motif: '풍요의 약속', color: '#e84a5f', sample: 'mad-avenue' },
      { ko: '쇼와 일본 상점가 광고', en: 'Shōwa Japan shop ad · 196x', motif: '활기찬 상점가', color: '#e2371d' },
      { ko: '2차대전 모병 포스터 (Uncle Sam)', en: 'WWII recruitment poster', motif: '너를 원한다', color: '#1f3a73' },
      { ko: '쿠바 OSPAAAL 연대 포스터', en: 'OSPAAAL solidarity poster · 196x', motif: '제3세계의 색면', color: '#ff6b00' },
      { ko: '중국 문화대혁명 선전화', en: 'Cultural Revolution poster · 196x', motif: '붉은 태양', color: '#d4151c' },
      { ko: '60년대 사이키델릭 콘서트 포스터', en: 'psychedelic poster · 1967', motif: '환각의 소용돌이', color: '#ff00aa', sample: 'psyche-ink' },
      { ko: '1900년대 서커스 / 약장수 포스터', en: 'circus / patent-medicine bill · 1900', motif: '경이! 경이!', color: '#b8232f' },
    ],
  },
  {
    key: 'arch',
    label: '建築 · 圖面',
    styles: [
      { ko: '청사진 (블루프린트)', en: 'cyanotype blueprint · 19-20c', motif: '흰 선의 설계', color: '#0b3d91', sample: 'blueprint-studio' },
      { ko: '브루탈리즘 현상설계 패널', en: 'Brutalist competition board · 196x', motif: '콘크리트의 위엄', color: '#6e6e6e' },
      { ko: '일본 메타볼리즘 도면', en: 'Metabolism diagram · 196x', motif: '도시는 생장한다', color: '#2a3c4d' },
      { ko: '미드센추리 모던 (임스 시대)', en: 'mid-century modern · 195x', motif: '낙천적 기능주의', color: '#e8a33d', sample: 'midcentury-furn' },
      { ko: '북유럽 가구 카탈로그 (IKEA풍)', en: 'Nordic furniture catalog · 198x', motif: '민주적 디자인', color: '#0051ba', sample: 'nordic-home' },
      { ko: '아이소메트릭 도시 (심시티풍)', en: 'isometric city · 199x', motif: '신의 시점', color: '#3a9d5d' },
      { ko: '고딕 대성당 입면도', en: 'Gothic cathedral elevation · 13c', motif: '돌의 기하학', color: '#4a4036' },
    ],
  },
  {
    key: 'package',
    label: '包裝 · 商品',
    styles: [
      { ko: '쇼와 막과자 포장지', en: 'Shōwa dagashi wrapper · 196x', motif: '10엔의 행복', color: '#f25c54' },
      { ko: '소련 GOST 식품 라벨', en: 'Soviet GOST food label · 197x', motif: '계획경제의 무뚝뚝함', color: '#9b2226' },
      { ko: '80년대 한국 불량식품 / 뽑기 봉지', en: 'Korean penny-candy bag · 198x', motif: '100원의 도박', color: '#ff4d00', sample: 'bunsik-memory' },
      { ko: '레트로 청량음료 병 / 캔', en: 'retro soda bottle · 195x', motif: '청량의 곡선', color: '#e01a2b', sample: 'pop-soda' },
      { ko: '아르데코 향수병 라벨', en: 'Art Deco perfume label · 192x', motif: '기하의 사치', color: '#caa75d' },
      { ko: '성냥갑 라벨 (다방·업소)', en: 'matchbox label · 197x', motif: '주머니 속 광고', color: '#c0392b' },
      { ko: '빈티지 씨앗 봉투', en: 'vintage seed packet · 1900', motif: '봉투 속 약속', color: '#5a8f4f' },
      { ko: '80년대 VHS 비디오 빅박스', en: 'VHS big-box rental case · 198x', motif: '대여점의 밤', color: '#1c1c2e' },
      { ko: '빈티지 시가 / 담배 라벨', en: 'vintage cigar label · 19c', motif: '황금빛 허영', color: '#a67c2e' },
    ],
  },
  {
    key: 'map',
    label: '地圖 · 圖譜',
    styles: [
      { ko: '런던 지하철 노선도 (벡式)', en: 'Beck-style transit map · 1933', motif: '지리를 버린 명료', color: '#dc241f', sample: 'transit-tour' },
      { ko: '19세기 박물학 도판 (오듀본풍)', en: 'naturalist plate · 19c', motif: '정밀의 경이', color: '#7a8c5a', sample: 'botanica' },
      { ko: '중세 마파문디', en: 'medieval mappa mundi · 13c', motif: '신앙의 지리', color: '#9c6b30' },
      { ko: '포르톨라노 해도(航海圖)', en: 'portolan nautical chart · 15c', motif: '바람의 선', color: '#8a6d3b' },
      { ko: '17세기 천문 성도(星圖)', en: 'celestial atlas · 17c', motif: '신화의 하늘', color: '#1a2452', sample: 'constellation' },
      { ko: 'USGS 지형도', en: 'USGS topographic map · 20c', motif: '땅의 등고', color: '#8b6f47' },
      { ko: '해부 도판 (그레이 解剖學)', en: "Gray's Anatomy plate · 1858", motif: '몸의 지도', color: '#3a3a3a' },
      { ko: '아르데코 여행 포스터', en: 'Art Deco travel poster · 193x', motif: '여행의 유선형', color: '#1f6e8c' },
    ],
  },
  {
    key: 'voice',
    label: '文學 · 목소리',
    styles: [
      { ko: '1930년대 하드보일드 탐정 1인칭', en: 'hardboiled detective · 1930s', motif: '건조하게, 냉소적으로', color: '#2b2b2b', sample: 'noir-case' },
      { ko: '19세기 박물학자 현장 채집 노트', en: 'naturalist field notes · 19c', motif: '관찰의 겸손', color: '#6b5d3e' },
      { ko: '조선 문인의 척독(尺牘)', en: 'Joseon literati letter · 18c', motif: '절제된 정(情)', color: '#3a3026' },
      { ko: '무협지(武俠誌)', en: 'wuxia serial · 20c', motif: '강호의 풍모', color: '#7a1f1f' },
      { ko: '변사(辯士) 무성영화 해설', en: 'silent-film narrator · 192x', motif: '보시라, 이 장면을!', color: '#1a1a1a' },
      { ko: '빅토리아 고딕 괴기소설', en: 'Victorian gothic horror · 19c', motif: '음울한 만연체', color: '#2e2233' },
      { ko: '전보(電報) 문체', en: 'telegram style · 20c', motif: '단어당 요금', color: '#4a4a4a' },
      { ko: '관공서 공문 / 훈령체', en: 'government circular · 20c', motif: '건조한 권위', color: '#3b4a5a' },
      { ko: '50년대 SF 펄프 잡지', en: 'SF pulp magazine · 195x', motif: '경이의 펄프', color: '#ff7a00' },
      { ko: '필름 누아르 타이틀 / 포스터', en: 'film noir title · 194x', motif: '명암의 범죄', color: '#111111' },
    ],
  },
  {
    key: 'game',
    label: '게임 · 놀이',
    styles: [
      { ko: '80년대 오락실 캐비닛 사이드아트', en: 'arcade cabinet art · 198x', motif: '동전을 삼키는 그림', color: '#ff1e56' },
      { ko: '16비트 JRPG 도트', en: '16-bit JRPG pixel · 199x', motif: '픽셀의 모험', color: '#2c6fbb' },
      { ko: '초기 D&D 룰북', en: 'early D&D rulebook · 1978', motif: '상상의 표(table)', color: '#5a3a22' },
      { ko: '핀볼 백글래스', en: 'pinball backglass · 196x', motif: '전구가 박힌 그림', color: '#ffb300' },
      { ko: '80년대 보드게임 박스', en: '1980s board game box', motif: '거실의 모험', color: '#c0392b' },
      { ko: '딱지 / 뽑기 / 판박이', en: 'Korean paper toys · 198x', motif: '100원어치 행복', color: '#ef8b00' },
      { ko: '80년대 SF/판타지 페이퍼백 표지', en: 'SF/fantasy paperback cover · 198x', motif: '에어브러시의 모험', color: '#3a2a7a' },
    ],
  },
  {
    key: 'korea',
    label: '韓國',
    styles: [
      { ko: '70년대 새마을운동 포스터', en: 'Saemaul movement poster · 197x', motif: '잘 살아보세', color: '#2e7d32', sample: 'saemaul-store' },
      { ko: '80년대 국민학교 교과서', en: '1980s elementary textbook', motif: '갱지 냄새', color: '#d9c59f' },
      { ko: '7080 극장 간판 손글씨', en: 'cinema hand-painted billboard · 197x', motif: '손으로 그린 스타', color: '#c1272d' },
      { ko: '이발소 그림', en: 'barbershop painting · 197x', motif: '이발소의 낙원', color: '#1e88a8' },
      { ko: '7080 다방 메뉴 · 성냥', en: 'da-bang menu & matches · 197x', motif: '마담과 디제이', color: '#8d5524' },
      { ko: '88 서울올림픽 그래픽 (호돌이)', en: 'Seoul 1988 Olympics graphics', motif: '굴렁쇠의 낙관', color: '#0067a3' },
      { ko: '하이텔 / 천리안 PC통신', en: 'Hitel/Chollian BBS · 199x', motif: '삐— 접속음', color: '#0a4da3' },
      { ko: '80년대 만화방 순정/명랑만화', en: 'manhwa rental · 198x', motif: '갱지 위의 설렘', color: '#e57399' },
      { ko: '신문 4컷 시사만화', en: '4-panel editorial cartoon', motif: '한 컷의 촌철', color: '#222222' },
      { ko: '옛 한약방 / 의원 간판', en: 'old herbal-clinic signboard · 197x', motif: '행서의 권위', color: '#1f5c3a' },
      { ko: '국민학교 가정통신문 (등사)', en: 'mimeographed school notice · 198x', motif: '등사기의 보라색', color: '#5b3a8a' },
      { ko: '반공 · 새마을 표어 현수막', en: 'anti-communist/Saemaul banner · 197x', motif: '표어의 시대', color: '#c0392b' },
      { ko: '86 아시안게임 / 단청 그래픽', en: '1986 Asiad / dancheong graphic', motif: '전통의 원색', color: '#1b6ca8' },
      { ko: '80년대 버스 회수권 · 지하철 토큰', en: 'bus tickets & subway token · 198x', motif: '찢어 쓰던 회수권', color: '#b8860b' },
    ],
  },
];

export const atlasTotal = atlas.reduce((n, c) => n + c.styles.length, 0); // 96

export const atlasPhilosophy = {
  formula: '좌표 = [時代] + [階層·地域·機關] + [用途·장르] + [媒體·물성]',
  litmus: '서로 모르는 두 사람에게 이 좌표만 주면, 알아볼 만큼 비슷한 결과가 나오는가? 예 → 좌표. 아니오 → 아직 형용사.',
  layering: '좌표는 겹쳐 쓸 때 새로움이 난다 —「1970년대 핸드아웃 × CRT 터미널」처럼. 단, 각 성분은 여전히 구체적 인공물이어야 한다.',
};
