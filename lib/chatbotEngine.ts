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
  'want', 'please', 'per', 'task', 'computer', 'pc', 'depends', 'complications',
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
  freezing: 'bluescreen', frozen: 'bluescreen', hang: 'bluescreen', hangs: 'bluescreen',
  hanging: 'bluescreen', stuck: 'bluescreen',
  // Component acronyms
  ssd: 'hardware', hdd: 'hardware', ram: 'hardware', gpu: 'hardware',
  psu: 'hardware', cpu: 'hardware', mobo: 'motherboard',
  os: 'formatting', jack: 'motherboard', clock: 'cmos',
};

// Devices this shop doesn't service — surfaced explicitly so a query like
// "phone replacement" gets a clear answer instead of a loose keyword match
// on "replacement" against unrelated laptop parts.
const OUT_OF_SCOPE_DEVICES: Record<string, string> = {
  phone: 'phone', phones: 'phone', mobile: 'phone', smartphone: 'phone',
  iphone: 'phone', android: 'phone', handphone: 'phone',
  tablet: 'tablet', tablets: 'tablet', ipad: 'tablet',
  printer: 'printer', printers: 'printer',
  tv: 'TV', television: 'TV',
  console: 'gaming console', playstation: 'gaming console', ps4: 'gaming console',
  ps5: 'gaming console', xbox: 'gaming console', nintendo: 'gaming console',
  camera: 'camera', cameras: 'camera',
  smartwatch: 'smartwatch', smartwatches: 'smartwatch',
};

const REPAIR_SIGNAL_WORDS = new Set([
  'replacement', 'replace', 'repair', 'repairs', 'fix', 'screen', 'battery',
  'keyboard', 'motherboard', 'hinge', 'cover', 'speaker', 'cleaning',
  'formatting', 'networking', 'hardware', 'bluescreen', 'broken', 'crack',
  'cracked', 'shattered', 'upgrade',
]);

// "phone" alone is ambiguous — it's also how people ask for a contact number
// (see the "contact" intent) — so only treat it as an out-of-scope device
// when it's paired with a repair-ish word, e.g. "phone replacement" or
// "phone screen cracked", not "what's your phone number".
const AMBIGUOUS_DEVICE_WORDS = new Set(['phone', 'phones']);

function detectOutOfScopeDevice(words: string[]): string | null {
  const hasRepairSignal = words.some((w) => REPAIR_SIGNAL_WORDS.has(w));
  for (const w of words) {
    const label = OUT_OF_SCOPE_DEVICES[w];
    if (!label) continue;
    if (AMBIGUOUS_DEVICE_WORDS.has(w) && !hasRepairSignal) continue;
    return label;
  }
  return null;
}

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

// A match only counts as confident if at least one matched word is
// distinctive enough on its own — otherwise a query like "laptop repair"
// (both words common across nearly every item) would dump the whole catalog,
// and something like "phone replacement" would surface random laptop parts
// off the word "replacement" alone.
const DISTINCTIVE_THRESHOLD = 2;

// Some items are a meaningfully different, less common variant of a sibling
// item — e.g. a laptop's CMOS battery (a tiny clock battery on the
// motherboard) is a completely different repair from its main battery — so
// they shouldn't surface unless the customer names the differentiator
// directly. Without this, "battery replacement" ties "Laptop Battery
// Replacement" with "Laptop CMOS Battery Replacement" since both only ever
// match on the words the customer actually said ("battery"/"replacement"),
// and the unmentioned "cmos" never counts against the tie.
const REQUIRE_EXPLICIT_MENTION = new Set(['cmos']);

function matchPricing(words: string[], limit = 5): PricingItem[] {
  if (words.length === 0) return [];
  const wordSet = new Set(words);

  const scored = pricingIndex
    .map(({ item, keywords }) => {
      const requiresExplicitMention = [...keywords].some(
        (k) => REQUIRE_EXPLICIT_MENTION.has(k) && !wordSet.has(k)
      );
      if (requiresExplicitMention) return { item, score: 0, maxWeight: 0 };

      const matched = words.filter((w) => keywords.has(w));
      const score = matched.reduce((sum, w) => sum + keywordWeight(w), 0);
      const maxWeight = matched.reduce((m, w) => Math.max(m, keywordWeight(w)), 0);
      return { item, score, maxWeight };
    })
    .filter((s) => s.score > 0 && s.maxWeight >= DISTINCTIVE_THRESHOLD)
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

function matchIntent(words: string[]): Intent | null {
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

// Basic typo tolerance: correct a word to a close vocabulary term — a repair
// keyword, a synonym, an out-of-scope device — before we try to match on it.
// e.g. "keybord" -> "keyboard", "moniter" -> "monitor" -> (via SYNONYMS) "screen".
const VOCAB = new Set<string>([
  ...pricingIndex.flatMap(({ keywords }) => [...keywords]),
  ...Object.keys(SYNONYMS),
  ...Object.values(SYNONYMS),
  ...Object.keys(OUT_OF_SCOPE_DEVICES),
  ...INTENTS.flatMap((i) => i.keywords),
]);

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function correctWord(word: string): string {
  if (word.length < 4 || VOCAB.has(word)) return word;
  const maxDistance = word.length <= 5 ? 1 : 2;
  let best = word;
  let bestDistance = maxDistance + 1;
  for (const candidate of VOCAB) {
    if (Math.abs(candidate.length - word.length) > maxDistance) continue;
    const distance = levenshtein(word, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  return bestDistance <= maxDistance ? best : word;
}

function tokenize(message: string): string[] {
  return expandSynonyms(significantWords(message).map(correctWord));
}

export function getAutoReply(message: string): ChatReply {
  const words = tokenize(message);

  const outOfScopeDevice = detectOutOfScopeDevice(words);
  if (outOfScopeDevice) {
    return {
      text: `We don't repair ${outOfScopeDevice}s here — Bright Light specializes in laptop & desktop computer repairs (screens, batteries, keyboards, motherboards, cleaning, formatting, networking & more). Happy to help if you've got a laptop or PC issue!`,
      whatsappCta: true,
    };
  }

  const pricingMatches = matchPricing(words);
  if (pricingMatches.length > 0) {
    const lines = pricingMatches.map((p) => `• ${p.service}: ${p.price}`).join('\n');
    return { text: `Here's what I found:\n${lines}` };
  }

  const intent = matchIntent(words);
  if (intent) return { text: intent.reply, whatsappCta: intent.whatsappCta };

  if (isComplexMessage(message)) {
    return { text: COMPLEX_REPLY, whatsappCta: true };
  }

  return { text: FALLBACK_REPLY, whatsappCta: true };
}
