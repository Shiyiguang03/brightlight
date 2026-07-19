import { pricingItems } from './pricingData';
import { BUSINESS_WHATSAPP_NUMBER, type ChatReply } from './chatbotEngine';

// Overridable via env in case the default model gets renamed/deprecated —
// no code change needed, just update GEMINI_MODEL.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const PRICE_LIST = pricingItems.map((p) => `- ${p.service}: ${p.price}`).join('\n');

const SYSTEM_INSTRUCTION = `You are the customer support assistant for Bright Light, a laptop & desktop computer repair shop in Malaysia (WhatsApp: +${BUSINESS_WHATSAPP_NUMBER}).

Only help with topics related to Bright Light's services below. Do not answer questions unrelated to computer/laptop repair (general knowledge, coding help, other topics, etc.) — politely redirect instead.

Services & pricing (RM = Malaysian Ringgit):
${PRICE_LIST}

How it works: 1) Customer submits a repair request online, 2) they choose self drop-off (free) or pickup & delivery (RM30 within 10km, RM60 within 20km, RM100 within 40km, custom quote beyond that), 3) Bright Light diagnoses and sends a quote within 1 working day, 4) customer tracks progress online under "My Repairs", 5) pay and collect, or Bright Light delivers it back.

We do NOT repair phones, tablets, printers, TVs, gaming consoles, cameras, or smartwatches — only laptops and desktop computers.

Rules:
- Keep replies short (2-4 sentences), friendly, plain text (no markdown).
- If asked about pricing, quote the exact price/range from the list above — never invent a price that isn't listed.
- Be specific: give the one service that best matches what the customer described, not every service that shares a word with it. E.g. "battery replacement" alone means the main battery (Laptop Battery Replacement) — only mention the CMOS battery variant if they specifically say "CMOS" or "clock battery".
- Set whatsappCta to true when the topic is something you're unsure of, a device we don't service, or sounds like it needs a human (complex issue, complaint, negotiation). Otherwise set it to false.`;

interface ChatTurn {
  role: 'user' | 'bot';
  text: string;
}

// Returns null on any failure (missing key, network error, rate limit,
// malformed response) so the caller can fall back to the free keyword bot
// instead of breaking the chat.
export async function getGeminiReply(message: string, history: ChatTurn[]): Promise<ChatReply | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const contents = [
    ...history.slice(-10).map((turn) => ({
      role: turn.role === 'user' ? 'user' : 'model',
      parts: [{ text: turn.text }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    contents,
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.4,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          text: { type: 'STRING' },
          whatsappCta: { type: 'BOOLEAN' },
        },
        required: ['text', 'whatsappCta'],
      },
    },
  };

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error('Gemini API error:', res.status, await res.text().catch(() => ''));
    return null;
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof raw !== 'string') return null;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.text !== 'string') return null;
    return { text: parsed.text, whatsappCta: Boolean(parsed.whatsappCta) };
  } catch {
    return null;
  }
}
