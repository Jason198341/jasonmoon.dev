import { useState, useRef, useEffect, useCallback } from 'react';
import {
  AGENTS,
  AGENT_MAP,
  SCENARIO,
  type Agent,
  type ConsensusScore,
} from '../data/edat-scenario';

// ── Types ──────────────────────────────────────────
interface DisplayMessage {
  key: number;
  agentId: string;
  content: string;
  target?: string;
  highlight?: string;
  phaseId: string;
}

type SimState = 'idle' | 'running' | 'complete';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ── StreamText ─────────────────────────────────────
function StreamText({ text, charDelay = 12 }: { text: string; charDelay?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!text.length) return;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i++;
      setCount(i);
      if (i < text.length) setTimeout(tick, charDelay);
    };
    setTimeout(tick, charDelay);
    return () => { cancelled = true; };
  }, [text, charDelay]);

  const n = Math.min(count, text.length);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && (
        <span className="inline-block w-[2px] h-[1.1em] bg-current opacity-60 animate-pulse ml-px align-text-bottom" />
      )}
    </>
  );
}

// ── ThinkingDots ───────────────────────────────────
function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] ml-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-current opacity-60"
          style={{
            animation: 'edatBounce 1s infinite',
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </span>
  );
}

// ── ConsensusRadar ─────────────────────────────────
function ConsensusRadar({ scores }: { scores: ConsensusScore[] }) {
  const cx = 80, cy = 80, r = 55;
  const n = scores.length;

  const pts = scores.map((s, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const d = r * (s.value / 10);
    return {
      x: cx + d * Math.cos(a),
      y: cy + d * Math.sin(a),
      lx: cx + (r + 18) * Math.cos(a),
      ly: cy + (r + 18) * Math.sin(a),
      ...s,
    };
  });

  return (
    <svg viewBox="0 0 160 160" className="w-44 h-44">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <circle key={f} cx={cx} cy={cy} r={r * f} fill="none" stroke="currentColor" strokeOpacity={0.08} />
      ))}
      {pts.map((_, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="currentColor" strokeOpacity={0.08} />
        );
      })}
      <polygon
        points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="rgba(99,102,241,0.15)"
        stroke="rgb(99,102,241)"
        strokeWidth={1.5}
      />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} fill={AGENT_MAP[p.agentId]?.color ?? '#6366f1'} />
          <text
            x={p.lx}
            y={p.ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            opacity={0.5}
            style={{ fontSize: '9px' }}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Main Component ─────────────────────────────────
export default function EDATDemo() {
  const [state, setState] = useState<SimState>('idle');
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [currentPhase, setCurrentPhase] = useState(-1);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [targetAgent, setTargetAgent] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [speed, setSpeed] = useState(1);

  const versionRef = useRef(0);
  const msgIdRef = useRef(0);
  const speedRef = useRef(1);
  const timelineRef = useRef<HTMLDivElement>(null);

  speedRef.current = speed;

  // Auto-scroll
  useEffect(() => {
    const el = timelineRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const startSimulation = useCallback(async () => {
    const v = ++versionRef.current;
    setState('running');
    setMessages([]);
    setShowReport(false);
    setCurrentPhase(-1);
    setActiveAgent(null);

    const ok = () => versionRef.current === v;
    const s = () => speedRef.current;

    for (let pi = 0; pi < SCENARIO.phases.length; pi++) {
      if (!ok()) return;
      const phase = SCENARIO.phases[pi];
      setCurrentPhase(pi);
      await sleep(600 / s());

      for (const msg of phase.messages) {
        if (!ok()) return;
        setActiveAgent(msg.agentId);
        setTargetAgent(msg.target ?? null);
        setThinking(true);
        await sleep(700 / s());

        if (!ok()) return;
        setThinking(false);

        const key = ++msgIdRef.current;
        setMessages((prev) => [...prev, { ...msg, key, phaseId: phase.id }]);

        const typingMs = msg.content.length * (12 / s());
        await sleep(typingMs + 300 / s());
        setTargetAgent(null);
      }
      await sleep(500 / s());
    }

    if (!ok()) return;
    setActiveAgent(null);
    setState('complete');
    await sleep(200);
    setShowReport(true);
  }, []);

  const reset = useCallback(() => {
    versionRef.current++;
    setState('idle');
    setMessages([]);
    setCurrentPhase(-1);
    setActiveAgent(null);
    setTargetAgent(null);
    setThinking(false);
    setShowReport(false);
  }, []);

  const skipToEnd = useCallback(() => {
    versionRef.current++;
    const all: DisplayMessage[] = [];
    SCENARIO.phases.forEach((phase) => {
      phase.messages.forEach((msg) => {
        all.push({ ...msg, key: ++msgIdRef.current, phaseId: phase.id });
      });
    });
    setMessages(all);
    setCurrentPhase(SCENARIO.phases.length - 1);
    setActiveAgent(null);
    setTargetAgent(null);
    setThinking(false);
    setState('complete');
    setShowReport(true);
  }, []);

  const { finalReport } = SCENARIO;

  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <div className="rounded-xl border border-border bg-surface/50 p-5">
        <p className="text-xs font-mono text-teal-400 uppercase tracking-wider mb-2">Scenario</p>
        <h3 className="font-bold text-lg mb-1">{SCENARIO.titleKo}</h3>
        <p className="text-sm text-text-muted">{SCENARIO.description}</p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {AGENTS.map((agent) => {
          const isActive = activeAgent === agent.id;
          const isTarget = targetAgent === agent.id;
          return (
            <div
              key={agent.id}
              className="rounded-xl border p-3 transition-all duration-300"
              style={{
                borderColor: isActive
                  ? agent.color
                  : isTarget
                    ? agent.color + '60'
                    : 'var(--color-border)',
                backgroundColor: isActive ? agent.color + '10' : 'var(--color-surface)',
                boxShadow: isActive ? `0 0 20px ${agent.color}20` : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{agent.icon}</span>
                <span
                  className="font-semibold text-sm"
                  style={{ color: isActive ? agent.color : undefined }}
                >
                  {agent.titleKo}
                </span>
                {isActive && thinking && <ThinkingDots />}
              </div>
              <p className="text-xs text-text-muted leading-snug">{agent.kpi}</p>
              <p className="text-[10px] text-text-muted/60 mt-1">
                Constraint: {agent.constraint}
              </p>
            </div>
          );
        })}
      </div>

      {/* Phase Progress */}
      {state !== 'idle' && (
        <div className="flex items-center gap-1 text-xs overflow-x-auto pb-1">
          {SCENARIO.phases.map((phase, i) => {
            const done = i < currentPhase || state === 'complete';
            const curr = i === currentPhase && state === 'running';
            return (
              <div key={phase.id} className="flex items-center gap-1 shrink-0">
                {i > 0 && (
                  <div className={`w-4 sm:w-6 h-px ${done ? 'bg-accent' : 'bg-border'}`} />
                )}
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      done ? 'bg-accent' : curr ? 'bg-accent animate-pulse' : 'bg-border'
                    }`}
                  />
                  <span className={done || curr ? 'text-text' : 'text-text-muted'}>
                    {phase.nameKo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {state === 'idle' && (
          <button
            onClick={startSimulation}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Start Simulation
          </button>
        )}
        {state === 'running' && (
          <>
            <button
              onClick={skipToEnd}
              className="px-4 py-2 rounded-lg border border-border text-text-muted text-sm hover:text-text transition-colors"
            >
              Skip to Result &rarr;
            </button>
            <div className="flex items-center gap-1 ml-auto">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    speed === s
                      ? 'bg-accent text-white'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </>
        )}
        {state === 'complete' && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-muted text-sm hover:text-text transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Restart
          </button>
        )}
      </div>

      {/* Idle prompt */}
      {state === 'idle' && messages.length === 0 && (
        <div className="rounded-xl border border-border bg-surface/50 p-8 text-center">
          <p className="text-3xl mb-3">🏛️</p>
          <p className="text-sm text-text-muted">
            Start the simulation to watch 4 department agents<br />
            debate in real-time: Analysis → Discussion → Consensus.
          </p>
        </div>
      )}

      {/* Timeline */}
      {messages.length > 0 && (
        <div
          ref={timelineRef}
          className="space-y-3 max-h-[520px] overflow-y-auto pr-1 scroll-smooth"
        >
          {(() => {
            let lastPhaseId = '';
            return messages.map((msg, idx) => {
              const agent = AGENT_MAP[msg.agentId];
              const showHeader = msg.phaseId !== lastPhaseId;
              lastPhaseId = msg.phaseId;
              const phase = SCENARIO.phases.find((p) => p.id === msg.phaseId);
              const isLatest = idx === messages.length - 1;

              return (
                <div key={msg.key}>
                  {showHeader && phase && (
                    <div className="flex items-center gap-2 py-2 mt-3 first:mt-0">
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs font-mono text-accent uppercase tracking-wider shrink-0">
                        {phase.nameKo}
                      </span>
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  )}
                  <div
                    className="rounded-lg border border-l-[3px] p-4"
                    style={{
                      borderColor: 'var(--color-border)',
                      borderLeftColor: agent?.color ?? 'var(--color-border)',
                      animation: isLatest ? 'edatFadeIn 0.3s ease-out' : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{agent?.icon}</span>
                      <span
                        className="font-medium text-sm"
                        style={{ color: agent?.color }}
                      >
                        {agent?.titleKo}
                      </span>
                      {msg.target && (
                        <span className="text-xs text-text-muted">
                          &rarr; {AGENT_MAP[msg.target]?.icon}{' '}
                          {AGENT_MAP[msg.target]?.titleKo}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed">
                      {isLatest && state === 'running' ? (
                        <StreamText
                          text={msg.content}
                          charDelay={12 / speedRef.current}
                        />
                      ) : (
                        msg.content
                      )}
                    </p>
                    {msg.highlight && !(isLatest && state === 'running') && (
                      <span
                        className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: (agent?.color ?? '#6366f1') + '15',
                          color: agent?.color ?? '#6366f1',
                        }}
                      >
                        {msg.highlight}
                      </span>
                    )}
                  </div>
                </div>
              );
            });
          })()}

          {/* Thinking indicator */}
          {thinking && activeAgent && (
            <div
              className="flex items-center gap-2 py-3 px-4 text-sm"
              style={{ animation: 'edatFadeIn 0.2s ease-out' }}
            >
              <span className="text-base">{AGENT_MAP[activeAgent]?.icon}</span>
              <span style={{ color: AGENT_MAP[activeAgent]?.color }}>
                {AGENT_MAP[activeAgent]?.titleKo}
              </span>
              <span className="text-text-muted">analyzing</span>
              <ThinkingDots />
            </div>
          )}
        </div>
      )}

      {/* Final Report */}
      {showReport && (
        <div
          className="rounded-2xl border border-accent/30 bg-surface p-6 sm:p-8 space-y-6"
          style={{ animation: 'edatFadeIn 0.5s ease-out' }}
        >
          <div className="text-center">
            <p className="text-xs font-mono text-accent uppercase tracking-wider mb-2">
              Final Decision
            </p>
            <h3 className="text-xl font-bold mb-2">
              Recommendation: {finalReport.recommendationKo}
            </h3>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor:
                  finalReport.riskLevel === 'low'
                    ? '#10b98120'
                    : finalReport.riskLevel === 'medium'
                      ? '#f59e0b20'
                      : '#ef444420',
                color:
                  finalReport.riskLevel === 'low'
                    ? '#10b981'
                    : finalReport.riskLevel === 'medium'
                      ? '#f59e0b'
                      : '#ef4444',
              }}
            >
              Risk: {finalReport.riskLabel}
            </span>
          </div>

          <p className="text-sm text-text-muted text-center max-w-lg mx-auto leading-relaxed">
            {finalReport.summary}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {finalReport.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-border bg-bg p-3 text-center"
              >
                <p className="text-lg font-bold">
                  {m.trend === 'up' && (
                    <span className="text-emerald-400">&uarr; </span>
                  )}
                  {m.trend === 'down' && (
                    <span className="text-blue-400">&darr; </span>
                  )}
                  {m.value}
                </p>
                <p className="text-xs text-text-muted">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Radar */}
          <div className="flex justify-center">
            <ConsensusRadar scores={finalReport.consensusScores} />
          </div>

          {/* Conditions */}
          <div>
            <p className="text-sm font-medium mb-3">Approval Conditions</p>
            <ol className="space-y-2">
              {finalReport.conditions.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-muted">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-medium mt-0.5">
                    {i + 1}
                  </span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style>{`
        @keyframes edatFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes edatBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}
