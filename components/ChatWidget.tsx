'use client';

import { useEffect, useRef, useState } from 'react';
import { BUSINESS_WHATSAPP_NUMBER } from '@/lib/chatbotEngine';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
  whatsappCta?: boolean;
}

const GREETING: ChatMessage = {
  role: 'bot',
  text: "Hi! 👋 I'm Bright Light's assistant. Ask me about repair pricing (e.g. \"laptop screen replacement\") or how our service works.",
};

// The conversation survives page reloads within the same day (nicer UX —
// no lost context on refresh) but resets to just the greeting once a day
// has passed since it started. This also keeps the server's per-conversation
// AI-call cap (see app/api/chat/route.ts) meaningfully bounded per day
// rather than resettable just by reloading the page.
const STORAGE_KEY = 'brightlight_chat_v1';
const RESET_AFTER_MS = 24 * 60 * 60 * 1000;

interface StoredChat {
  messages: ChatMessage[];
  startedAt: number;
}

function loadStoredChat(): StoredChat {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredChat;
        if (
          parsed.startedAt &&
          Date.now() - parsed.startedAt < RESET_AFTER_MS &&
          Array.isArray(parsed.messages) &&
          parsed.messages.length > 0
        ) {
          return parsed;
        }
      }
    } catch {
      // corrupt or inaccessible storage (e.g. private browsing) — start fresh
    }
  }
  return { messages: [GREETING], startedAt: Date.now() };
}

const WIDGET_WIDTH = 380;
const WIDGET_HEIGHT = 560;
const EDGE_MARGIN = 16;

function whatsappUrl(prefillText: string) {
  return `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(prefillText)}`;
}

function clampPosition(x: number, y: number) {
  const maxX = window.innerWidth - WIDGET_WIDTH - EDGE_MARGIN;
  const maxY = window.innerHeight - WIDGET_HEIGHT - EDGE_MARGIN;
  return {
    x: Math.min(Math.max(x, EDGE_MARGIN), Math.max(EDGE_MARGIN, maxX)),
    y: Math.min(Math.max(y, EDGE_MARGIN), Math.max(EDGE_MARGIN, maxY)),
  };
}

function defaultPosition() {
  return clampPosition(
    window.innerWidth - WIDGET_WIDTH - 24,
    window.innerHeight - WIDGET_HEIGHT - 96
  );
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadStoredChat().messages);
  const startedAtRef = useRef<number>(0);
  if (startedAtRef.current === 0) startedAtRef.current = loadStoredChat().startedAt;
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [lastUserText, setLastUserText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, startedAt: startedAtRef.current })
      );
    } catch {
      // storage unavailable (e.g. private browsing) — chat just won't persist
    }
  }, [messages]);

  // Before the widget has ever been dragged, derive its position from the
  // current viewport at render time rather than storing it — once the user
  // drags it, `position` takes over and this fallback is no longer used.
  const displayPosition = position ?? (typeof window !== 'undefined' ? defaultPosition() : null);

  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => (prev ? clampPosition(prev.x, prev.y) : prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      setPosition(clampPosition(e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y));
    };
    const handlePointerUp = () => setDragging(false);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging]);

  const handleHeaderPointerDown = (e: React.PointerEvent) => {
    if (!displayPosition) return;
    dragOffset.current = { x: e.clientX - displayPosition.x, y: e.clientY - displayPosition.y };
    setDragging(true);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setSending(true);
    setLastUserText(text);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: res.ok
            ? data.reply
            : data.message || 'Sorry, something went wrong. Please try again.',
          whatsappCta: res.ok ? data.whatsappCta : true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: "We couldn't reach the server. Please check your connection and try again.",
          whatsappCta: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[110] flex flex-col overflow-hidden rounded-3xl border chat-widget-pop"
      style={{
        width: WIDGET_WIDTH,
        maxWidth: 'calc(100vw - 32px)',
        height: WIDGET_HEIGHT,
        maxHeight: 'calc(100vh - 32px)',
        left: displayPosition?.x,
        top: displayPosition?.y,
        visibility: displayPosition ? 'visible' : 'hidden',
        backgroundColor: '#fffdfb',
        borderColor: '#ecd9c3',
        boxShadow: '0 24px 60px -12px rgba(168, 69, 42, 0.3), 0 0 0 1px rgba(236, 217, 195, 0.7)',
        userSelect: dragging ? 'none' : undefined,
      }}
    >
      {/* Header — drag handle */}
      <div
        onPointerDown={handleHeaderPointerDown}
        className="flex items-center justify-between px-4 py-3.5"
        style={{
          background: 'linear-gradient(135deg, #c2542f 0%, #d97706 55%, #b45309 100%)',
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
        <div className="flex items-center gap-x-3 min-w-0">
          <div
            className="flex items-center justify-center rounded-full text-lg shrink-0"
            style={{ width: '38px', height: '38px', backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            🔧
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-sm truncate">Bright Light Assistant</p>
            <p className="text-xs text-white/85 flex items-center gap-x-1.5">
              <span
                className="inline-block rounded-full"
                style={{ width: '7px', height: '7px', backgroundColor: '#4ade80' }}
              />
              Usually replies instantly
            </p>
          </div>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onClose}
          aria-label="Close chat"
          className="flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/15 transition shrink-0"
          style={{ width: '30px', height: '30px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ backgroundColor: '#fdf6ee' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col chat-msg-in ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line leading-relaxed"
              style={
                msg.role === 'user'
                  ? {
                      background: 'linear-gradient(135deg, #c2542f 0%, #d97706 100%)',
                      color: '#ffffff',
                      borderBottomRightRadius: '4px',
                      boxShadow: '0 2px 10px -2px rgba(194, 84, 47, 0.55)',
                    }
                  : {
                      backgroundColor: '#fffaf4',
                      color: '#453227',
                      borderBottomLeftRadius: '4px',
                      border: '1px solid #ecd9c3',
                      boxShadow: '0 1px 4px -1px rgba(168, 69, 42, 0.1)',
                    }
              }
            >
              {msg.text}
            </div>
            {msg.whatsappCta && (
              <a
                href={whatsappUrl(lastUserText || 'Hi, I need help with a repair')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: '#25D366', boxShadow: '0 2px 8px -2px rgba(37, 211, 102, 0.5)' }}
              >
                💬 Chat on WhatsApp
              </a>
            )}
          </div>
        ))}
        {sending && (
          <div className="flex justify-start chat-msg-in">
            <div
              className="flex items-center gap-x-1.5 px-4 py-3 rounded-2xl"
              style={{ backgroundColor: '#fffaf4', border: '1px solid #ecd9c3', borderBottomLeftRadius: '4px' }}
            >
              <span className="chat-dot" style={{ backgroundColor: '#c2542f' }} />
              <span className="chat-dot" style={{ backgroundColor: '#c2542f', animationDelay: '0.15s' }} />
              <span className="chat-dot" style={{ backgroundColor: '#c2542f', animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t" style={{ borderColor: '#ecd9c3', backgroundColor: '#fffdfb' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 px-4 py-2.5 rounded-full border text-sm bg-white placeholder:text-[#c2986f] focus:outline-none focus:ring-2 focus:ring-[#c2542f]/30 transition"
          style={{ borderColor: '#ecd9c3', color: '#453227' }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          aria-label="Send message"
          className="flex items-center justify-center rounded-full text-white disabled:opacity-40 transition hover:opacity-90 shrink-0"
          style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #c2542f 0%, #d97706 100%)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
