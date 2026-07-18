import { pricingItems, PricingItem } from './pricingData';

export const BUSINESS_WHATSAPP_NUMBER = '601163199899'; // +60 11-6319 9899

export interface ChatReply {
  text: string;
  /** True when the bot couldn't confidently help and should offer a WhatsApp handoff. */
  whatsappCta?: boolean;
}

const STOPWORDS = new Set([
  'and', 'or', 'the', 'a', 'an', 'with', 'without', 'for', 'to', 'of', 'on',
  'in', 'my', 'me', 'is', 'do', 'you', 'does', 'i', 'have', 'has', 'need',
  'want', 'please', 'per', 'task', 'computer', 'depends', 'complications',
  'equipment', 'quality', 'brand', 'model', 'also', 'not', 'include', 'cost',
  'charges', 'apply', 'if', 'we', 'only', 'charge', 'minimal', 'services',
]);

function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// Everyday phrasing a customer might type, mapped to the vocabulary actually
// used in the price list — lets "how much for a broken display" match
// "Laptop Screen Replacement" the same as if they'd said "screen".
const SYNONYMS: Record<string, string> = {
  display: 'screen', lcd: 'screen', monitor: 'screen', crack: 'screen',
  cracked: 'screen', broken: 'screen', shattered: 'screen',
  charging: 'battery', charger: 'battery', drain: 'battery', drains: 'battery',
  draining: 'battery', dies: 'battery', dying: 'battery',
  keys: 'keyboard', typing: 'keyboard', type: 'keyboard',
  mainboard: 'motherboard', logicboard: 'motherboard', chip: 'motherboard',
  dust: 'cleaning', dusty: 'cleaning', overheating: 'cleaning',
  overheat: 'cleaning', overheats: 'cleaning', hot: 'cleaning', fan: 'cleaning',
  noisy: 'cleaning',
  format: 'formatting', reinstall: 'formatting', wipe: 'formatting',
  virus: 'formatting', malware: 'formatting', slow: 'formatting',
  lagging: 'formatting', laggy: 'formatting', reset: 'formatting',
  wifi: 'networking', internet: 'networking', router: 'networking',
  connection: 'networking', lan: 'networking',
  hinges: 'hinge', wobbly: 'hinge', loose: 'hinge',
  bsod: 'bluescreen', crash: 'bluescreen', crashing: 'bluescreen', freeze: 'bluescreen',
  freezing: 'bluescreen', frozen: 'bluescreen',
};

function expandSynonyms(words: string[]): string[] {
  const expanded = [...words];
  for (const w of words) {
    const canonical = SYNONYMS[w];
    if (canonical) expanded.push(canonical);
  }
  return expanded;
}

const pricingIndex = pricingItems.map((item) => ({
  item,
  keywords: new Set(significantWords(item.service)),
}));

// A repair shop's price list is full of words like "repair" and "replacement"
// that appear on nearly every line — they're useless for telling services
// apart. Rather than hand-maintain a list of which words are "too common",
// weight each matched word by how rare it is across the price list (fewer
// items contain it → higher weight), so a distinctive word like "screen"
// naturally outweighs a generic one like "repair" that happens to co-occur.
const documentFrequency = new Map<string, number>();
for (const { keywords } of pricingIndex) {
  for (const kw of keywords) {
    documentFrequency.set(kw, (documentFrequency.get(kw) ?? 0) + 1);
  }
}
const TOTAL_ITEMS = pricingItems.length;
function keywordWeight(word: string): number {
  const df = documentFrequency.get(word) ?? 1;
  return Math.log((TOTAL_ITEMS + 1) / (df + 1)) + 1;
}

