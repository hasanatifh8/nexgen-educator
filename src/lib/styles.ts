import type { Category, Level } from "./catalog";

export const LEVEL_STYLES: Record<Level, string> = {
  Beginner: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Intermediate: "bg-sky-50 text-sky-700 ring-sky-100",
  Advanced: "bg-orange-50 text-orange-700 ring-orange-100",
};

export const CATEGORY_ACCENT: Record<Category, string> = {
  "AI Tools for Teachers": "from-brand to-brand-teal",
  "Assessment Design": "from-navy-800 to-brand",
  "Classroom Management": "from-accent to-amber-400",
  "Early Years & Primary": "from-pink-500 to-amber-400",
};
