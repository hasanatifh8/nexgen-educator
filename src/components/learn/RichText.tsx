import { Fragment, type ReactNode } from "react";

/**
 * Tiny, safe formatter for lesson text — never renders raw HTML.
 * Supports: "## Heading", "### Subheading", "- bullets", "1. numbered", **bold**, *italic*, blank-line paragraphs.
 */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(m[1] ? <strong key={m.index} className="font-semibold text-navy-900">{m[1]}</strong> : <em key={m.index}>{m[2]}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function RichText({ text, className = "" }: { text: string; className?: string }) {
  // Headings always stand alone, even without surrounding blank lines.
  const blocks = text.replace(/\r\n/g, "\n").replace(/^(#{2,3} .*)$/gm, "\n$1\n").trim().split(/\n{2,}/);
  return (
    <div className={`space-y-4 text-[1.0625rem] leading-relaxed text-slate-700 ${className}`}>
      {blocks.map((raw, i) => {
        const lines = raw.split("\n").filter((l) => l.trim());
        if (!lines.length) return null;
        if (lines.length === 1 && lines[0].startsWith("## "))
          return <h2 key={i} className="pt-2 font-display text-2xl font-bold tracking-tight text-navy-900">{inline(lines[0].slice(3))}</h2>;
        if (lines.length === 1 && lines[0].startsWith("### "))
          return <h3 key={i} className="pt-1 font-display text-lg font-semibold text-navy-900">{inline(lines[0].slice(4))}</h3>;
        if (lines.every((l) => /^[-*] /.test(l)))
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" /><span className="min-w-0">{inline(l.slice(2))}</span></li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\. /.test(l)))
          return (
            <ol key={i} className="space-y-2.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-50 text-xs font-bold text-brand-ink ring-1 ring-sky-100">{j + 1}</span>
                  <span>{inline(l.replace(/^\d+\. /, ""))}</span>
                </li>
              ))}
            </ol>
          );
        return (
          <p key={i}>
            {lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l)}</Fragment>)}
          </p>
        );
      })}
    </div>
  );
}
