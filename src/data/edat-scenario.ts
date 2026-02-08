export interface Agent {
  id: string;
  role: string;
  titleKo: string;
  kpi: string;
  constraint: string;
  color: string;
  icon: string;
}

export interface ScenarioMessage {
  agentId: string;
  content: string;
  target?: string;
  highlight?: string;
}

export interface Phase {
  id: string;
  nameKo: string;
  description: string;
  messages: ScenarioMessage[];
}

export interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ConsensusScore {
  label: string;
  value: number;
  agentId: string;
}

export interface FinalReport {
  recommendationKo: string;
  conditions: string[];
  metrics: Metric[];
  consensusScores: ConsensusScore[];
  riskLevel: 'low' | 'medium' | 'high';
  riskLabel: string;
  summary: string;
}

export interface Scenario {
  titleKo: string;
  description: string;
  phases: Phase[];
  finalReport: FinalReport;
}

export const AGENTS: Agent[] = [
  {
    id: 'pm',
    role: 'PM',
    titleKo: '상품기획',
    kpi: '고객 만족도 · 시장 트렌드',
    constraint: '출시 일정 준수',
    color: '#3b82f6',
    icon: '📋',
  },
  {
    id: 'eng',
    role: 'ENG',
    titleKo: '설계',
    kpi: '기술 실현성 · 안전 표준',
    constraint: '공정 복잡도',
    color: '#f97316',
    icon: '⚙️',
  },
  {
    id: 'fin',
    role: 'FIN',
    titleKo: '재무',
    kpi: '제조 원가 · ROI',
    constraint: '예산 범위',
    color: '#10b981',
    icon: '💰',
  },
  {
    id: 'exec',
    role: 'EXEC',
    titleKo: '경영진',
    kpi: '전사 전략 · 브랜드',
    constraint: '장기 수익성',
    color: '#a855f7',
    icon: '👔',
  },
];

export const AGENT_MAP: Record<string, Agent> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a]),
);