function matchPricing(message: string, limit = 5): PricingItem[] {
  const words = expandSynonyms(significantWords(message));
  if (words.length === 0) return [];

  const scored = pricingIndex
    .map(({ item, keywords }) => {
      const score = words
        .filter((w) => keywords.has(w))
        .reduce((sum, w) => sum + keywordWeight(w), 0);
      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return [];

  // Only keep the strongest matches, not every item that shares one word
  // (e.g. "laptop screen" shouldn't also surface every other laptop service).
  // A small tolerance absorbs floating-point rounding, not near-ties — a
  // genuinely distinctive word like "screen" should still win outright over
  // a generic word like "repair" shared by several other items.
  const topScore = scored[0].score;
  return scored
    .filter((s) => topScore - s.score < 0.01)
    .slice(0, limit)
    .map((s) => s.item);
}

interface Intent {
  keywords: string[];
  reply: string;
  whatsappCta?: boolean;
}

const INTENTS: Intent[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'helo', 'morning', 'afternoon', 'evening'],
    reply:
      "Hi! 👋 I'm Bright Light's assistant. Ask me about repair pricing (e.g. \"laptop screen replacement\") or how our service works.",
  },
  {
    keywords: ['thank', 'thanks', 'tq', 'appreciate'],
    reply: "You're welcome! Let me know if there's anything else I can help with.",
  },
  {
    keywords: ['bye', 'goodbye'],
    reply: 'Thanks for chatting with Bright Light! Have a great day.',
  },
  {
    keywords: ['human', 'agent', 'someone', 'staff', 'speak', 'talk'],
    reply: 'Sure — a real person can help you directly on WhatsApp.',
    whatsappCta: true,
  },
  {
    keywords: ['much', 'rate', 'rates', 'pricing', 'price', 'prices'],
    reply:
      'I can look up prices for a specific service — try asking something like "how much for laptop screen replacement" or "price for laptop cleaning".',
  },
  {
    keywords: ['how', 'work', 'works', 'process'],
    reply:
      'Here\'s how it works: 1) Submit your repair request online, 2) Choose self drop-off or we pick up your device, 3) We diagnose and send a quote within 1 working day, 4) Track progress in real time, 5) Pay and collect (or we deliver it back).',
  },
  {
    keywords: ['delivery', 'pickup', 'drop', 'dropoff', 'send'],
    reply:
      'You can either drop off your device at our center for free, or choose "We Pickup & Deliver" starting from RM30 depending on distance (RM30 within 10km, RM60 within 20km, RM100 within 40km).',
  },
  {
    keywords: ['track', 'status', 'order'],
    reply:
      'You can track your repair status anytime by logging in and visiting "My Repairs".',
  },
  {
    keywords: ['contact', 'phone', 'whatsapp', 'call', 'email'],
    reply: 'You can reach us on WhatsApp / Phone, or use the button below.',
    whatsappCta: true,
  },
];

function matchIntent(message: string): Intent | null {
  const words = significantWords(message);
  for (const intent of INTENTS) {
    if (intent.keywords.some((k) => words.includes(k))) {
      return intent;
    }
  }
  return null;
}

// A rough "this is more than I can handle" signal: long messages or ones with
// multiple sentences/questions usually describe a multi-part or unusual issue
// that a keyword-matched bot can't reliably parse. Checked only as a last
// resort, after a real pricing/intent match has already failed — a detailed
// but ultimately clear question should still get answered.
function isComplexMessage(message: string): boolean {
  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  const sentenceBreaks = (message.match(/[.?!]/g) || []).length;
  return wordCount > 12 || sentenceBreaks > 1;
}

const COMPLEX_REPLY =
  "That sounds like it needs a closer look than I can give here. I'd recommend chatting directly with our team — they'll be able to help properly.";

const FALLBACK_REPLY =
  "Sorry, I couldn't find anything matching that. You can browse our services on the homepage, submit a repair request, or chat with a real person on WhatsApp.";

export function getAutoReply(message: string): ChatReply {
  const pricingMatches = matchPricing(message);
  if (pricingMatches.length > 0) {
    const lines = pricingMatches.map((p) => `• ${p.service}: ${p.price}`).join('\n');
    return { text: `Here's what I found:\n${lines}` };
  }

  const intent = matchIntent(message);
  if (intent) return { text: intent.reply, whatsappCta: intent.whatsappCta };

  if (isComplexMessage(message)) {
    return { text: COMPLEX_REPLY, whatsappCta: true };
  }

  return { text: FALLBACK_REPLY, whatsappCta: true };
}
