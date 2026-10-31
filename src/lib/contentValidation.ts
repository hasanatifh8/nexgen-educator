import type { Block } from "./catalog";

const MAX_BLOCKS = 80;
const s = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max + 1);

/** Only absolute http(s) links — blocks javascript:, data: and other schemes. */
export function safeUrl(v: unknown): string | null {
  const raw = String(v ?? "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}

export function validateBlocks(raw: unknown): { blocks: Block[] } | { error: string } {
  if (!Array.isArray(raw)) return { error: "Could not read the lesson content." };
  if (raw.length > MAX_BLOCKS) return { error: `A lesson can have at most ${MAX_BLOCKS} blocks.` };

  const blocks: Block[] = [];
  const ids = new Set<string>();
  for (const [i, item] of raw.entries()) {
    const n = `Block ${i + 1}`;
    const b = (item ?? {}) as Record<string, unknown>;
    let id = typeof b.id === "string" && /^[\w-]{1,40}$/.test(b.id) ? b.id : `b-${i}-${Date.now().toString(36)}`;
    if (ids.has(id)) id = `${id}-${i}`;
    ids.add(id);

    const long = (k: string, max: number, label: string, required = true) => {
      const v = s(b[k], max);
      if (v.length > max) throw new Error(`${n}: ${label} must be under ${max} characters.`);
      if (required && !v) throw new Error(`${n}: ${label} can’t be empty.`);
      return v;
    };
    const url = (required: boolean) => {
      const u = safeUrl(b.url);
      if (u === null) throw new Error(`${n}: enter a full link starting with https://`);
      if (required && !u) throw new Error(`${n}: add a link.`);
      return u;
    };

    try {
      switch (b.type) {
        case "text":
          blocks.push({ id, type: "text", body: long("body", 20000, "text") });
          break;
        case "video": {
          blocks.push({ id, type: "video", url: url(false), caption: long("caption", 300, "caption", false) });
          break;
        }
        case "image":
          blocks.push({ id, type: "image", url: url(true), alt: long("alt", 300, "alt text"), caption: long("caption", 300, "caption", false) });
          break;
        case "callout": {
          const tone = b.tone === "note" || b.tone === "warning" ? b.tone : "tip";
          blocks.push({ id, type: "callout", tone, title: long("title", 120, "title"), body: long("body", 3000, "text") });
          break;
        }
        case "keyPoints": {
          const items = (Array.isArray(b.items) ? b.items : []).map((x) => s(x, 400)).filter(Boolean);
          if (!items.length) throw new Error(`${n}: add at least one key point.`);
          if (items.length > 20 || items.some((x) => x.length > 400)) throw new Error(`${n}: up to 20 points, 400 characters each.`);
          blocks.push({ id, type: "keyPoints", title: long("title", 120, "title"), items });
          break;
        }
        case "scenario":
          blocks.push({ id, type: "scenario", title: long("title", 120, "title"), body: long("body", 3000, "scenario") });
          break;
        case "quiz": {
          const options = (Array.isArray(b.options) ? b.options : []).map((x) => s(x, 300));
          if (options.length < 2 || options.length > 6 || options.some((o) => !o || o.length > 300))
            throw new Error(`${n}: the knowledge check needs 2–6 filled-in options.`);
          const answer = Number(b.answer);
          if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) throw new Error(`${n}: mark the correct option.`);
          blocks.push({ id, type: "quiz", question: long("question", 500, "question"), options, answer, explanation: long("explanation", 1000, "explanation", false) });
          break;
        }
        case "reflection":
          blocks.push({ id, type: "reflection", prompt: long("prompt", 500, "prompt") });
          break;
        case "resource":
          blocks.push({ id, type: "resource", title: long("title", 160, "title"), url: url(true), description: long("description", 400, "description", false) });
          break;
        default:
          return { error: `${n}: unknown block type.` };
      }
    } catch (e) {
      return { error: (e as Error).message };
    }
  }
  return { blocks };
}
