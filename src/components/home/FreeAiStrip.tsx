import Link from "next/link";
import { AI_RESOURCES } from "@/lib/aiResources";
import AiToolBadge from "../AiToolBadge";
import { IconArrowRight } from "../Icons";

/** Slim home-page pointer to the free AI courses page. */
export default function FreeAiStrip() {
  return (
    <section aria-label="Free AI courses from AI companies" className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href="/free-ai-learning" className="group card card-hover flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex shrink-0 items-center gap-1.5">
            {AI_RESOURCES.map((r) => <AiToolBadge key={r.id} r={r} size="sm" />)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold text-navy-900">Also free: AI courses from the makers of Claude, ChatGPT, Gemini and Copilot</p>
            <p className="text-sm text-slate-600">We’ve collected the official free courses for teachers in one place — for your information.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-ink group-hover:gap-2.5">
            See the list <IconArrowRight className="h-4 w-4 transition-all" />
          </span>
        </Link>
      </div>
    </section>
  );
}
