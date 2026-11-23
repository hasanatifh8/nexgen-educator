import Link from "next/link";
import { BUILT_FOR_YOU } from "@/lib/marketing";
import { IconArrowRight, IconBook, IconClock, IconPhone, IconRefresh, IconUsers, IconWallet } from "../Icons";

const icons = [IconBook, IconClock, IconPhone, IconWallet, IconUsers, IconRefresh];

/** Reassurance for teachers with little technical confidence: every barrier they fear, answered. */
export default function BuiltForYou() {
  return (
    <section id="made-for-you" aria-labelledby="made-for-you-title" className="bg-slate-50 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Made for busy teachers</span>
          <h2 id="made-for-you-title" className="section-title mt-4">Not a “computer person”? This was built for you.</h2>
          <p className="section-lede">
            If you can use WhatsApp, you can learn with NextGen Educator. We designed every step for teachers who are new to
            technology and short on time.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BUILT_FOR_YOU.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={item.title} className="card p-7">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-sky-50 text-brand-ink ring-1 ring-sky-100">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-5 font-display text-xl font-semibold text-navy-900">{item.title}</p>
                <p className="mt-2 leading-relaxed text-slate-600">{item.body}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <Link href="/register" className="btn-primary px-7 py-3.5 text-base">
            Create my free account <IconArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-sm text-slate-600">Takes less than a minute. No payment needed.</p>
        </div>
      </div>
    </section>
  );
}
