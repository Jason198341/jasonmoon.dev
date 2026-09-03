// ══════════════════════════════════════════════════
// PORTFOLIO — 홈페이지 제작 샘플 (가상 클라이언트)
// 각 샘플 = "시대 + 기관 + 매체" 디자인 디렉션을 실제 업종에 적용한 것.
// 추상적 형용사("세련된") 대신 재현 가능한 레퍼런스로 디자인 방향을 못박는다.
// ══════════════════════════════════════════════════

export interface PortfolioSample {
  slug: string;            // /portfolio/[slug]
  no: string;              // 표시용 번호 (01..10)
  business: string;        // 가상 업체명
  industry: string;        // 업종
  styleRef: string;        // 시대+기관+매체 레퍼런스
  era: string;             // 연대 라벨
  blurb: string;           // 한 줄 설명
  swatch: string;          // 카드 미리보기 대표색 (hex)
  swatchInk: string;       // 카드 위 텍스트색
  tag: 'premium' | 'value'; // 투트랙 포지션
}

export const portfolio: PortfolioSample[] = [
  {
    slug: 'gojeon-academy',
    no: '01',
    business: '고전인문학당',
    industry: '인문 강좌 · 독서모임',
    styleRef: '1970년대 명문대 대학원 강의 핸드아웃',
    era: 'c. 1972',
    blurb: '타자기 활자, 흑백, 넓은 여백. 논리와 텍스트 중심의 학구적 권위.',
    swatch: '#f4f1ea',
    swatchInk: '#1a1a1a',
    tag: 'value',
  },
  {
    slug: 'jeongmin-tax',
    no: '02',
    business: '정민 세무회계',
    industry: '세무사 사무소',
    styleRef: '1960년대 정부 정책 백서',
    era: 'c. 1965',
    blurb: '공문서 레이아웃, 번호 체계, 표 중심. 빈틈 없는 신뢰감.',
    swatch: '#eae6db',
    swatchInk: '#2a2a28',
    tag: 'value',
  },
  {
    slug: 'vision-partners',
    no: '03',
    business: '비전파트너스',
    industry: '경영 컨설팅',
    styleRef: '1980년대 컨설팅 전략 보고서 (McKinsey·BCG)',
    era: 'c. 1985',
    blurb: '도표 중심, 계층 구조, 임원 보고용. 한눈에 들어오는 전략적 권위.',
    swatch: '#0f2a43',
    swatchInk: '#e8eef4',
    tag: 'premium',
  },
  {
    slug: 'bosaeng-clinic',
    no: '04',
    business: '보생한의원',
    industry: '한의원 · 의료',
    styleRef: '1950년대 과학 학술지 논문',
    era: 'c. 1958',
    blurb: '세리프 본문, 그래프, 각주. 임상적 정밀함과 학술적 차분함.',
    swatch: '#fbfaf7',
    swatchInk: '#222',
    tag: 'value',
  },
  {
    slug: 'prime-asset',
    no: '05',
    business: '프라임에셋',
    industry: '자산관리 · 부동산',
    styleRef: '1990년대 투자은행 IPO 제안서',
    era: 'c. 1996',
    blurb: '데이터 중심, 시장 분석, 재무 차트. 자본의 무게가 느껴지는 밀도.',
    swatch: '#10221c',
    swatchInk: '#d4af7a',
    tag: 'premium',
  },
  {
    slug: 'apollo-motors',
    no: '06',
    business: '아폴로 모터스',
    industry: '자동차 정비 · 튜닝',
    styleRef: '1960년대 NASA 엔지니어링 기술 매뉴얼',
    era: 'c. 1967',
    blurb: '단면도, 규격표, 기술 설명. 정비를 공학으로 보이게 만든다.',
    swatch: '#14171c',
    swatchInk: '#e6a93b',
    tag: 'premium',
  },
  {
    slug: 'studio-bake',
    no: '07',
    business: '스튜디오 베이크',
    industry: '베이커리 · 공방',
    styleRef: '1970년대 MIT 연구실 실험노트',
    era: 'c. 1974',
    blurb: '손그림 도식, 계산 과정, 모눈 노트. 손맛과 정밀함의 결합.',
    swatch: '#f7f3e8',
    swatchInk: '#3a3326',
    tag: 'value',
  },
  {
    slug: 'harvard-edu',
    no: '08',
    business: '더하버드 입시학원',
    industry: '입시 · 교육',
    styleRef: '1980년대 경영대학원 케이스스터디 교재',
    era: 'c. 1988',
    blurb: '사례 분석, 토론 질문, 프레임워크. 합격을 설계하는 방법론.',
    swatch: '#7c1f2b',
    swatchInk: '#f5ece0',
    tag: 'value',
  },
  {
    slug: 'bunker-crossfit',
    no: '09',
    business: '벙커 크로스핏',
    industry: '크로스핏 · 헬스장',
    styleRef: '1940년대 군사 작전 브리핑 문서',
    era: 'c. 1944',
    blurb: '지도, 흐름도, 단계별 작전. 운동을 미션처럼 만든다.',
    swatch: '#1c2118',
    swatchInk: '#c4d44a',
    tag: 'value',
  },
  {
    slug: 'jeongmil-interior',
    no: '10',
    business: '정밀 인테리어',
    industry: '인테리어 · 시공',
    styleRef: '1990년대 글로벌 제조기업 품질관리(QC) 매뉴얼',
    era: 'c. 1993',
    blurb: 'SOP, 플로우차트, 체크리스트. 시공을 공정으로 증명한다.',
    swatch: '#e9ecee',
    swatchInk: '#1d2733',
    tag: 'premium',
  },
  { slug: 'grid-arch', no: '11', business: '그리드 건축사사무소', industry: '건축 설계', styleRef: '1960년대 스위스 국제주의 연차보고서', era: 'c. 1962', blurb: '격자 위의 절제. 침묵으로 쌓은 신뢰.', swatch: '#d9252a', swatchInk: '#ffffff', tag: 'premium' },
  { slug: 'old-apothecary', no: '12', business: '올드 어퍼시너리', industry: '수제 화장품·비누', styleRef: '빅토리아 약제상 약병 라벨', era: 'c. 1890', blurb: '장식 활자와 갈색 유리병의 정성.', swatch: '#3b2a1a', swatchInk: '#e8dcc8', tag: 'value' },
  { slug: 'rosie-diner', no: '13', business: '로지스 다이너', industry: '수제버거·밀크셰이크', styleRef: '1950년대 미국 로드사이드 다이너 메뉴판', era: 'c. 1955', blurb: '원자시대의 명랑한 식욕.', swatch: '#1ec8c8', swatchInk: '#111111', tag: 'value' },
  { slug: 'bau-design', no: '14', business: '바우 디자인', industry: '가구·디자인 스튜디오', styleRef: '1920년대 바우하우스 전시 도록', era: 'c. 1923', blurb: '기능이 곧 형태. 원색과 기하의 선언.', swatch: '#e3002b', swatchInk: '#ffffff', tag: 'premium' },
  { slug: 'scriptorium', no: '15', business: '스크립토리움', industry: '와인바·공방', styleRef: '중세 채식(彩飾) 필사본', era: 'c. 14C', blurb: '금박과 주서(朱書)의 손길.', swatch: '#9a1b1b', swatchInk: '#f0e6c8', tag: 'premium' },
  { slug: 'penguin-books', no: '16', business: '펭귄 책방', industry: '동네책방·북카페', styleRef: '1960년대 펭귄 페이퍼백', era: 'c. 1962', blurb: '삼색 띠의 질서. 읽는 즐거움의 표준.', swatch: '#ff6f00', swatchInk: '#ffffff', tag: 'value' },
  { slug: 'banggak-jae', no: '17', business: '방각재', industry: '전통찻집·한정식', styleRef: '조선 후기 방각본(坊刻本)', era: 'c. 18C', blurb: '먹과 계선의 결. 단정한 옛 책의 품위.', swatch: '#2b2520', swatchInk: '#e8e0d0', tag: 'value' },
  { slug: 'daily-press', no: '18', business: '데일리 프레스', industry: '로컬 매거진·편집숍', styleRef: '19세기 브로드시트 신문 1면', era: 'c. 1890', blurb: '활자의 벽. 한 면에 담은 동네의 모든 것.', swatch: '#e8e2d4', swatchInk: '#1a1a1a', tag: 'value' },
  { slug: 'midnight-city', no: '19', business: '미드나잇 시티', industry: '칵테일바·라운지', styleRef: '1984 일본 시티팝 LP 재킷', era: 'c. 1984', blurb: '끝나지 않는 여름. 네온빛 도시의 밤.', swatch: '#ff5e8a', swatchInk: '#ffffff', tag: 'premium' },
  { slug: 'bluenote-seoul', no: '20', business: '블루노트 서울', industry: '재즈바·LP카페', styleRef: 'Blue Note 재즈 LP', era: 'c. 1956', blurb: '검정 위의 황혼. 음반이 곧 분위기.', swatch: '#1a2f6e', swatchInk: '#f0c040', tag: 'premium' },
  { slug: 'neon-run', no: '21', business: '네온 런', industry: '게임카페·PC방', styleRef: '80년대 신스웨이브 / 아웃런', era: 'c. 198x', blurb: '미래였던 과거. 보랏빛 지평선의 질주.', swatch: '#ff2e97', swatchInk: '#00ffff', tag: 'value' },
  { slug: 'rave-504', no: '22', business: '레이브 504', industry: '클럽·이벤트', styleRef: '90년대 레이브 플라이어', era: 'c. 199x', blurb: '형광의 밤. 멈추지 않는 비트.', swatch: '#aaff00', swatchInk: '#111111', tag: 'value' },
  { slug: 'terminal-academy', no: '23', business: '터미널 아카데미', industry: '코딩학원·IT교육', styleRef: '그린 포스포 CRT 터미널', era: 'c. 197x', blurb: '야간의 형광. 깜빡이는 커서의 집중.', swatch: '#33ff66', swatchInk: '#001a08', tag: 'value' },
  { slug: 'reboot-pc', no: '24', business: '리부트 컴퓨터', industry: '컴퓨터 수리·조립', styleRef: 'Windows 95 UI', era: 'c. 1995', blurb: '회색 입체의 안정. 클릭하면 켜지는 향수.', swatch: '#008080', swatchInk: '#ffffff', tag: 'value' },
  { slug: 'vapor-mall', no: '25', business: '베이퍼 몰', industry: '빈티지샵·카페', styleRef: '베이퍼웨이브', era: 'c. 198x', blurb: '기업 유토피아의 유령. 파스텔 노스탤지어.', swatch: '#ff71ce', swatchInk: '#01cdfe', tag: 'value' },
  { slug: 'geocity-goods', no: '26', business: '지오시티', industry: '문구·소품샵', styleRef: '90년대 초 개인 홈페이지(GeoCities)', era: 'c. 1997', blurb: '반짝이는 아마추어리즘. GIF가 춤추던 시절.', swatch: '#0000ee', swatchInk: '#ffff00', tag: 'value' },
  { slug: 'cosmos-cafe', no: '27', business: '코스모스', industry: '천문·과학카페', styleRef: '냉전기 소련 우주개발 포스터', era: 'c. 196x', blurb: '별을 향한 행진. 붉은 미래의 낙관.', swatch: '#c41e1e', swatchInk: '#f0d040', tag: 'value' },
  { slug: 'mucha-floral', no: '28', business: '무하 플로랄', industry: '플라워샵·네일', styleRef: '아르누보 포스터(무하풍)', era: 'c. 1896', blurb: '곡선의 관능. 꽃과 여인의 장식 미학.', swatch: '#b59a5a', swatchInk: '#3a2e1a', tag: 'premium' },
  { slug: 'mad-avenue', no: '29', business: '매드 애비뉴', industry: '광고·마케팅 대행', styleRef: '1950년대 미국 광고 (매드맨)', era: 'c. 1955', blurb: '풍요의 약속. 카피 한 줄의 자신감.', swatch: '#e84a5f', swatchInk: '#ffffff', tag: 'premium' },
  { slug: 'psyche-ink', no: '30', business: '사이키 잉크', industry: '타투·레코드샵', styleRef: '60년대 사이키델릭 콘서트 포스터', era: 'c. 1967', blurb: '환각의 소용돌이. 녹아내리는 글자.', swatch: '#ff00aa', swatchInk: '#ffff00', tag: 'value' },
  { slug: 'blueprint-studio', no: '31', business: '블루프린트 스튜디오', industry: '건축·인테리어 설계', styleRef: '청사진(블루프린트)', era: 'c. 19-20C', blurb: '흰 선의 설계. 도면이 곧 신뢰.', swatch: '#0b3d91', swatchInk: '#ffffff', tag: 'premium' },
  { slug: 'midcentury-furn', no: '32', business: '미드센추리', industry: '가구·소품', styleRef: '미드센추리 모던 (임스 시대)', era: 'c. 195x', blurb: '낙천적 기능주의. 따뜻한 곡선의 가구.', swatch: '#e8a33d', swatchInk: '#2a2118', tag: 'premium' },
  { slug: 'nordic-home', no: '33', business: '노르딕 홈', industry: '가구·인테리어', styleRef: '북유럽 가구 카탈로그 (IKEA풍)', era: 'c. 198x', blurb: '민주적 디자인. 누구나 누리는 단정함.', swatch: '#0051ba', swatchInk: '#ffffff', tag: 'value' },
  { slug: 'bunsik-memory', no: '34', business: '추억의 분식', industry: '분식·포장마차', styleRef: '80년대 한국 불량식품 / 뽑기 봉지', era: 'c. 198x', blurb: '100원의 도박. 원색의 정겨운 촌스러움.', swatch: '#ff4d00', swatchInk: '#ffffff', tag: 'value' },
  { slug: 'pop-soda', no: '35', business: '팝 소다', industry: '수제음료·소다', styleRef: '레트로 청량음료 병 / 캔', era: 'c. 195x', blurb: '청량의 곡선. 톡 쏘는 레트로 한 모금.', swatch: '#e01a2b', swatchInk: '#ffffff', tag: 'value' },
  { slug: 'transit-tour', no: '36', business: '트랜짓 투어', industry: '여행사·투어', styleRef: '런던 지하철 노선도 (벡式)', era: 'c. 1933', blurb: '지리를 버린 명료. 한눈에 그려지는 여정.', swatch: '#dc241f', swatchInk: '#ffffff', tag: 'value' },
  { slug: 'botanica', no: '37', business: '보타니카', industry: '플라워·식물샵', styleRef: '19세기 박물학 도판 (오듀본풍)', era: 'c. 19C', blurb: '정밀의 경이. 세밀화로 그린 식물의 품격.', swatch: '#7a8c5a', swatchInk: '#2a2e1a', tag: 'premium' },
  { slug: 'constellation', no: '38', business: '성좌', industry: '점성·타로카페', styleRef: '17세기 천문 성도(星圖)', era: 'c. 17C', blurb: '신화의 하늘. 금빛 별자리의 신비.', swatch: '#1a2452', swatchInk: '#d4af37', tag: 'premium' },
  { slug: 'noir-case', no: '39', business: '느와르 케이스', industry: '방탈출·추리카페', styleRef: '1930년대 하드보일드 탐정', era: 'c. 193x', blurb: '건조하게, 냉소적으로. 사건의 그림자.', swatch: '#2b2b2b', swatchInk: '#c0a060', tag: 'value' },
  { slug: 'saemaul-store', no: '40', business: '새마을 상회', industry: '동네마트·철물점', styleRef: '70년대 새마을운동 포스터', era: 'c. 197x', blurb: '잘 살아보세. 굵은 표어의 정직한 활력.', swatch: '#2e7d32', swatchInk: '#ffffff', tag: 'value' },
  { slug: 'lumiere-spa', no: '41', business: '뤼미에르 스파', industry: '뷰티·네일·스파', styleRef: '브랜드 색감(다크·앰버) × UI UX Pro Max UX', era: '2026 NOW', blurb: '내 다크+골드 색감에 Pro Max의 모던 UX를 입힌 다크 럭셔리.', swatch: '#ffb000', swatchInk: '#000000', tag: 'premium' },
];

export function getPortfolio(): PortfolioSample[] {
  return portfolio;
}
