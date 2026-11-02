import type { Course, ExamQuestion, Program } from "../catalog";
import { kit, type Content } from "./kit";

/**
 * “AI-Powered English Pedagogy” — generative AI for English teachers of Classes 6–12 (CBSE and ICSE/ISC).
 * Board formats and free-plan limits change every year, so lessons name task types and point teachers to the
 * latest official sample/specimen papers and each tool’s own pricing page instead of fixing marks or quotas.
 * (Quizizz was renamed Wayground in June 2025.)
 */

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz, prompt, activity } = kit();

export const ENGLISH_PROGRAM_ID = "ai-english-educator";
export const ENGLISH_COURSE_ID = "ai-powered-english-pedagogy";

let examIndex = 0;
/** Correct answer written first, then rotated so answers spread evenly across A–D. */
const q = (id: string, prompt: string, options: string[], explanation: string, scenario?: string): ExamQuestion => {
  const target = [3, 1, 0, 2][examIndex++ % 4] % options.length;
  const wrong = options.slice(1);
  return { id, prompt, options: [...wrong.slice(0, target), options[0], ...wrong.slice(target)], answer: target, explanation, ...(scenario ? { scenario } : {}) };
};

export const ENGLISH_PROGRAM: Program = {
  id: ENGLISH_PROGRAM_ID,
  title: "AI-Powered English Educator (Classes 6–12)",
  category: "AI Tools for Teachers",
  level: "Intermediate",
  price: 0,
  description:
    "Generative AI for CBSE and ICSE/ISC English teachers: precision prompts, board-aligned lessons, differentiated reading, writing formats, grammar, literature, speaking and listening, and academic integrity.",
  exam: {
    minutes: 50,
    passPercent: 70,
    questions: [
      q("en01", "A large language model (LLM) such as ChatGPT or Claude produces its answers mainly by…", ["Predicting likely next words (tokens) from patterns in its training data", "Looking up every answer in the NCERT textbook", "Copying the first search result", "Asking a human expert"],
        "LLMs generate text token by token. That makes them fluent — and capable of confident mistakes."),
      q("en02", "An AI tool gives you a “quotation” from Julius Caesar that you can’t find in the play. This is…", ["A hallucination — always verify quotations against the prescribed text", "Proof the AI has a better edition", "A spelling error", "Fine to use if it sounds Shakespearean"],
        "Invented quotes, page numbers and author facts are common hallucinations in literature tasks."),
      q("en03", "Which prompt is most likely to give a board-ready result?", ["“Act as a CBSE Class 10 English teacher. Create a 45-minute lesson on ‘A Letter to God’ for mixed-ability students, with a warm-up, two inference questions and an exit ticket. Stay within the NCERT text.”", "“Lesson plan on A Letter to God.”", "“Help me teach English.”", "“Make it interesting.”"],
        "Persona, board and grade, topic, objective and constraints turn a generic request into a precise one."),
      q("en04", "What are “exemplars” in a prompt?", ["Sample answers or formats you show the AI so it copies the style and level you want", "The students’ names", "The final marks", "A list of AI tools"],
        "Showing one good example (for instance, a model notice) is one of the fastest ways to improve AI output."),
      q("en05", "Which student detail is safe to include in a prompt?", ["“A Class 8 student who confuses ‘since’ and ‘for’”", "The student’s full name and roll number", "The student’s marks with their name", "A photo of the student’s notebook with their name on it"],
        "Describe the learning need, never the person. Follow your school’s policy and the DPDP Act, 2023."),
      q("en06", "In a 45-minute lesson blueprint, a “formative checkpoint” is…", ["A quick check during the lesson that shows whether students have understood before you move on", "The final board exam", "The homework given at the end of term", "A break between periods"],
        "Checkpoints — a hinge question, thumbs up/down, a one-line answer — let you adjust while teaching."),
      q("en07", "CBSE’s competency-based questions mainly test whether students can…", ["Apply understanding to new texts and situations, not just recall", "Memorise answers from a guidebook", "Write as many words as possible", "Recite poems"],
        "Competency-based items ask students to interpret, infer, evaluate and apply."),
      q("en08", "You want one unseen passage at three reading levels for a mixed Class 7. The best tool and approach is…", ["Diffit or a chatbot to level the text, then you check that every version keeps the same key ideas and facts", "Give weaker readers a different topic entirely", "Use only the hardest version for everyone", "Ask students to level it themselves"],
        "Same content, different complexity. Always verify that levelling hasn’t changed the meaning."),
      q("en09", "Which is an inference question rather than a direct question?", ["“Why do you think the narrator kept the letter a secret?”", "“What is the name of the narrator’s village?”", "“In which year was the story written?”", "“How many characters are in the story?”"],
        "Inference questions ask students to read between the lines and justify with evidence."),
      q("en10", "A student’s formal letter has excellent content but the wrong format. Using AI for feedback, you should…", ["Ask for feedback against the board’s format and a rubric, then review it before giving it to the student", "Let AI give the final marks", "Ask AI to rewrite the letter for the student", "Ignore the format"],
        "AI can apply a rubric quickly; the teacher decides the final feedback and marks."),
      q("en11", "Which writing task is typically based on a chart, data or cues in CBSE Class 10?", ["Analytical paragraph", "Diary entry", "Poem", "Book review"],
        "Analytical paragraphs ask students to describe and interpret information such as a chart or data."),
      q("en12", "In ICSE English Language, a question like “Rewrite the sentence beginning with ‘Hardly…’” tests…", ["Transformation of sentences", "Letter writing", "Comprehension", "Literature"],
        "Transformation of sentences (“Do as directed”) is a core part of ICSE functional grammar."),
      q("en13", "Which is the most useful AI task for grammar practice?", ["Generating graded “Do as directed” items with an answer key, which you check before use", "Asking AI to explain grammar without examples", "Letting students copy AI answers", "Replacing the textbook with AI"],
        "AI is excellent at producing many practice items quickly — but answer keys can contain errors."),
      q("en14", "AI says a sentence is correct, but you believe a preposition is wrong. What should you do?", ["Check a reliable grammar reference or dictionary; AI can be wrong about grammar too", "Trust AI because it is always right", "Remove the question", "Ask the class to vote"],
        "Use LanguageTool, a good grammar book or a dictionary to confirm."),
      q("en15", "Which is a good use of AI for teaching a Shakespeare scene?", ["Creating a modern-English paraphrase side by side with the original, which you check for accuracy", "Replacing the original text with a summary", "Asking AI to write students’ answers", "Skipping the scene"],
        "Paraphrases support understanding, but students must still engage with Shakespeare’s language."),
      q("en16", "For poetry analysis, AI is most helpful for…", ["Generating guiding questions on imagery, tone and poetic devices to start discussion", "Deciding the one correct interpretation", "Writing students’ appreciation answers", "Counting syllables only"],
        "Literature thrives on interpretation. Use AI to open discussion, not to close it."),
      q("en17", "Why should you be careful when pasting full chapters of a prescribed anthology into AI tools?", ["The texts are copyrighted and some tools may store what you upload; use short extracts and check school policy", "AI cannot read English", "It is always illegal to teach the text", "Chapters are too short"],
        "Short extracts for classroom use and school-approved tools are the safer practice."),
      q("en18", "In ASL (Assessment of Speaking and Listening), a fair way to use AI is to…", ["Generate listening scripts and speaking prompts, and use text-to-speech for listening practice", "Let AI grade students’ voices automatically for board marks", "Record students without consent", "Replace the teacher’s judgement"],
        "AI creates practice material; the teacher assesses using the board’s criteria."),
      q("en19", "Before using a voice tool like ElevenLabs in class, you must remember…", ["Never clone anyone’s voice — especially a student’s — without clear consent; follow school policy", "Voice cloning is always fine for students", "It works only in Hindi", "It replaces speaking practice"],
        "Voice cloning raises serious consent, privacy and misuse concerns."),
      q("en20", "What is Otter.ai mainly used for?", ["Transcribing speech into text, e.g. to review a class debate", "Designing slides", "Checking grammar", "Levelling reading passages"],
        "Transcripts help students reflect on their spoken English and help teachers give feedback."),
      q("en21", "Hemingway Editor is useful because it…", ["Highlights long, hard-to-read sentences and shows a readability grade", "Writes essays for students", "Translates texts", "Creates quizzes"],
        "Readability feedback helps students write clearer sentences — and helps you check passage difficulty."),
      q("en22", "Quizizz is now called…", ["Wayground", "Curipod", "Gamma", "Diffit"],
        "Quizizz rebranded as Wayground in 2025. Existing quizzes carried over."),
      q("en23", "Canva for Education is…", ["Free for eligible K-12 teachers and students", "Only for universities", "Only available in the USA", "A grammar checker"],
        "Eligible school teachers can verify their account to unlock Canva’s education features for free."),
      q("en24", "A student’s essay is flagged “90% AI-written” by a detector. What is the best first step?", ["Talk with the student about their process and ask them to explain their ideas; a detector score alone is not proof", "Give zero marks immediately", "Report the student to the principal", "Run it through three more detectors and average them"],
        "Detectors produce false positives — especially for second-language writers. Use conversation and evidence of process."),
      q("en25", "Which assessment design makes AI misuse least effective?", ["Process-based tasks: drafts in class, personal reflection, oral explanation and local, specific contexts", "Generic essays set as homework with no drafts", "Only multiple-choice homework", "Copying questions from past papers"],
        "When the process is visible and personal, shortcuts stop working."),
      q("en26", "QuillBot’s paraphraser should be used in class to…", ["Compare paraphrases and discuss how word choice changes meaning and tone", "Disguise copied work", "Write full answers for students", "Replace vocabulary teaching"],
        "Used openly, paraphrasing tools teach nuance; used secretly, they become plagiarism tools."),
      q("en27", "Your AI-generated reading quiz has one question with two defensible answers. You should…", ["Edit or replace it — every MCQ needs one clearly correct answer", "Accept both answers silently", "Keep it to confuse students", "Delete the whole quiz"],
        "Review every item for accuracy, clarity and a single correct answer."),
      q("en28", "Why include a model answer (exemplar) when asking AI to create a notice-writing task?", ["So the AI matches the exact format, length and tone your board expects", "To make the prompt longer", "Because AI can’t write notices", "So students can copy it"],
        "Exemplars anchor format and level — crucial for board writing tasks."),
      q("en29", "Which statement about free AI plans is generally true?", ["Free plans have usage limits that change often, so check each tool’s pricing page", "Free plans never have limits", "Free plans are illegal in schools", "Free plans cannot be used for English"],
        "Limits and features change frequently. Start free and upgrade only if you regularly hit limits."),
      q("en30", "A strong capstone unit plan for this course includes…", ["Board-aligned objectives, a 45-minute lesson flow, levelled reading, a writing or grammar task with rubric, a speaking activity and an AI-use policy", "Only an AI-generated worksheet", "A list of AI tools", "A single long lecture"],
        "The rubric rewards alignment, engagement, differentiation, assessment quality and responsible AI use."),
    ],
  },
};

