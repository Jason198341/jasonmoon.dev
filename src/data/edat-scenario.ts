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
    titleKo: 'Product',
    kpi: 'Customer satisfaction · Market trends',
    constraint: 'Launch timeline',
    color: '#3b82f6',
    icon: '📋',
  },
  {
    id: 'eng',
    role: 'ENG',
    titleKo: 'Engineering',
    kpi: 'Technical feasibility · Safety standards',
    constraint: 'Process complexity',
    color: '#f97316',
    icon: '⚙️',
  },
  {
    id: 'fin',
    role: 'FIN',
    titleKo: 'Finance',
    kpi: 'Manufacturing cost · ROI',
    constraint: 'Budget limits',
    color: '#10b981',
    icon: '💰',
  },
  {
    id: 'exec',
    role: 'EXEC',
    titleKo: 'Executive',
    kpi: 'Corporate strategy · Brand',
    constraint: 'Long-term profitability',
    color: '#a855f7',
    icon: '👔',
  },
];

export const AGENT_MAP: Record<string, Agent> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a]),
);

export const SCENARIO: Scenario = {
  titleKo: 'Eco-Friendly Crash Pad Material Adoption for Next-Gen EVs',
  description:
    'A 4-department decision simulation on adopting recycled PP material crash pads for next-generation electric vehicles.',
  phases: [
    {
      id: 'analysis',
      nameKo: 'Independent Analysis',
      description: 'Each department analyzes the proposal independently',
      messages: [
        {
          agentId: 'pm',
          content:
            'Adopting eco-friendly crash pad materials is a key opportunity for ESG leadership and brand differentiation. In the European market, recycled material usage has entered the top 5 purchase decision factors. We estimate a 6-month first-mover advantage over competitors.',
          highlight: '6-month first-mover advantage',
        },
        {
          agentId: 'eng',
          content:
            'Physical property tests on recycled PP show tensile strength at 85% and impact strength at 78% vs. conventional materials — a slight decrease, but compensable through structural reinforcement design. However, surface quality (grain transfer) requires additional validation.',
          highlight: 'Compensable via structural reinforcement',
        },
        {
          agentId: 'fin',
          content:
            'Eco-material unit cost is 15% higher, adding ~$9/unit. At 150K units/year, that\'s $13.5M in additional annual cost. This exceeds the current budget. Approval is difficult without a cost offset plan.',
          highlight: '$13.5M additional annual cost',
        },
        {
          agentId: 'exec',
          content:
            'Alignment with corporate ESG roadmap is high, but we need a balanced assessment of quality risk and cost impact. Timing analysis considering competitor moves and regulatory deadlines is essential.',
          highlight: 'Balanced assessment required',
        },
      ],
    },
    {
      id: 'debate-1',
      nameKo: 'Debate Round 1',
      description: 'Agents exchange critical feedback on each other\'s positions',
      messages: [
        {
          agentId: 'pm',
          target: 'fin',
          content:
            'You cited $13.5M in additional cost, but ESG premium positioning justifies a $200–400 vehicle price increase. Per European OEM benchmarks, consumer acceptance of eco-friendly option premiums reaches 72%.',
          highlight: 'Premium positioning viable',
        },
        {
          agentId: 'fin',
          target: 'pm',
          content:
            'Price increase justification is a marketing assumption. Do you have domestic consumer WTP (willingness-to-pay) survey data? Directly applying European figures to our market is risky.',
          highlight: 'Demands WTP data',
        },
        {
          agentId: 'eng',
          target: 'fin',
          content:
            'Existing molds can be reused without modification, saving $3.7M in initial tooling investment. Comparing pure material cost only, Finance\'s figures are overstated.',
          highlight: '$3.7M tooling savings',
        },
        {
          agentId: 'exec',
          content:
            'All valid points. PM: provide domestic WTP data. Engineering: present quality validation plan. Finance: revise estimates reflecting tooling savings.',
          highlight: 'Requests additional data',
        },
      ],
    },
    {
      id: 'debate-2',
      nameKo: 'Debate Round 2',
      description: 'Re-evaluation with revised data and figures',
      messages: [
        {
          agentId: 'pm',
          content:
            'Domestic market research shows 67% of consumers accept a premium up to $400 for eco-material vehicles. Among the 25–34 age group, acceptance rises to 81%.',
          highlight: '67% premium acceptance',
        },
        {
          agentId: 'eng',
          content:
            'I propose 2 additional weeks for surface quality testing. Structural reinforcement design is complete — no impact on production timeline. Durability testing achieved 112% of spec, providing ample safety margin.',
          highlight: 'No production delay',
        },
        {
          agentId: 'fin',
          content:
            'Reflecting tooling savings, per-unit additional cost drops to $6.40. Annual total: $9.6M. With premium pricing applied, payback period calculates to 1.8 years.',
          highlight: 'Down to $6.40/unit',
        },
        {
          agentId: 'exec',
          content:
            'Figures are converging. Please finalize your positions with risk mitigation plans included.',
          highlight: 'Convergence confirmed',
        },
      ],
    },
    {
      id: 'consensus',
      nameKo: 'Consensus',
      description: 'Final positions are consolidated into a unified recommendation',
      messages: [
        {
          agentId: 'pm',
          content:
            'At $6.40 additional cost per unit and 67% consumer WTP at $400, the business case is solid. Paired with an ESG marketing campaign, brand impact can be maximized.',
          highlight: 'Strong business case',
        },
        {
          agentId: 'eng',
          content:
            'Production-ready after 2-week quality validation. Risk is manageable. A pilot run provides an additional safety net.',
          highlight: 'Risk is manageable',
        },
        {
          agentId: 'fin',
          content:
            'With the revised cost structure, payback period of 1.8 years meets our internal threshold of 2 years. I agree to conditional approval.',
          highlight: 'ROI threshold met',
        },
        {
          agentId: 'exec',
          content:
            'All departments have reached consensus. I recommend conditional approval, with full-scale rollout subject to pilot results.',
          highlight: 'Consensus reached',
        },
      ],
    },
  ],
  finalReport: {
    recommendationKo: 'Conditional Approval',
    conditions: [
      'Complete surface quality testing within 2 weeks and confirm pass',
      'Pilot run of 5,000 units with consumer response monitoring',
      'Review full-scale rollout decision within 3 months based on pilot results',
    ],
    metrics: [
      { label: 'Added Cost/Unit', value: '$6.40', trend: 'down' },
      { label: 'Payback Period', value: '1.8 yrs', trend: 'down' },
      { label: 'Consumer Acceptance', value: '67%', trend: 'up' },
      { label: 'Est. Annual Profit', value: '$4.7M', trend: 'up' },
      { label: 'Durability vs. Spec', value: '112%', trend: 'up' },
      { label: 'Risk Level', value: 'Medium', trend: 'neutral' },
    ],
    consensusScores: [
      { label: 'Market', value: 9, agentId: 'pm' },
      { label: 'Technical', value: 8, agentId: 'eng' },
      { label: 'Financial', value: 7, agentId: 'fin' },
      { label: 'Strategic', value: 8, agentId: 'exec' },
    ],
    riskLevel: 'medium',
    riskLabel: 'Medium (Manageable)',
    summary:
      'Eco-friendly material adoption demonstrates strong alignment with ESG strategy, viable consumer acceptance, and manageable technical risk. Conditional approval is appropriate. Full-scale rollout will be decided after validating real market response and quality stability through a pilot run.',
  },
};
