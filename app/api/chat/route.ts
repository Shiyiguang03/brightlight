import { NextRequest, NextResponse } from 'next/server';
import { getAutoReply } from '@/lib/chatbotEngine';
import { getGeminiReply } from '@/lib/geminiChat';
import { handleApiError } from '@/lib/apiError';

// Tries Gemini's free tier first (see lib/geminiChat.ts) and falls back to
// the zero-cost keyword bot (lib/chatbotEngine.ts) whenever Gemini is
// unavailable — no API key set, rate-limited, or erroring — so the chat
// never actually breaks. MAX_USER_TURNS caps how many Gemini calls a single
// conversation can use before nudging the customer to WhatsApp, to keep
// usage well inside the free tier as this grows.
const MAX_MESSAGE_LENGTH = 400;
const MAX_USER_TURNS = 10;

const SWITCH_TO_WHATSAPP_REPLY =
  "We've covered quite a bit here — for anything further, our team can help you directly on WhatsApp.";

interface ChatTurn {
  role: 'user' | 'bot';
  text: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ message: 'A message is required' }, { status: 400 });
    }

    const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
    const priorTurns: ChatTurn[] = Array.isArray(history)
      ? history.filter((t): t is ChatTurn => (t?.role === 'user' || t?.role === 'bot') && typeof t?.text === 'string')
      : [];
    const userTurnCount = priorTurns.filter((t) => t.role === 'user').length;

    if (userTurnCount >= MAX_USER_TURNS) {
      return NextResponse.json({ reply: SWITCH_TO_WHATSAPP_REPLY, whatsappCta: true });
    }

    const geminiReply = await getGeminiReply(trimmedMessage, priorTurns).catch((err) => {
      console.error('Gemini call failed, falling back to keyword bot:', err);
      return null;
    });

    const reply = geminiReply ?? getAutoReply(trimmedMessage);

    return NextResponse.json({ reply: reply.text, whatsappCta: reply.whatsappCta ?? false });
  } catch (error) {
    return handleApiError(error, 'Error generating chat reply');
  }
}
