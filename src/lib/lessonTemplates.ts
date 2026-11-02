import type { Block, BlockType } from "./catalog";

export const uid = (prefix = "b") => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

/** Editor metadata for every content block type. */
export const BLOCK_TYPES: Record<BlockType, { label: string; description: string; create: () => Block }> = {
  text: { label: "Rich text", description: "Paragraphs, headings and lists", create: () => ({ id: uid(), type: "text", body: "" }) },
  video: { label: "Video", description: "YouTube or Vimeo link", create: () => ({ id: uid(), type: "video", url: "", caption: "" }) },
  image: { label: "Image", description: "Diagram, photo or slide", create: () => ({ id: uid(), type: "image", url: "", alt: "", caption: "" }) },
  callout: { label: "Callout", description: "Tip, note or warning box", create: () => ({ id: uid(), type: "callout", tone: "tip", title: "", body: "" }) },
  keyPoints: { label: "Key points", description: "Summary bullet list", create: () => ({ id: uid(), type: "keyPoints", title: "Key takeaways", items: [""] }) },
  scenario: { label: "Scenario", description: "Classroom case study", create: () => ({ id: uid(), type: "scenario", title: "", body: "" }) },
  quiz: { label: "Knowledge check", description: "Practice question with feedback", create: () => ({ id: uid(), type: "quiz", question: "", options: ["", "", ""], answer: 0, explanation: "" }) },
  reflection: { label: "Reflection", description: "Prompt learners to apply it", create: () => ({ id: uid(), type: "reflection", prompt: "" }) },
  prompt: { label: "AI prompt", description: "Prompt learners can copy into an AI tool", create: () => ({ id: uid(), type: "prompt", title: "Prompt to copy", body: "" }) },
  activity: { label: "Try it in class", description: "Hands-on practice task", create: () => ({ id: uid(), type: "activity", title: "", body: "" }) },
  resource: { label: "Resource link", description: "Download or external reading", create: () => ({ id: uid(), type: "resource", title: "", url: "", description: "" }) },
};

export type LessonTemplate = { id: string; name: string; description: string; minutes: number; blocks: () => Block[] };

const make = <T extends BlockType>(type: T, patch: Partial<Extract<Block, { type: T }>> = {}) =>
  ({ ...BLOCK_TYPES[type].create(), ...patch }) as Block;

export const LESSON_TEMPLATES: LessonTemplate[] = [
  {
    id: "concept",
    name: "Concept lesson",
    description: "Explain an idea, highlight takeaways, check understanding",
    minutes: 10,
    blocks: () => [
      make("text", { body: "## Why this matters\n\nIntroduce the idea and connect it to everyday teaching.\n\n## How it works\n\n- First point\n- Second point" }),
      make("callout", { tone: "tip", title: "Try this tomorrow", body: "A quick, practical way to apply the idea." }),
      make("keyPoints"),
      make("quiz"),
    ],
  },
  {
    id: "video",
    name: "Video lesson",
    description: "Watch, summarize, reflect",
    minutes: 12,
    blocks: () => [
      make("video"),
      make("text", { body: "## Summary\n\nWhat the video covered, in a few sentences." }),
      make("keyPoints"),
      make("reflection", { prompt: "How could you use this in your next lesson?" }),
    ],
  },
  {
    id: "case-study",
    name: "Case study",
    description: "Real classroom scenario with analysis",
    minutes: 15,
    blocks: () => [
      make("scenario", { title: "The situation" }),
      make("text", { body: "## What happened next\n\nWalk through the teacher’s decisions and their effect." }),
      make("quiz"),
      make("reflection", { prompt: "What would you have done differently, and why?" }),
    ],
  },
  {
    id: "practice",
    name: "Practice activity",
    description: "Hands-on task with resources",
    minutes: 20,
    blocks: () => [
      make("text", { body: "## Your task\n\n1. Step one\n2. Step two\n3. Step three" }),
      make("callout", { tone: "note", title: "Success criteria", body: "What a strong result looks like." }),
      make("resource"),
      make("reflection", { prompt: "What did you learn from trying this?" }),
    ],
  },
  { id: "blank", name: "Blank lesson", description: "Start from scratch", minutes: 10, blocks: () => [make("text")] },
];

export const templateById = (id: string) => LESSON_TEMPLATES.find((t) => t.id === id) ?? LESSON_TEMPLATES.at(-1)!;

/** Recognizes YouTube / Vimeo links and returns a privacy-friendly embed URL. */
export function videoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const id = u.searchParams.get("v") ?? u.pathname.match(/\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.match(/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {}
  return null;
}
