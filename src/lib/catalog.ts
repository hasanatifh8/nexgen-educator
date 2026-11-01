/**
 * Catalog types, seed data and pure helpers. Safe to import from client components.
 * The live catalog is read/written by `catalogStore.ts` (server only).
 */
export const CATEGORIES = ["AI Tools for Teachers", "Assessment Design", "Classroom Management"] as const;
export type Category = (typeof CATEGORIES)[number];
export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export type Level = (typeof LEVELS)[number];

export type ExamQuestion = {
  id: string;
  prompt: string;
  scenario?: string;
  options: string[];
  /** Index into options. Never sent to learners. */
  answer: number;
  explanation?: string;
};

export type Exam = { minutes: number; passPercent: number; questions: ExamQuestion[] };

export type Program = {
  id: string;
  title: string;
  category: Category;
  level: Level;
  /** Total of its courses’ fees before GST (0 = every course is free). Derived when the catalog is read. */
  price: number;
  description: string;
  exam: Exam;
};

// --- Course content ----------------------------------------------------------

export type Block =
  | { id: string; type: "text"; body: string }
  | { id: string; type: "video"; url: string; caption?: string }
  | { id: string; type: "image"; url: string; alt: string; caption?: string }
  | { id: string; type: "callout"; tone: "tip" | "note" | "warning"; title: string; body: string }
  | { id: string; type: "keyPoints"; title: string; items: string[] }
  | { id: string; type: "scenario"; title: string; body: string }
  | { id: string; type: "quiz"; question: string; options: string[]; answer: number; explanation: string }
  | { id: string; type: "reflection"; prompt: string }
  | { id: string; type: "resource"; title: string; url: string; description?: string };

export type BlockType = Block["type"];
export type Lesson = { id: string; title: string; minutes: number; blocks: Block[] };
export type Module = { id: string; title: string; lessons: Lesson[] };
export type Instructor = { name: string; title: string };

export type Course = {
  id: string;
  title: string;
  category: Category;
  hours: number;
  level: Level;
  blurb: string;
  enrolled?: string;
  programId: string;
  /** Course fee in rupees before GST; 0 = free. */
  price: number;
  /** Longer “About this course” text (supports the rich-text format). */
  overview: string;
  outcomes: string[];
  instructor?: Instructor;
  modules: Module[];
};

/** Course data safe to send to listing pages: no lesson content. */
export type CourseSummary = Omit<Course, "modules"> & { lessonCount: number };

export const toCourseSummary = ({ modules, ...c }: Course): CourseSummary => ({
  ...c,
  lessonCount: modules.reduce((n, m) => n + m.lessons.length, 0),
});

/** Public syllabus: module and lesson titles only — used on promotional and listing pages. */
export type CourseOutline = CourseSummary & { syllabus: { title: string; lessons: { title: string; minutes: number }[] }[] };

export const toCourseOutline = (c: Course): CourseOutline => ({
  ...toCourseSummary(c),
  syllabus: c.modules.map((m) => ({ title: m.title, lessons: m.lessons.map((l) => ({ title: l.title, minutes: l.minutes })) })),
});

export const allLessons = (course: Pick<Course, "modules">) =>
  course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })));

export type Catalog = { programs: Program[]; courses: Course[] };

/** What learners see of a program: no exam answers. */
export type PublicProgram = Omit<Program, "exam"> & { exam: { minutes: number; passPercent: number; questionCount: number } };

export const toPublicProgram = ({ exam, ...p }: Program): PublicProgram => ({
  ...p,
  exam: { minutes: exam.minutes, passPercent: exam.passPercent, questionCount: exam.questions.length },
});

export const coursesFor = <C extends { programId: string }>(courses: C[], programId: string) => courses.filter((c) => c.programId === programId);
export const programHours = (courses: { programId: string; hours: number }[], programId: string) =>
  coursesFor(courses, programId).reduce((h, c) => h + c.hours, 0);


// ---------------------------------------------------------------------------
// Seed data (written to data/catalog.json on first run)
// ---------------------------------------------------------------------------

const q = (id: string, prompt: string, options: string[], answer: number, explanation: string, scenario?: string): ExamQuestion => ({
  id, prompt, options, answer, explanation, ...(scenario ? { scenario } : {}),
});

export type CourseBase = Omit<Course, "overview" | "outcomes" | "instructor" | "modules" | "price"> & { price?: number };

