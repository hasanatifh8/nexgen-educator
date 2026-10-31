import type { Content } from "./seed/kit";
import { ACTIVE_RUBRICS } from "./seed/activeRubrics";
import { AI_ETHICS } from "./seed/aiEthics";
import { DIFFERENTIATED_INSTRUCTION } from "./seed/differentiatedInstruction";
import { FORMATIVE_FEEDBACK } from "./seed/formativeFeedback";
import { GENAI_FOUNDATIONS } from "./seed/genaiFoundations";
import { HYBRID_CLASSROOMS } from "./seed/hybridClassrooms";
import { POSITIVE_BEHAVIOR } from "./seed/positiveBehavior";
import { PROMPT_ENGINEERING } from "./seed/promptEngineering";
import { SCENARIO_QUESTIONS } from "./seed/scenarioQuestions";

/** Starter content merged into seed courses (and into older catalog files missing content). One file per course in ./seed. */
export const SEED_CONTENT: Record<string, Content> = {
  // Free
  "genai-foundations": GENAI_FOUNDATIONS,
  "active-rubrics": ACTIVE_RUBRICS,
  "positive-behavior": POSITIVE_BEHAVIOR,
  // Premium
  "prompt-engineering": PROMPT_ENGINEERING,
  "ai-ethics": AI_ETHICS,
  "scenario-questions": SCENARIO_QUESTIONS,
  "formative-feedback": FORMATIVE_FEEDBACK,
  "differentiated-instruction": DIFFERENTIATED_INSTRUCTION,
  "hybrid-classrooms": HYBRID_CLASSROOMS,
};

export const EMPTY_CONTENT: Content = { overview: "", outcomes: [], modules: [] };
