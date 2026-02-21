import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const GREETING: Message = {
  role: 'assistant',
  content: '어서 와. 오랜만이야. 뭐가 궁금해?',
};

// Client-side keyword routing — runs in browser where Korean text is always correct.
// Returns an ASCII tag that the server uses to select the right memory section.
const CLIENT_ROUTES: { keywords: string[]; tag: string }[] = [
  { keywords: ['마라톤', '체나이', '32km', '완주', 'marathon', 'chennai'], tag: 'marathon' },
  { keywords: ['달리기', '러닝', '런닝', '음악 없이', '달릴', 'running'], tag: 'running' },
  { keywords: ['인도', '주재원', '체육대회', '사랑한다', '팀원'], tag: 'india' },
  { keywords: ['보람', '의미있'], tag: 'meaning' },
  { keywords: ['자존감 수업', '100회', '이호선', '숫자 목표'], tag: 'reading' },
  { keywords: ['성과 중독', '아웃풋 강박', '존재 증명', '관찰자'], tag: 'achievement' },
  { keywords: ['성과', '체계화', '인정받지'], tag: 'achievement' },
  { keywords: ['톨스토이', '필사', '삶 철학', '인생 철학'], tag: 'tolstoy' },
  { keywords: ['고통'], tag: 'pain' },
  { keywords: ['사람을 바꾸', '조직 문화', '관계 어떻게'], tag: 'relationship' },
  { keywords: ['어떤 사람이고 싶어', '리더십', '영감'], tag: 'identity' },
  { keywords: ['전통', '규칙', '눈치'], tag: 'tradition' },
];

function getRouteTag(question: string): string {
  const lower = question.toLowerCase();
  for (const route of CLIENT_ROUTES) {
    if (route.keywords.some(k => lower.includes(k))) return route.tag;
  }
  return '';
}

export default function MemoryChat() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isStreaming) inputRef.current?.focus();
  }, [messages, isStreaming]);

  async function send() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setIsStreaming(true);

    // Strip UI-only greeting (first assistant message) before sending to API.
    // Fireworks requires conversations to start with a user message.
    const apiMessages = history.filter((_, i) => !(i === 0 && history[0].role === 'assistant'));
    const route = getRouteTag(text);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, route }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: text };
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: '잠깐... 말이 잘 안 들리네. 다시 한번 불러줄래?',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 13rem)' }}>
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0 mb-0.5">
                <span className="text-accent text-xs font-mono font-bold">J</span>
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent text-white rounded-br-sm'
                  : 'bg-surface border border-border text-text rounded-bl-sm'
              }`}
            >
              {msg.content || (
                <span className="flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <input
            ref={inputRef}
            className="flex-1 bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder-text-muted focus:outline-none focus:border-accent/60 transition-colors disabled:opacity-50"
            placeholder="하고 싶은 말을 입력하세요..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isStreaming}
            autoFocus
          />
          <button
            onClick={send}
            disabled={isStreaming || !input.trim()}
            className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