/** Course content for these lives in seedContent.ts and is merged in by catalogStore. */
export const SEED_CATALOG: { programs: Program[]; courses: CourseBase[] } = {
  programs: [
    {
      id: "ai-ready-educator",
      title: "Certified AI-Ready Educator",
      category: "AI Tools for Teachers",
      level: "Beginner",
      price: 0,
      description: "Your first credential in using AI assistants responsibly for planning and differentiation.",
      exam: {
        minutes: 10,
        passPercent: 70,
        questions: [
          q("q1", "What should you advise first?", ["Go ahead — it saves time", "Only paste the strongest essays", "Remove personal identifiers and check your school’s data policy", "Ask students to paste their own essays instead"], 2,
            "Student data privacy comes first: de-identify work and follow your institution’s policy before using external AI tools.",
            "A colleague wants to paste student essays, including names, into a public AI chatbot to get feedback suggestions."),
          q("q2", "Which is the best use of AI when differentiating a reading passage?", ["Generate leveled versions, then review them for accuracy", "Replace the passage with AI text without reviewing it", "Let each student pick any AI summary online", "Avoid AI entirely for differentiation"], 0,
            "AI can draft leveled texts quickly, but the teacher must verify accuracy and alignment."),
          q("q3", "An AI tool states an incorrect historical date with full confidence. This is best described as:", ["Bias", "Overfitting", "Plagiarism", "Hallucination"], 3,
            "Hallucinations are fluent but false outputs — always fact-check AI-generated content."),
        ],
      },
    },
    {
      id: "rubric-design",
      title: "Rubric Design Certificate",
      category: "Assessment Design",
      level: "Beginner",
      price: 0,
      description: "Prove you can write criteria that measure the skills you actually teach.",
      exam: {
        minutes: 10,
        passPercent: 70,
        questions: [
          q("q1", "A strong rubric criterion should be:", ["Observable and aligned to the learning objective", "Vague, so teachers keep flexibility", "Focused mainly on neatness", "Identical for every assignment"], 0,
            "Criteria should describe observable evidence of the target skill."),
          q("q2", "How many performance levels are generally most usable for students?", ["1", "3–4", "10", "20"], 1,
            "Three to four levels balance precision with clarity."),
          q("q3", "Sharing the rubric before the task mainly helps students to:", ["Finish faster", "Avoid feedback", "Understand the success criteria", "Grade peers more harshly"], 2,
            "Transparent criteria let students aim at — and self-assess against — the target."),
        ],
      },
    },
    {
      id: "classroom-climate",
      title: "Classroom Climate Certificate",
      category: "Classroom Management",
      level: "Beginner",
      price: 0,
      description: "Demonstrate routines and behavior systems that prevent disruption.",
      exam: {
        minutes: 10,
        passPercent: 70,
        questions: [
          q("q1", "The most effective time to teach classroom routines is:", ["After problems appear", "In the first weeks — explicitly, with practice", "Only during parent meetings", "Never; students learn them implicitly"], 1,
            "Routines taught and rehearsed early prevent most disruptions."),
          q("q2", "A student repeatedly calls out. A positive behavior approach would first:", ["Reteach and reinforce the expected behavior", "Send the student out of class", "Remove recess for the whole class", "Ignore all students for the lesson"], 0,
            "Positive systems start by clarifying and reinforcing the expected behavior."),
          q("q3", "Specific praise is most effective when it:", ["Is generic, like “good job”", "Is given only in public", "Is very rare", "Names the exact behavior observed"], 3,
            "Behavior-specific praise tells students exactly what to repeat."),
        ],
      },
    },
    {
      id: "ai-lesson-design",
      title: "AI Lesson Design Specialist",
      category: "AI Tools for Teachers",
      level: "Intermediate",
      price: 450,
      description: "Advanced prompting for standards-aligned lessons plus AI ethics and academic integrity.",
      exam: {
        minutes: 15,
        passPercent: 70,
        questions: [
          q("q1", "Which prompt is most likely to produce a standards-aligned activity?", ["Make a fun math lesson", "Give me some ideas", "Create a 20-minute Grade 6 ratios activity aligned to 6.RP.A.1 with a 3-level rubric", "Write something about numbers"], 2,
            "Specific grade, standard, duration and output format yield aligned results."),
          q("q2", "A fair AI-use policy for assignments should:", ["Define permitted uses per task and require disclosure", "Ban all AI use everywhere", "Allow anything without disclosure", "Change weekly without notice"], 0,
            "Task-level clarity plus disclosure supports integrity and learning."),
          q("q3", "“Few-shot prompting” means:", ["Asking very short questions", "Using the AI only a few times", "Limiting response length", "Including examples of the desired output in the prompt"], 3,
            "Examples in the prompt steer the model toward the format and quality you want."),
        ],
      },
    },
    {
      id: "assessment-author",
      title: "Assessment Author Credential",
      category: "Assessment Design",
      level: "Advanced",
      price: 450,
      description: "Author scenario-based questions and feedback systems that move learning forward.",
      exam: {
        minutes: 15,
        passPercent: 70,
        questions: [
          q("q1", "A good distractor in a multiple-choice question is:", ["Obviously wrong", "Plausible and based on a common misconception", "Always longer than the correct answer", "“All of the above”"], 1,
            "Distractors rooted in misconceptions reveal what students actually misunderstand."),
          q("q2", "An item difficulty index of 0.95 means:", ["The item is very hard", "The item discriminates well", "95% of students answered correctly — the item is very easy", "The item is invalid"], 2,
            "Difficulty (p-value) is the proportion answering correctly."),
          q("q3", "Formative feedback is most effective when it is:", ["Timely, specific and actionable", "Delayed until the end of term", "A grade only", "Identical for all students"], 0,
            "Students need feedback they can act on while learning is still happening."),
        ],
      },
    },
    {
      id: "differentiation-specialist",
      title: "Differentiation & Hybrid Teaching Specialist",
      category: "Classroom Management",
      level: "Intermediate",
      price: 450,
      description: "Lead mixed-ability, hybrid and online classrooms with confidence.",
      exam: {
        minutes: 15,
        passPercent: 70,
        questions: [
          q("q1", "“Flexible grouping” means:", ["Fixed ability groups all year", "Students always sit with friends", "Groups change based on ongoing assessment and the task", "Never using groups"], 2,
            "Groups should shift as evidence about student needs changes."),
          q("q2", "In a hybrid class, the best way to keep remote students engaged is to:", ["Assign structured roles and use shared digital workspaces", "Speak only to in-room students", "Ask remote students to turn off cameras", "Give remote students different content"], 0,
            "Roles and shared workspaces make remote learners active participants."),
          q("q3", "A choice board primarily supports:", ["Teacher convenience only", "Standardized timing", "Faster grading", "Student agency across varied readiness and interests"], 3,
            "Choice boards let students take different paths to the same goals."),
        ],
      },
    },
  ],
  courses: [
    { id: "genai-foundations", programId: "ai-ready-educator", title: "Generative AI Foundations for Educators", category: "AI Tools for Teachers", hours: 4, level: "Beginner", blurb: "Use AI assistants to plan lessons, differentiate materials, and save hours each week.", enrolled: "3.2k" },
    { id: "prompt-engineering", programId: "ai-lesson-design", title: "Prompt Engineering for Lesson Design", category: "AI Tools for Teachers", hours: 6, level: "Intermediate", blurb: "Craft prompts that produce standards-aligned activities, rubrics, and exemplars.", enrolled: "2.1k" },
    { id: "ai-ethics", programId: "ai-lesson-design", title: "Ethics & Academic Integrity in the AI Era", category: "AI Tools for Teachers", hours: 3, level: "Advanced", blurb: "Build fair AI-use policies and redesign tasks that reward authentic thinking.", enrolled: "1.4k" },
    { id: "active-rubrics", programId: "rubric-design", title: "Designing Rubrics for Active Learning", category: "Assessment Design", hours: 5, level: "Beginner", blurb: "Write criteria that measure the skills you actually teach — not just compliance.", enrolled: "2.8k" },
    { id: "scenario-questions", programId: "assessment-author", title: "Scenario-Based Question Writing", category: "Assessment Design", hours: 7, level: "Advanced", blurb: "Author MCQs that test judgment and application, with item-analysis basics.", enrolled: "980" },
    { id: "formative-feedback", programId: "assessment-author", title: "Formative Feedback That Moves Learning", category: "Assessment Design", hours: 4, level: "Intermediate", blurb: "Give timely, actionable feedback at scale using peer and digital tools.", enrolled: "1.9k" },
    { id: "positive-behavior", programId: "classroom-climate", title: "Positive Behavior Systems", category: "Classroom Management", hours: 5, level: "Beginner", blurb: "Set routines and expectations that prevent disruptions before they start.", enrolled: "3.6k" },
    { id: "differentiated-instruction", programId: "differentiation-specialist", title: "Differentiated Instruction in Mixed-Ability Rooms", category: "Classroom Management", hours: 8, level: "Intermediate", blurb: "Plan tiered tasks, flexible grouping, and choice boards that work in practice.", enrolled: "2.4k" },
    { id: "hybrid-classrooms", programId: "differentiation-specialist", title: "Managing Hybrid & Online Classrooms", category: "Classroom Management", hours: 6, level: "Advanced", blurb: "Keep remote and in-person learners equally engaged and accountable.", enrolled: "1.1k" },
  ],
};

// --- Pricing (Indian rupees; prices are stored before GST) ---------------------

export const GST_RATE = 0.18;
export const DEFAULT_PREMIUM_PRICE = 450;

/** "₹450", "₹1,20,000" — Indian digit grouping. */
export const formatINR = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
export const gstOn = (price: number) => Math.round(price * GST_RATE * 100) / 100;
export const priceWithGst = (price: number) => Math.round((price + gstOn(price)) * 100) / 100;
/** Compact label for badges: "Free" or "₹450 + GST". */
export const priceShort = (price: number) => (price === 0 ? "Free" : `${formatINR(price)} + GST`);
/** Full label: "₹450 + 18% GST (₹531 total)". */
export const priceFull = (price: number) =>
  price === 0 ? "Free" : `${formatINR(price)} + ${Math.round(GST_RATE * 100)}% GST (${formatINR(priceWithGst(price))} total)`;
