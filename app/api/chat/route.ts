import { NextRequest, NextResponse } from 'next/server';
import { getAutoReply } from '@/lib/chatbotEngine';
import { handleApiError } from '@/lib/apiError';

// Currently a free, keyword-matched FAQ bot (see lib/chatbotEngine.ts) — no
// API key or per-request cost. To upgrade to a real Claude-powered assistant
// later, replace the getAutoReply() call below with an Anthropic SDK call
// (the @anthropic-ai/sdk package is already installed).
export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ message: 'A message is required' }, { status: 400 });
    }

    const reply = getAutoReply(message);

    return NextResponse.json({ reply: reply.text, whatsappCta: reply.whatsappCta ?? false });
  } catch (error) {
    return handleApiError(error, 'Error generating chat reply');
  }
}
