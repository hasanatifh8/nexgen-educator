import Link from "next/link";
import { finderHref } from "@/lib/courseFinder";
import { TEACHER_PERSONAS } from "@/lib/marketing";
import { IconArrowRight, IconHome, IconLightbulb, IconPencil, IconSparkles } from "../Icons";

const icons = [IconHome, IconLightbulb, IconPencil, IconSparkles];

/** Lets a visitor recognise themselves, then sends them to the course finder. */
export default function TeacherPersonas() {
  return (
    <section id="for-you" aria-labelledby="for-you-title" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Find yourself here</span>
          <h2 id="for-you-title" className="section-title mt-4">Whatever you teach, there’s a course for you</h2>
          <p className="section-lede">Courses are written for Indian classrooms, from Playgroup to Class 12.</p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEACHER_PERSONAS.map((p, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={p.title}>
                <Link href={finderHref(p.finder)} className="card card-hover group flex h-full flex-col p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-accent-strong ring-1 ring-orange-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-display text-lg leading-snug font-semibold text-navy-900">{p.title}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{p.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink group-hover:gap-2.5">
                    Find my course <IconArrowRight className="h-4 w-4 transition-all" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
