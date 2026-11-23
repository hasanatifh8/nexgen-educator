import { launchLabel, type Catalog } from "../catalog";
import type { ProposalProgram, ProposalStats } from "./pdf";

/** Programs as the proposal shows them: public courses only (disabled ones removed), in catalog order. */
export function proposalPrograms({ programs, courses }: Catalog): ProposalProgram[] {
  return programs
    .map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      level: p.level,
      description: p.description,
      exam: { questions: p.exam.questions.length, minutes: p.exam.minutes, passPercent: p.exam.passPercent },
      courses: courses
        .filter((c) => c.programId === p.id && !c.disabled)
        .map((c) => ({
          title: c.title,
          hours: c.hours,
          lessons: (c.modules ?? []).reduce((n, m) => n + m.lessons.length, 0),
          price: c.price ?? 0,
          outcomes: c.outcomes ?? [],
          ...(c.launch ? { upcoming: launchLabel(c.launch) } : {}),
        })),
    }))
    .filter((p) => p.courses.length > 0);
}

export function proposalStats(programs: ProposalProgram[]): ProposalStats {
  const courses = programs.flatMap((p) => p.courses);
  return {
    programs: programs.length,
    courses: courses.length,
    hours: courses.reduce((s, c) => s + c.hours, 0),
    lessons: courses.reduce((s, c) => s + c.lessons, 0),
  };
}