const content: Content = {
  instructor: { name: "NextGen Educator English Faculty", title: "Language Pedagogy & EdTech Specialists" },
  overview: `A practitioner-focused course for **English Language and Literature teachers of Classes 6–12** in **CBSE and ICSE/ISC** schools.

You teach a dense syllabus: Shakespearean drama, poetry analysis, ICSE functional grammar, CBSE writing formats, unseen comprehension and the Assessment of Speaking and Listening. This course shows you how to use **free and freemium AI tools** to cut preparation time sharply, while moving your classroom from passive content delivery to **experiential learning, critical thinking and genuine engagement**.

**You will learn to**

- Write precision prompts using the **5-part anatomy**: Persona, Grade/Board, Topic, Objective, Constraints — plus exemplars
- Build **board-aligned 45-minute lessons** in minutes
- Level any passage into **three reading tiers** with direct and inference questions
- Teach **notices, letters, reports and analytical paragraphs** with AI-generated models and rubrics
- Generate graded **grammar practice** (prepositions, transformation of sentences, editing, reported speech)
- Bring **Shakespeare and poetry** alive with paraphrase, role-play and discussion prompts
- Prepare students for **speaking and listening** assessment with text-to-speech and transcription
- Handle **plagiarism, AI detection and academic integrity** fairly and transparently

**Tools featured (free or freemium):** ChatGPT, Claude, Microsoft Copilot, Google Gemini, MagicSchool, Diffit, Almanack, TeachBetter.ai, QuillBot, Hemingway Editor, LanguageTool, Canva for Education, Gamma, Wayground (formerly Quizizz), Curipod, NaturalReader, ElevenLabs and Otter.ai.

**Format:** 10 modules, about 6 hours of lessons plus classroom practice, ending in a capstone unit plan. Pass the **30-question exam** to earn your certificate.`,
  outcomes: [
    "Explain how LLMs work, including tokens and hallucinations, and use them safely",
    "Turn generic requests into board-aligned precision prompts with the 5-part anatomy and exemplars",
    "Design a 45-minute English lesson with warm-up, guided analysis, checkpoints and differentiated homework",
    "Level a comprehension passage into three tiers with direct and inference-based MCQs",
    "Teach CBSE and ICSE writing formats with AI-generated models, checklists and rubrics",
    "Create accurate, graded grammar practice and verify answer keys",
    "Use AI to deepen — not replace — the study of Shakespeare and poetry",
    "Plan speaking and listening practice with text-to-speech and transcription tools",
    "Design assessments and policies that uphold academic integrity in the age of AI",
  ],
  modules: [
    // ─────────────────────────────── MODULE 1 ───────────────────────────────
    mod("m1", "AI literacy and prompt engineering for English teachers", [
      lesson("how-llms-work", "How AI language models actually work", 15, [
        text(`
          ## Tokens, prediction and fluency

          Tools like **ChatGPT, Claude, Microsoft Copilot and Google Gemini** are *large language models* (LLMs). They read text as **tokens** — small chunks of words — and write by **predicting the next most likely token**, again and again.

          That is why they are superb at English tasks: rewording, summarising, generating examples, matching a tone. It is also why they can be **fluent and wrong at the same time**.

          ## Hallucinations English teachers must watch for

          - **Invented quotations** from a play or poem
          - **Wrong author facts** — dates, nationality, other works
          - **Made-up page numbers or line references**
          - **Grammar explanations that sound right but aren’t**
          - **Out-of-date syllabus details** — removed chapters, old formats
        `),
        warn("Verify before you teach", "Check every quotation, author fact and grammar rule against the **prescribed textbook**, a reliable dictionary or grammar reference. Check formats against the **latest CBSE sample paper or CISCE specimen paper**."),
        scenario("The quote that never was", "Ms. D’Souza asked an AI for five key quotations from Act III of *Julius Caesar*. Four were perfect. The fifth sounded Shakespearean — but wasn’t in the play. A sharp student spotted it. Now she asks the AI to give the **act and scene** for each quote and checks them herself before class."),
        quiz("What is a hallucination?", ["A fluent, confident answer that is false", "A slow response", "A spelling mistake by the student", "A very long answer"], "Fluency is not accuracy — always check."),
      ]),
      lesson("prompt-anatomy", "The 5-part prompt anatomy", 18, [
        text(`
          ## From generic to precise

          A generic query — *“Give me a lesson plan on Julius Caesar”* — gets a generic answer. A precision prompt has five parts:

          1. **Persona:** “Act as an experienced ICSE English Literature teacher.”
          2. **Grade/Board:** “Class 10, ICSE, preparing for the board exam.”
          3. **Topic:** “*Julius Caesar*, Act III Scene ii — the funeral speeches.”
          4. **Objective:** “Students compare how Brutus and Antony persuade the crowd.”
          5. **Constraints:** “45 minutes, 40 students, no projector; quote only from the play; include an exit ticket.”

          ## Add exemplars

          **Exemplars** are examples you paste in — a model answer, a format you like, a past question. They are the fastest way to get the level and style you want.

          ## Then iterate

          Reply with specific follow-ups: *“Make the warm-up shorter”*, *“Add two inference questions”*, *“Simplify the language for second-language learners.”*
        `),
        prompt(`Persona: Act as an experienced ICSE English Literature teacher.
Grade/Board: Class 10, ICSE, preparing for the board examination.
Topic: Julius Caesar, Act III Scene ii (the funeral speeches of Brutus and Mark Antony).
Objective: Students analyse and compare the persuasive techniques used by Brutus and Antony.
Constraints: 45 minutes; 40 students; no projector; quote only lines that appear in the play and give the act and scene for each; include a 5-minute exit ticket.
Exemplar of the exit ticket style I want: "Identify one rhetorical device Antony uses and explain its effect on the crowd in two sentences."`, "A precision prompt (ICSE literature)"),
        activity("Generic vs precise", "Type “Give me a lesson plan on Julius Caesar” into an AI tool. Then paste the precision prompt above. Compare the two answers side by side. Note three differences that matter for your class."),
        quiz("Which part of the prompt is “no projector; 45 minutes; quote only from the play”?", ["Constraints", "Persona", "Topic", "Objective"], "Constraints set the limits the answer must respect."),
      ]),
      lesson("tools-and-safety", "Your free AI toolkit, and staying safe", 15, [
        text(`
          ## The toolkit at a glance

          - **General assistants:** ChatGPT, Claude, Microsoft Copilot, Google Gemini — drafting, explaining, generating.
          - **Educator platforms:** MagicSchool, Almanack, TeachBetter.ai (an Indian platform) — ready-made teacher tools.
          - **Differentiated reading:** Diffit — levels any text and adds questions.
          - **Language precision:** QuillBot (paraphrase, summarise), Hemingway Editor (readability), LanguageTool (grammar and spelling).
          - **Visual and interactive:** Canva for Education, Gamma (presentations), Wayground (formerly Quizizz), Curipod.
          - **Audio:** NaturalReader and ElevenLabs (text-to-speech), Otter.ai (transcription).
        `),
        note("About free plans", "Free tiers are generous but **limited**, and limits change often. Check each tool’s pricing page, start free, and pay only if you keep hitting limits. Canva for Education is free for eligible K-12 teachers who verify their account."),
        warn("Privacy rules", `- Never paste students’ names, roll numbers, marks, photos or personal stories.
- Remove names from student writing before asking for feedback (“Student A”).
- Prefer school-approved accounts and check each tool’s data settings.
- Check each tool’s **minimum age** before students use it.
- India’s **Digital Personal Data Protection Act, 2023** applies to children’s personal data.`),
        reflect("Which two tools from this list will you try first, and for which task?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 2 ───────────────────────────────
    mod("m2", "Board-aligned lesson planning", [
      lesson("board-alignment", "CBSE competencies and ICSE literary depth", 15, [
        text(`
          ## Two boards, two emphases

          - **CBSE:** learning outcomes and **competency-based questions** — applying understanding to unfamiliar texts and situations, interpreting, inferring and evaluating.
          - **ICSE/ISC:** precise language work (functional grammar, composition) and **deep literary study** — themes, characters, context and close reading of the prescribed texts.

          Both align with **NEP 2020**, which calls for experiential learning, critical thinking and less rote memorisation.

          ## Examples you may teach

          - CBSE Class 10 (*First Flight*): “A Letter to God”, “Dust of Snow”, “Nelson Mandela: Long Walk to Freedom”
          - CBSE Class 12 (*Flamingo*): “The Last Lesson”, “Lost Spring”, “My Mother at Sixty-six”
          - ICSE Class 9–10: *Julius Caesar* (Acts I–II in Class 9, Acts III–V in Class 10) and the *Treasure Chest* anthology of short stories and poems
        `),
        note("Always check the current list", "Prescribed chapters and paper formats change. Confirm against the **current syllabus** and the **latest CBSE sample paper or CISCE specimen paper** before planning."),
        quiz("What is a key feature of CBSE’s competency-based questions?", ["They ask students to apply understanding to new texts and situations", "They test only memorised definitions", "They avoid literature", "They have no marking scheme"], "Application and interpretation are central."),
        resource("CBSE Academic — curriculum and sample papers", "https://cbseacademic.nic.in/", "Official syllabus, sample question papers and marking schemes."),
        resource("CISCE — ICSE and ISC", "https://cisce.org/", "Official regulations, syllabus and specimen papers."),
      ]),
      lesson("lesson-blueprint", "The 45-minute lesson blueprint", 20, [
        text(`
          ## A reliable structure

          1. **Warm-up (5 min):** a hook — a striking line, a picture, a question from students’ lives.
          2. **Guided analysis (15 min):** close reading with the teacher modelling thinking aloud.
          3. **Pair or group task (10 min):** students apply the idea themselves.
          4. **Formative checkpoint (5 min):** a hinge question, thumbs up/down or a one-line answer.
          5. **Consolidation (5 min):** students summarise; you clear misconceptions.
          6. **Exit ticket and differentiated homework (5 min):** support, core and stretch options.
        `),
        prompt(`Persona: Act as a CBSE English Language and Literature teacher skilled in competency-based teaching and NEP 2020 experiential learning.
Grade/Board: Class 10, CBSE.
Topic: "A Letter to God" by G. L. Fuentes (First Flight).
Objective: Students infer Lencho's character and evaluate the irony at the end of the story.
Constraints:
- One 45-minute period, 40 mixed-ability students, a blackboard only.
- Use this structure: warm-up (5 min), guided analysis (15), pair task (10), formative checkpoint (5), consolidation (5), exit ticket and homework (5).
- Include 2 inference questions and 1 competency-based question.
- Homework in three tiers: support, core, stretch.
- Stay strictly within the NCERT text; do not invent quotations.
Output format: A table with Phase | Time | Teacher does | Students do, followed by the questions with model answers.`, "Template — 45-minute lesson blueprint"),
        tip("Using educator platforms", "MagicSchool, Almanack and TeachBetter.ai have ready-made lesson-plan tools. They save typing, but the same rule applies: add your board, class, text and constraints — and check the output."),
        activity("Plan tomorrow’s lesson", "Adapt the template to a chapter you will teach this week. Then change at least three things so it fits your real students. Save the before-and-after for your capstone."),
      ]),
      lesson("copilot-magicschool", "Faster planning with Copilot, Diffit and MagicSchool", 12, [
        text(`
          ## Pick the right tool for the step

          - **Microsoft Copilot:** useful if your school uses Microsoft 365 — draft a plan and refine it in Word.
          - **MagicSchool:** one-click teacher tools — lesson plans, rubrics, exit tickets, text levelling.
          - **Diffit:** turns a topic, passage or link into levelled readings with vocabulary and questions.

          A quick workflow: **draft** the plan in a chatbot → **level** the reading in Diffit → **check** everything against the textbook → **print** or share.
        `),
        prompt(`Using the lesson plan above, create three versions of the homework task for Class 10: Support (sentence starters and a word bank), Core (the standard task), and Stretch (an extended, evaluative question). Keep the same learning objective for all three.`),
        reflect("Which part of your planning takes the longest each week? How could one of these tools shorten it?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 3 ───────────────────────────────
    mod("m3", "Dynamic comprehension and differentiated reading", [
      lesson("three-tiers", "One passage, three reading levels", 20, [
        scenario("Forty readers, one passage", "In your Class 7 section, some students read fluently, many read slowly, and a few are still building basic decoding in English. The textbook passage is the same for all of them."),
        text(`
          ## Same ideas, different complexity

          Rewrite one passage at three tiers:

          - **Foundational:** shorter sentences, common words, key vocabulary explained.
          - **Grade-level:** close to the original text.
          - **Advanced:** richer vocabulary and longer sentences, perhaps with an extra layer of meaning.

          Every tier must keep **the same key ideas and facts**, so the class can discuss one text together.

          ## Measuring difficulty

          **Hemingway Editor** shows a readability grade and highlights hard sentences — a quick way to check that your tiers really differ.
        `),
        prompt(`Act as an English teacher skilled in differentiated reading for Indian classrooms.
Here is an unseen passage for Class 7 (CBSE/ICSE): [paste a short passage — no students' names].
Rewrite it at three levels:
1. Foundational: about 70% of the length, simple sentences, 5 key words explained in brackets.
2. Grade-level: close to the original.
3. Advanced: richer vocabulary and one added sentence of reflection.
Keep the same key ideas and facts in all three.
For each level, write 3 direct questions and 2 inference-based MCQs with 4 options each, and mark the correct answers.`, "Template — three-tier comprehension"),
        activity("Level a passage with Diffit", "Paste a short passage into Diffit (or use the prompt above). Check each tier against the original: did any fact change? Paste each tier into Hemingway Editor and note the readability grades."),
        warn("Watch for meaning drift", "Simplifying can quietly change meaning or drop a key detail. Read all three tiers before you print."),
        quiz("What must stay the same across the three tiers?", ["The key ideas and facts", "The word count", "The sentence length", "The vocabulary"], "Different paths, same destination."),
      ]),
      lesson("question-design", "Direct, inference and competency-based questions", 15, [
        text(`
          ## Three kinds of questions

          - **Direct (literal):** the answer is stated in the text. *“Where did Lencho live?”*
          - **Inference:** students read between the lines and justify. *“What does Lencho’s reaction tell us about his faith?”*
          - **Competency-based / evaluative:** students apply or judge. *“Do you think the postmaster made the right choice? Give two reasons from the text.”*

          ## Good MCQs

          - One clearly correct answer
          - Plausible distractors based on real misconceptions
          - No “all of the above” shortcuts
          - Options of similar length
        `),
        prompt(`Write 6 MCQs on the passage below for Class 9: 2 direct, 2 inference and 2 evaluative. Each must have exactly one correct answer and three plausible distractors based on common misreadings. After each question, explain why the correct answer is right, and what misreading each distractor reflects.
[paste passage]`),
        activity("Quality-check an AI quiz", "Generate a quiz, then check every item: one correct answer? Answer actually supported by the text? Distractors plausible? Fix or replace at least one item."),
        quiz("“Why do you think the narrator kept the letter a secret?” is a…", ["Inference question", "Direct question", "Grammar question", "Vocabulary question"], "It asks students to read between the lines."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 4 ───────────────────────────────
    mod("m4", "Teaching formal writing (CBSE and ICSE formats)", [
      lesson("formats", "Notices, letters, reports and analytical paragraphs", 20, [
        text(`
          ## The writing tasks you teach

          **CBSE (examples by stage)**
          - Middle school: paragraphs, diary entries, stories, informal letters
          - Class 10: formal letters (complaint, enquiry, order, letter to the editor) and the **analytical paragraph** based on a chart, data or cues
          - Classes 11–12: notices, invitations and replies, formal letters, articles and reports

          **ICSE/ISC**
          - ICSE English Language: compositions (narrative, descriptive, argumentative, picture-based), formal and informal letters, notices and emails, alongside comprehension and grammar
          - ISC: compositions, directed writing and proposals at the senior level

          ## Why AI helps

          Students need **many models** and **lots of feedback**. AI can produce model answers at different levels, checklists for each format, and first-pass feedback against a rubric — in seconds.
        `),
        note("Format conventions vary", "Each board’s marking scheme decides the expected format (for example, word limits or where the date goes). Use the **latest official sample/specimen papers and marking schemes** as your exemplars."),
        prompt(`Persona: Act as a CBSE Class 12 English Core teacher.
Task: Write two model notices for the topic: "Your school is organising a book donation drive." One should be an excellent answer; one should be an average answer with three typical student errors.
Constraints: Follow the format in this exemplar exactly: [paste a notice from the latest CBSE sample paper marking scheme]. Stay within the word limit given in the exemplar.
Output: The two notices, then a table listing each error in the average notice and how to fix it.`, "Template — good vs average model answers"),
        activity("Spot the difference", "Give students the excellent and the average notice side by side. In pairs, they find and correct the three errors before you reveal the table."),
      ]),
      lesson("analytical-paragraph", "The analytical paragraph and data-based writing", 15, [
        text(`
          ## Teaching students to write about data

          An analytical paragraph asks students to **describe, compare and interpret** information such as a bar chart, table or set of cues.

          A simple frame:

          1. **Introduce** what the data shows (topic, time period, source).
          2. **Describe the main trend** with figures.
          3. **Compare** two or three significant points.
          4. **Conclude** with an interpretation or likely reason.

          Useful language: *rose steadily, declined sharply, remained stable, peaked at, in contrast, whereas, accounting for*.
        `),
        prompt(`Create a simple data table for a CBSE Class 10 analytical paragraph task: "Modes of transport used by students of a school to travel to school, 2020 to 2025" (4 modes, 3 years). Then write: 1) the question as it might appear in an exam, 2) a model analytical paragraph within the usual word limit, and 3) a checklist of 6 points students should include. Use realistic figures that add up correctly.`),
        activity("Live data, real writing", "Run a quick class survey (how students travel to school, favourite sport). Put the results on the board as a table and let students write an analytical paragraph about their own data."),
        quiz("What should an analytical paragraph mainly do?", ["Describe, compare and interpret the data", "Tell a story", "Give the writer’s personal diary", "List every number without comment"], "Trends, comparisons and interpretation."),
      ]),
      lesson("writing-feedback", "Rubric-based feedback at scale", 15, [
        text(`
          ## A fair feedback workflow

          1. **Build a rubric** with 4 criteria — content, format, organisation, language accuracy — at 4 levels.
          2. **Remove names** from student work (“Student A”).
          3. **Ask AI for first-pass feedback** against the rubric: two strengths, two specific improvements.
          4. **Review and edit** the feedback. You decide the marks.
          5. **Students act on it:** a short rewrite or a corrected paragraph.

          **LanguageTool** and **Hemingway Editor** help students self-check spelling, grammar and sentence length before submitting.
        `),
        prompt(`Act as an experienced English examiner. Use this rubric to give feedback on the formal letter below: Content (4), Format (4), Organisation (4), Language accuracy (4).
For each criterion: give a level, one strength and one specific improvement with an example from the letter. Do not rewrite the letter. Keep the feedback encouraging and under 150 words.
Letter by Student A: [paste — with no names]`, "Rubric feedback prompt"),
        warn("You are the examiner", "Never let AI decide final marks. Use AI feedback as a draft, check it against the board’s marking scheme, and add your own comments."),
        reflect("How many writing tasks do you currently mark each week? How much time could a rubric-plus-AI workflow save you?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 5 ───────────────────────────────
    mod("m5", "Functional grammar with AI", [
      lesson("icse-grammar", "Prepositions and transformation of sentences (ICSE)", 18, [
        text(`
          ## ICSE functional grammar

          ICSE English Language regularly tests:

          - **Prepositions:** filling blanks with the correct preposition (*on, in, at, since, for, by, with*…)
          - **Joining sentences** without using *and, but, so*
          - **Transformation of sentences (“Do as directed”):** beginning with given words (*Hardly…*, *No sooner…*, *Despite…*), changing voice, degree of comparison, direct and reported speech

          ## Using AI well

          - Ask for **graded sets**: easy → board level.
          - Ask for an **answer key with the rule** behind each answer.
          - Ask for **common errors** students make with each structure.
        `),
        prompt(`Act as an ICSE English Language teacher. Create a worksheet for Class 10 on transformation of sentences.
- 12 items in three graded sets (4 easy, 4 medium, 4 board-level).
- Include: beginning with "Hardly", "No sooner", "Despite", "Unless"; active to passive; degree of comparison; direct to reported speech.
- Each item must keep the original meaning.
Output: The worksheet, then an answer key that gives the transformed sentence and the rule in one line.`, "Template — “Do as directed” worksheet"),
        warn("Check every answer key", "AI answer keys sometimes change the meaning of a sentence or accept two forms where only one is correct. Work through the key yourself before printing."),
        activity("Prepositions in context", "Ask AI for a 150-word paragraph about a train journey in India with 10 prepositions removed. Students fill the gaps, then compare answers with LanguageTool and a dictionary."),
      ]),
      lesson("cbse-grammar", "Integrated grammar: gap-fill, editing and reported speech (CBSE)", 15, [
        text(`
          ## Grammar in context

          CBSE assesses grammar **in context** rather than as isolated rules: tenses, modals, subject–verb agreement, determiners, reported speech, and editing or omission tasks.

          ## An effective AI workflow

          1. Generate a **short, real-life paragraph** with errors or gaps.
          2. Ask for **one error per line** for editing tasks.
          3. Ask for an **explanation** for each answer.
          4. Turn the same paragraph into a **Wayground (Quizizz) quiz** for quick practice.
        `),
        prompt(`Create a CBSE Class 9 editing task: a 10-line paragraph about a school sports day, with one grammatical error in each line (tenses, modals, subject-verb agreement, determiners, prepositions). Then give a table: Line | Error | Correction | Rule. Make sure each line has exactly one error.`),
        activity("From worksheet to game", "Take the editing task and turn it into a 10-question Wayground quiz. Play it live in class and look at the results: which error type did most students miss?"),
        quiz("Why check AI grammar answer keys carefully?", ["AI can change the meaning or accept incorrect forms", "AI never writes grammar questions", "Keys are always too short", "Grammar has no rules"], "Verify each answer yourself."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 6 ───────────────────────────────
    mod("m6", "Literature: Shakespeare and poetry", [
      lesson("shakespeare", "Bringing Shakespeare alive", 20, [
        text(`
          ## Make the language accessible, keep the original

          - **Side-by-side paraphrase:** original lines next to modern English — then students annotate the original.
          - **Hot-seating:** a student plays Brutus or Antony and answers the class’s questions in character.
          - **Modern retellings:** “Rewrite Antony’s speech as a news report” — then compare what is lost.
          - **Character maps and timelines** built in Canva.

          ## Example: *Julius Caesar*, Act III Scene ii

          Compare **Brutus’s** reasoned prose with **Antony’s** emotional verse. Track how the crowd’s mood shifts, line by line.
        `),
        prompt(`Act as an ICSE English Literature teacher. For Julius Caesar, Act III Scene ii, create:
1. A side-by-side table of 8 short extracts from Antony's funeral speech with a modern-English paraphrase (quote only the actual text and give line context).
2. 5 hot-seating questions students could ask "Antony" in character.
3. 3 board-style extract-based questions with model answers.
Do not invent quotations.`, "Template — Shakespeare scene pack"),
        warn("Paraphrase is a bridge, not a destination", "Students must still read, quote and analyse the original text in exams. Never replace the play with a summary."),
        activity("Hot-seat the crowd", "Assign students as Brutus, Antony and three citizens. After the speeches, the class interviews them in character using the AI questions. Finish with a two-line written reflection."),
      ]),
      lesson("poetry", "Poetry analysis that sparks discussion", 15, [
        text(`
          ## Use AI to open discussion, not close it

          Poetry has many valid readings. Use AI to generate:

          - **Guiding questions** on imagery, tone, structure and devices
          - **Contrasting interpretations** for students to debate
          - **Creative responses** — a poem in the same form on a local theme

          *Example:* “Dust of Snow” and “Fire and Ice” by Robert Frost (CBSE Class 10) — what do small moments and big symbols reveal about mood and change?
        `),
        prompt(`For the poem "[poem title]" by [poet] (Class [10], [CBSE/ICSE]), create:
1. 6 guiding questions moving from literal to interpretive (imagery, tone, poetic devices, theme).
2. Two contrasting interpretations of the final stanza, each in 60 words, for students to debate.
3. A short creative task in the same form, set in an Indian context.
Do not quote lines that are not in the poem; ask me to provide the text if needed.`, "Poetry discussion prompt"),
        note("Copyright and fair use", "Prescribed anthologies are copyrighted. Paste **short extracts** for classroom purposes, use school-approved tools, and avoid uploading whole books."),
        activity("Debate the ending", "Give students the two AI interpretations. In groups, they choose one, find evidence in the poem, and defend it in two minutes."),
        quiz("What is the best use of AI in poetry lessons?", ["Generating questions and contrasting readings to start discussion", "Deciding the one correct meaning", "Writing students’ answers", "Replacing the poem with a summary"], "Interpretation belongs to the students."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 7 ───────────────────────────────
    mod("m7", "Speaking and listening (ASL)", [
      lesson("listening", "Listening practice with text-to-speech", 15, [
        text(`
          ## Build listening materials in minutes

          CBSE assesses listening and speaking skills as part of internal assessment, and ICSE/ISC schools assess oral skills too. Students need **regular practice with varied voices and accents**.

          1. Ask AI to write a **listening script** — an announcement, interview or short talk at the right level.
          2. Turn it into audio with **NaturalReader** or **ElevenLabs** text-to-speech.
          3. Write **listening questions**: gist, specific detail, speaker’s attitude.
          4. Play it twice, as in real assessments.
        `),
        prompt(`Write a 2-minute listening script for Class 9 students: a radio interview with a young environmental volunteer from Chennai. Use natural spoken English with two speakers. Then write 5 listening questions (2 gist, 2 detail, 1 attitude) with answers.`),
        warn("Voice tools and consent", "Use the built-in stock voices. **Never clone anyone’s voice** — especially a student’s or colleague’s — without clear consent, and follow your school’s policy."),
        activity("Make one listening task", "Create the script, turn it into audio with a text-to-speech tool, and use it in class this week. Note whether students coped with the pace."),
      ]),
      lesson("speaking", "Speaking tasks and reflective feedback", 15, [
        text(`
          ## Speaking practice that builds confidence

          - **Picture or topic cards** generated by AI for one-minute talks
          - **Role-plays:** a complaint at a shop, a job interview, a school council debate
          - **Structured debates** with roles and timings

          ## Transcripts for reflection

          With permission, record a class debate and transcribe it with **Otter.ai**. Students read their own transcript and spot fillers, repetition and strong phrases.

          ## Assessment stays human

          Use the board’s criteria — such as interaction, fluency, pronunciation, language and content — and **assess students yourself**. AI can help you prepare prompts and rubrics, not award marks.
        `),
        prompt(`Create 10 speaking prompts for Class 11 students for one-minute talks, on topics relevant to Indian teenagers (technology, environment, careers, sport, culture). For each, add 2 follow-up questions an examiner might ask. Then create a simple 4-criterion speaking rubric (content, fluency, language, pronunciation) at 4 levels.`),
        activity("Debate and transcribe", "Run a five-minute class debate. With students’ consent, transcribe it with Otter.ai. Ask each speaker to find one strong sentence and one sentence to improve in their transcript."),
        quiz("Who should award speaking assessment marks?", ["The teacher, using the board’s criteria", "An AI voice tool", "The students’ friends", "Nobody"], "AI prepares; the teacher assesses."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 8 ───────────────────────────────
    mod("m8", "Visual and interactive engagement", [
      lesson("visual", "Canva, Gamma and visual learning", 15, [
        text(`
          ## Visuals that support language

          - **Canva for Education** (free for eligible K-12 teachers): story maps, character profiles, vocabulary posters, infographic templates for report writing. Its Magic Studio tools help draft and design.
          - **Gamma:** turns an outline into a presentation in seconds — useful for a literature unit overview or grammar rules with examples.
          - **TeachBetter.ai:** also generates presentations you can export to PowerPoint or Google Slides.

          ## Students as designers

          Ask students to create a **Canva character profile** for a figure from the play, or a **poster** summarising a chapter’s theme — with quotations from the text.
        `),
        prompt(`Create a slide-by-slide outline (8 slides) for a Class 8 lesson on the difference between formal and informal letters. Each slide: a title, 3 short bullet points and a suggested image. End with a 3-question quick quiz.`, "Outline for Gamma or Canva"),
        activity("Paste and present", "Paste the outline into Gamma or Canva to generate slides. Edit at least two slides to add your own examples, and check that every fact is correct."),
        resource("Canva for Education — eligibility", "https://www.canva.com/education/eligibility-guidelines/", "Who can get Canva for Education for free."),
      ]),
      lesson("interactive", "Interactive quizzes and lessons: Wayground and Curipod", 15, [
        text(`
          ## Instant engagement, instant data

          - **Wayground (formerly Quizizz):** create or generate a quiz from your questions, play it live or set it as homework, and see which questions most students missed.
          - **Curipod:** interactive lessons with polls, word clouds, drawings and open questions — great for opinion-based literature discussion.

          ## Use the data

          After a quiz, look at the **two most-missed questions**. Re-teach them the next day, and use them as a warm-up.
        `),
        prompt(`Create 10 MCQs on the chapter "[chapter title]" (Class [8], [CBSE/ICSE]) for a Wayground quiz: 4 on vocabulary in context, 4 on comprehension, 2 on theme. One correct answer each, plausible distractors, and a one-line explanation for each answer.`),
        activity("Quiz, then re-teach", "Run the quiz live. Next day, start with the two most-missed questions and ask students to explain the right answers to each other."),
        quiz("What is Quizizz called now?", ["Wayground", "Curipod", "Gamma", "Canva"], "Quizizz rebranded as Wayground in 2025."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 9 ───────────────────────────────
    mod("m9", "Academic integrity, plagiarism and AI detection", [
      lesson("detection", "What AI detectors can and can’t tell you", 15, [
        scenario("The 90% essay", "An AI detector flags a Class 11 student’s article as “90% AI-generated”. The student, who writes in English as a second language, insists it is her own work. The parents are upset."),
        text(`
          ## The truth about detectors

          - AI detectors give **probabilities, not proof**.
          - They produce **false positives**, and are known to flag non-native English writers and very formal writing more often.
          - Simple paraphrasing can fool them — so they also miss real AI use.

          ## A fair response

          1. **Talk to the student** calmly about their process.
          2. Ask them to **explain their ideas** or rewrite a paragraph in class.
          3. Look at **drafts, notes and earlier work**.
          4. Decide based on **evidence**, never on a score alone.
        `),
        warn("Never punish on a score alone", "A detector score is not evidence. Use it, at most, as a reason to start a conversation."),
        quiz("What should you do first when a detector flags a student’s essay?", ["Talk with the student about their process and ideas", "Give zero marks", "Report to the principal", "Run more detectors and average the scores"], "Conversation and evidence come first."),
      ]),
      lesson("integrity-design", "Designing AI-resilient tasks and a clear policy", 18, [
        text(`
          ## Design tasks where shortcuts don’t work

          - **Process-based writing:** plan, draft and revise in class; submit all stages.
          - **Personal and local:** connect to students’ own experiences, school or city.
          - **Oral follow-up:** students explain or defend their writing in two minutes.
          - **Reflection:** “What did you change between draft 1 and draft 2, and why?”

          ## Teach responsible use openly

          Use a **traffic-light rule** for each task:

          - **Red:** no AI (tests, personal writing)
          - **Amber:** AI for ideas or feedback only — declared
          - **Green:** AI allowed — students attach their prompts and explain what they changed

          **QuillBot** can be taught openly: compare paraphrases and discuss how word choice shifts meaning and tone. Used secretly, it becomes a plagiarism tool.
        `),
        prompt(`Help me write a one-page AI-use policy for my Class 11 English class (CBSE/ICSE). Include: the traffic-light rule (red, amber, green) with English examples for each, how students should declare AI use, what counts as plagiarism, and what happens if the policy is broken. Use simple, respectful language suitable for students and parents.`, "Classroom AI policy prompt"),
        activity("Redesign one assignment", "Take a homework task that AI could complete easily. Redesign it with drafts in class, a personal angle and a two-minute oral explanation."),
        reflect("Which of your current assignments is most open to AI misuse? How will you change it?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 10 ──────────────────────────────
    mod("m10", "Capstone: your AI-powered English unit", [
      lesson("workflow", "The weekly workflow and prompt bank", 15, [
        text(`
          ## A sustainable weekly routine

          1. **Plan (20 min):** one precision prompt for the week’s lessons; check against the syllabus.
          2. **Differentiate (15 min):** level the main reading into three tiers.
          3. **Practise (15 min):** generate grammar or writing practice with an answer key — and check it.
          4. **Engage (10 min):** build one Wayground or Curipod activity.
          5. **Reflect (5 min):** save the prompts that worked into your personal prompt bank.
        `),
        prompt(`Act as my English teaching assistant. Next week I teach Class [9] ([CBSE/ICSE]) the chapter "[title]" in [5] periods. Give me, in one organised response:
1. A 5-period overview with an objective for each period.
2. One warm-up activity per period.
3. A three-tier homework task for period 3.
4. 5 grammar items linked to the chapter with an answer key.
5. One speaking activity.
Stay within the prescribed text and do not invent quotations.`, "Weekly master prompt"),
        points([
          "Precision prompts: persona, grade/board, topic, objective, constraints — plus exemplars",
          "Verify quotations, grammar and formats every time",
          "Level the text, not the learning goal",
          "AI drafts feedback; you award marks",
          "Paraphrase bridges to Shakespeare — it never replaces him",
          "Detectors are not proof; design for integrity",
        ], "What you’ve learned"),
      ]),
      lesson("capstone", "Capstone brief and rubric", 20, [
        text(`
          ## Your task

          Design a **one-week English unit** (4–6 periods) for one class between 6 and 12, CBSE or ICSE/ISC.

          ### Include
          1. Board-aligned objectives with measurable verbs.
          2. A full **45-minute lesson blueprint** for one period.
          3. A **three-tier reading passage** with direct and inference questions.
          4. A **writing or grammar task** with a rubric and answer key.
          5. A **speaking or listening activity**.
          6. One **interactive activity** (Wayground, Curipod or Canva).
          7. Your **AI-use policy** for the unit and the prompts you used, with notes on what you corrected.

          ## Rubric (each criterion 1–4)

          - **Board alignment and accuracy:** objectives match the syllabus; no factual, quotation or grammar errors.
          - **Engagement and active learning:** students analyse, discuss and create — not just listen.
          - **Differentiation:** accurate tiers and meaningful support and stretch.
          - **Assessment quality:** clear questions, one correct answer per MCQ, fair rubric and marking.
          - **Responsible AI use:** prompts shared, outputs verified, no personal data, clear student rules.

          **A strong unit scores 15 or more out of 20, with no criterion below 2.**
        `),
        tip("Ready for certification", "Finish this lesson, then take the **30-question exam** (50 minutes, 70% to pass) to earn your **AI-Powered English Educator** certificate."),
        activity("Build, teach, reflect", "Complete your unit, teach at least two periods of it, and write a short reflection: what worked, what you changed, and which prompt saved the most time."),
        reflect("Score your draft unit against the rubric. Which criterion will you strengthen first?"),
      ]),
    ]),
  ],
};

export const ENGLISH_COURSE: Course = {
  id: ENGLISH_COURSE_ID,
  programId: ENGLISH_PROGRAM_ID,
  price: 699,
  title: "AI-Powered English Pedagogy: Mastering Generative AI for CBSE & ICSE Classrooms",
  category: "AI Tools for Teachers",
  hours: 10,
  level: "Intermediate",
  blurb: "Precision prompts, board-aligned lessons, levelled reading, writing formats, grammar, Shakespeare, speaking and listening — for CBSE and ICSE English teachers of Classes 6–12.",
  ...content,
};
