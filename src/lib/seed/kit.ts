import type { Block, Course, Lesson, Module } from "../catalog";

/** Shared builders for seed course content. Type-only imports, so seed files stay free of runtime cycles. */
export type Content = Pick<Course, "overview" | "outcomes" | "instructor" | "modules">;
export type B = Block extends infer X ? (X extends Block ? Omit<X, "id"> : never) : never;

/** Strips common indentation so lesson text can be written as indented template literals. */
export function md(s: string) {
  const lines = s.replace(/^\n+|\s+$/g, "").split("\n");
  const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length));
  return lines.map((l) => l.slice(indent)).join("\n");
}

/**
 * Builders for one course. Each course gets its own quiz counter, which rotates the options so the
 * correct answer lands evenly on A–D (authors can always write the right answer first).
 */
export function kit() {
  let n = 0;
  const lesson = (id: string, title: string, minutes: number, blocks: B[]): Lesson => ({
    id,
    title,
    minutes,
    blocks: blocks.map((b, i) => ({ ...b, id: `${id}-${i + 1}` }) as Block),
  });
  const mod = (id: string, title: string, lessons: Lesson[]): Module => ({ id, title, lessons });
  const text = (body: string): B => ({ type: "text", body: md(body) });
  const tip = (title: string, body: string): B => ({ type: "callout", tone: "tip", title, body: md(body) });
  const note = (title: string, body: string): B => ({ type: "callout", tone: "note", title, body: md(body) });
  const warn = (title: string, body: string): B => ({ type: "callout", tone: "warning", title, body: md(body) });
  const points = (items: string[], title = "Key takeaways"): B => ({ type: "keyPoints", title, items });
  const scenario = (title: string, body: string): B => ({ type: "scenario", title, body: md(body) });
  const reflect = (prompt: string): B => ({ type: "reflection", prompt });
  const resource = (title: string, url: string, description?: string): B => ({ type: "resource", title, url, ...(description ? { description } : {}) });
  /** `options[0]` is the correct answer; it is moved to a rotating position. */
  const quiz = (question: string, options: string[], explanation: string): B => {
    const target = [1, 3, 0, 2][n++ % 4] % options.length;
    const wrong = options.slice(1);
    const placed = [...wrong.slice(0, target), options[0], ...wrong.slice(target)];
    return { type: "quiz", question, options: placed, answer: target, explanation };
  };
  const prompt = (body: string, title = "Prompt to copy & paste"): B => ({ type: "prompt", title, body: md(body) });
  const activity = (title: string, body: string): B => ({ type: "activity", title, body: md(body) });
  return { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz, prompt, activity };
}