export const SCENARIO: Scenario = {
  titleKo: '차세대 전기차용 친환경 소재 크래시패드 도입 건',
  description:
    '재활용 PP 소재를 적용한 크래시패드 도입에 대한 4개 부서 의사결정 시뮬레이션',
  phases: [
    {
      id: 'analysis',
      nameKo: '독립 분석',
      description: '각 부서가 독립적으로 안건을 분석합니다',
      messages: [
        {
          agentId: 'pm',
          content:
            '친환경 소재 크래시패드 도입은 ESG 경영 강화와 브랜드 차별화에 핵심 기회입니다. 현재 유럽 시장에서 재활용 소재 사용 비율이 구매 결정 요인 상위 5위 안에 진입했으며, 경쟁사 대비 6개월 이상의 선점 효과가 기대됩니다.',
          highlight: '6개월 선점 효과',
        },
        {
          agentId: 'eng',
          content:
            '재활용 PP 소재의 물성 테스트 결과, 인장강도 85%, 충격강도 78% 수준으로 기존 소재 대비 약간의 하락이 있으나, 구조 보강 설계로 보완 가능합니다. 다만 표면 품질(그레인 전사성)에서 추가 검증이 필요합니다.',
          highlight: '구조 보강으로 보완 가능',
        },
        {
          agentId: 'fin',
          content:
            '친환경 소재 단가는 기존 대비 15% 상승으로, 대당 약 ₩12,000 원가 증가입니다. 연간 15만대 기준 ₩18억 추가 비용 발생. 현재 예산 범위를 초과하며, 원가 절감 대안 없이는 승인이 어렵습니다.',
          highlight: '연간 ₩18억 추가 비용',
        },
        {
          agentId: 'exec',
          content:
            '전사 ESG 로드맵과의 정합성은 높으나, 품질 리스크와 원가 영향을 균형있게 평가해야 합니다. 경쟁사 동향과 규제 일정을 고려한 타이밍 분석이 필요합니다.',
          highlight: '균형적 평가 필요',
        },
      ],
    },
    {
      id: 'debate-1',
      nameKo: '토론 1라운드',
      description: '상대 의견에 대한 비판적 피드백을 교환합니다',
      messages: [
        {
          agentId: 'pm',
          target: 'fin',
          content:
            '₩18억 추가 비용이라고 하셨지만, ESG 프리미엄 포지셔닝으로 차량 가격 ₩30~50만원 인상이 정당화됩니다. 유럽 OEM 벤치마크 기준, 친환경 옵션 프리미엄의 소비자 수용률은 72%에 달합니다.',
          highlight: '프리미엄 포지셔닝 가능',
        },
        {
          agentId: 'fin',
          target: 'pm',
          content:
            '가격 인상 정당화는 마케팅 가정에 불과합니다. 국내 소비자 WTP(지불의향가격) 조사 데이터가 있습니까? 유럽 수치를 국내에 직접 적용하는 것은 리스크입니다.',
          highlight: 'WTP 데이터 요구',
        },
        {
          agentId: 'eng',
          target: 'fin',
          content:
            '금형 수정 없이 기존 금형 활용이 가능하므로, 초기 투자비 ₩5억이 절감됩니다. 순수 소재 원가만 비교하면 재무팀의 수치는 과대평가된 것입니다.',
          highlight: '금형비 ₩5억 절감',
        },
        {
          agentId: 'exec',
          content:
            '모두 유효한 포인트입니다. PM은 국내 WTP 데이터를, 설계는 품질 검증 계획을, 재무는 금형비 절감 반영 수정안을 각각 제시해주세요.',
          highlight: '추가 데이터 요청',
        },
      ],
    },
    {
      id: 'debate-2',
      nameKo: '토론 2라운드',
      description: '수정된 데이터를 기반으로 재논의합니다',
      messages: [
        {
          agentId: 'pm',
          content:
            '국내 시장 조사 결과, 친환경 소재 차량에 대해 소비자 67%가 ₩50만원 이내 프리미엄 수용 가능. 25~34세 연령층에서는 수용률 81%로 더 높습니다.',
          highlight: '67% 프리미엄 수용',
        },
        {
          agentId: 'eng',
          content:
            '표면 품질 보완을 위해 2주 추가 시험을 제안합니다. 구조 보강 설계는 완료되어 양산 일정 영향 없음. 내구 시험 규격 대비 112% 달성으로 안전 마진 충분합니다.',
          highlight: '양산 일정 영향 없음',
        },
        {
          agentId: 'fin',
          content:
            '금형비 절감 반영 시 대당 추가 비용 ₩8,500으로 하향 조정. 연간 ₩12.75억. 프리미엄 가격 정책 적용 시 투자 회수 기간 1.8년으로 산출됩니다.',
          highlight: '대당 ₩8,500로 하향',
        },
        {
          agentId: 'exec',
          content:
            '수치가 수렴하고 있습니다. 리스크 관리 방안을 포함한 최종 입장을 정리해주세요.',
          highlight: '수렴 확인',
        },
      ],
    },
    {
      id: 'consensus',
      nameKo: '합의 도출',
      description: '최종 입장을 정리하고 합의점을 도출합니다',
      messages: [
        {
          agentId: 'pm',
          content:
            '원가 ₩8,500 증가에 프리미엄 수용 WTP ₩50만원이면 충분한 비즈니스 케이스입니다. ESG 마케팅 캠페인과 연계하면 브랜드 효과 극대화가 가능합니다.',
          highlight: '비즈니스 케이스 충분',
        },
        {
          agentId: 'eng',
          content:
            '2주 품질 검증 후 양산 적용이 현실적입니다. 리스크는 관리 가능한 수준이며, 파일럿 적용으로 안전장치를 마련할 수 있습니다.',
          highlight: '리스크 관리 가능',
        },
        {
          agentId: 'fin',
          content:
            '수정된 비용 구조라면 투자 회수 기간 1.8년으로, 사내 기준치 2년 이내를 충족합니다. 조건부 승인에 동의합니다.',
          highlight: 'ROI 기준 충족',
        },
        {
          agentId: 'exec',
          content:
            '전 부서 합의가 도출되었습니다. 조건부 승인을 권고하며, 파일럿 결과에 따라 전면 확대를 재심의하겠습니다.',
          highlight: '합의 완료',
        },
      ],
    },
  ],
  finalReport: {
    recommendationKo: '조건부 승인',
    conditions: [
      '2주 내 표면 품질 시험 완료 및 합격 확인',
      '1차 양산분 5,000대 파일럿 적용 후 소비자 반응 모니터링',
      '파일럿 결과 기반 전면 확대 여부 3개월 내 재심의',
    ],
    metrics: [
      { label: '대당 추가 비용', value: '₩8,500', trend: 'down' },
      { label: '투자 회수', value: '1.8년', trend: 'down' },
      { label: '소비자 수용률', value: '67%', trend: 'up' },
      { label: '예상 연간 순이익', value: '₩62.5억', trend: 'up' },
      { label: '내구 규격 달성', value: '112%', trend: 'up' },
      { label: '리스크 등급', value: '중간', trend: 'neutral' },
    ],
    consensusScores: [
      { label: '시장성', value: 9, agentId: 'pm' },
      { label: '기술성', value: 8, agentId: 'eng' },
      { label: '수익성', value: 7, agentId: 'fin' },
      { label: '전략성', value: 8, agentId: 'exec' },
    ],
    riskLevel: 'medium',
    riskLabel: '중간 (관리 가능)',
    summary:
      '친환경 소재 도입은 ESG 전략과의 높은 정합성, 소비자 수용 가능성, 그리고 관리 가능한 기술적 리스크를 종합적으로 고려할 때 조건부 승인이 적절합니다. 파일럿 운영을 통해 실제 시장 반응과 품질 안정성을 검증한 후 전면 확대를 결정합니다.',
  },
};
