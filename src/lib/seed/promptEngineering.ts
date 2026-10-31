import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Premium · Intermediate · 6 hours — advanced prompting for standards-aligned lesson design. */
export const PROMPT_ENGINEERING: Content = {
  instructor: { name: "Dr. Maya Chen", title: "Learning Design Lead" },
  overview: `Go beyond basic prompts. This course teaches structured techniques that produce **reliable, curriculum-aligned** teaching material: few-shot examples, constraints, structured output, prompt chaining and self-critique.

You’ll design a full unit (outcomes, lesson sequence, activities, assessments and rubrics) with AI as your drafting partner, aligned to NCERT learning outcomes and competency-based assessment. You’ll also build a reusable prompt toolkit and, if your tool supports it, a custom assistant set up for your subject.

Assumes you already use an AI assistant for simple tasks (or have completed Generative AI Foundations).`,
  outcomes: [
    "Write structured prompts with role, context, constraints and output format",
    "Use few-shot examples to control quality, tone and difficulty",
    "Align AI output to specific learning outcomes and competencies, and verify the alignment",
    "Chain prompts to build a complete unit: plan → lessons → tasks → assessment",
    "Use self-critique and verification prompts to catch errors",
    "Build a reusable prompt toolkit and a custom subject assistant",
  ],
  modules: [
    mod("m1", "Prompt anatomy", [
      lesson("structured-prompts", "Structured prompts that work every time", 25, [
        text(`
          ## Beyond RTCF: six building blocks

          1. **Role:** who the AI should act as
          2. **Goal:** the learning outcome this serves
          3. **Context:** class, prior knowledge, constraints, language
          4. **Task:** exactly what to produce
          5. **Constraints:** what to include, avoid, and limit (length, vocabulary, number of items)
          6. **Format:** table, numbered list, headings, or a template to fill

          ## Use delimiters

          Separate instructions from material with clear labelled sections, for example:

          - **SOURCE TEXT (use only this):** paste the textbook paragraph
          - **INSTRUCTIONS:** what to produce
          - **OUTPUT FORMAT:** the table or template to fill

          This helps the model stay on task and not confuse your notes with instructions.
        `),
        scenario("A structured prompt", `**Role:** Experienced Class 9 geography teacher (CBSE).
**Goal:** Students explain how the monsoon affects Indian agriculture.
**Context:** 48 students, mixed English proficiency, finished NCERT Contemporary India-I Ch. 4.
**Task:** A 45-minute lesson with one map activity.
**Constraints:** Only facts from the pasted text; no more than 2 new terms; include one question about the student’s own region.
**Format:** Table with Time | Teacher does | Students do | Check for understanding.`),
        quiz(
          "What is the main purpose of using delimiters (like headings or ### markers) in a prompt?",
          ["To clearly separate instructions from source material", "To make the prompt look longer", "To unlock paid features", "To stop the AI from using any examples"],
          "Clear separation reduces confusion and keeps the model grounded in your source.",
        ),
      ]),
      lesson("constraints", "Constraints and negative instructions", 20, [
        text(`
          ## Tell it the boundaries

          Good constraints prevent the most common problems:

          - **Length:** “Each explanation under 40 words.”
          - **Vocabulary:** “Use only words a Class 4 student knows; define any new term.”
          - **Source:** “Use only facts in the text below. If something isn’t there, say ‘not in text’.”
          - **Context:** “Use Indian names, rupees and local examples.”
          - **Inclusion:** “Balance genders and avoid stereotypes about regions or communities.”

          ## Phrase constraints positively when you can

          “Write in simple sentences” usually works better than “Don’t write complex sentences.” Keep negatives for hard limits.
        `),
        tip("Ask for an ‘I don’t know’", "Giving the model permission to say “not in text” or “uncertain” noticeably reduces made-up content."),
        reflect("What are the three constraints you find yourself adding most often? Write them as a reusable ‘house style’ paragraph."),
      ]),
      lesson("structured-output", "Structured output: tables, templates and forms", 20, [
        text(`
          ## Ask for the shape you need

          - **Tables** for lesson plans, question banks and rubrics
          - **Templates**: paste your school’s lesson-plan template and say “fill this exactly”
          - **Lists with fixed fields**: “For each question give: Question / Options A–D / Answer / Explanation / Bloom level”

          ## Ready to paste into Google Forms or a spreadsheet

          Ask for **CSV** (comma-separated) or a strict list format, and you can paste a whole quiz into a spreadsheet or a quiz tool in seconds.
        `),
        quiz(
          "You want to import 20 MCQs into a spreadsheet. Which instruction helps most?",
          ["Return CSV with columns: question, A, B, C, D, answer, explanation", "Make it look nice", "Write the questions as a story", "Use as many emojis as possible"],
          "A strict machine-readable format saves copying time and avoids errors.",
        ),
      ]),
    ]),

    mod("m2", "Controlling quality", [
      lesson("few-shot", "Few-shot prompting", 25, [
        text(`
          ## Show, don’t just tell

          Give the model **one to three examples** of exactly what you want. It will match the format, tone and difficulty far better than instructions alone.

          ## How to choose examples

          - Use your **best real examples**, ones you’d be proud to give students
          - Vary them slightly so the model learns the *pattern*, not one item to copy
          - Label them clearly: “Example 1”, “Example 2”, then “Now write 5 more on [topic]”
        `),
        scenario("Few-shot for exit tickets", `“Here are two exit tickets I like:

Example 1: *A shop sells 3 pens for ₹45. How much do 7 pens cost? Show one way to check your answer.*
Example 2: *Meera says 4/8 is bigger than 1/2 because 4 and 8 are bigger numbers. Is she right? Explain in one sentence.*

Now write 5 more on ratios in the same style: one calculation plus one ‘explain or check’ part, Indian everyday contexts.”`),
        tip("Template", "“Here are two examples of [thing] I like: … Notice that each one [describe the feature]. Now write [n] more on [topic].”"),
        quiz(
          "Few-shot prompting means:",
          ["Including examples of the desired output in the prompt", "Using very short prompts", "Asking only a few questions", "Limiting the AI to a few words"],
          "Examples in the prompt steer the model toward your format, quality and style.",
        ),
      ]),
      lesson("self-critique", "Self-critique and verification prompts", 25, [
        text(`
          ## Make the AI check its own work, then check it yourself

          After a draft, ask follow-up prompts like:

          - “Review these 10 questions. Which could have more than one correct answer?”
          - “Which items test recall rather than application? Rewrite them.”
          - “Solve each maths question step by step and flag any where your answer differs from the key.”
          - “Check this for stereotypes or examples that some students may not relate to.”

          ## Separate generator and reviewer

          Asking for critique in a **fresh conversation** (paste the output and ask for a review) often catches more problems, because the model isn’t defending its earlier answer.
        `),
        warn("Critique isn’t proof", "Self-critique reduces errors but doesn’t eliminate them. A model can confidently approve a wrong answer. Final verification is yours."),
        quiz(
          "What is a good way to catch flawed MCQs that an AI drafted?",
          ["Ask it, ideally in a new chat, to find items with more than one correct answer, then check them yourself", "Ask it “are you sure?” once and trust the reply", "Assume items are correct if they are well formatted", "Count the number of questions"],
          "Targeted critique prompts plus your own review catch the most errors.",
        ),
      ]),
      lesson("roles-personas", "Personas and simulations", 20, [
        text(`
          ## The AI as a simulated student

          “Act as a Class 7 student who thinks heavier objects fall faster. Answer my questions as that student would.” This lets you **rehearse questioning** and predict misconceptions.

          ## The AI as a historical figure or expert

          Useful for a classroom role-play, **with care**: tell students it’s a simulation that may include invented details, and compare it with real sources.

          ## The AI as a critical colleague

          “Act as an experienced head of department reviewing my lesson plan. Give three strengths and three concrete improvements.”
        `),
        note("Be transparent", "If students interact with a persona, explain clearly that it is AI-generated and may be wrong. That is itself a valuable media-literacy lesson."),
        reflect("Which persona would help you most: a confused student, a critical colleague, or an expert? Write the prompt."),
      ]),
    ]),

    mod("m3", "Curriculum alignment", [
      lesson("standards-alignment", "Aligning output to learning outcomes", 25, [
        text(`
          ## Name the outcome precisely

          Paste the **exact wording** of the learning outcome (from NCERT’s learning outcomes document, your State syllabus or board curriculum) and ask the AI to **cite which part** each activity addresses.

          ## Build an alignment check into the prompt

          “For each activity, state: (a) which part of the outcome it addresses, (b) what evidence of learning it produces, (c) the Bloom’s level.” Then check the alignment yourself. Models often over-claim.

          ## Watch the verb

          If the outcome says *analyse* and every task asks students to *list*, the plan is misaligned no matter how well it is formatted.
        `),
        resource("NCERT: textbooks and curriculum resources", "https://ncert.nic.in/textbook.php", "Official textbooks to paste from when grounding prompts"),
        quiz(
          "An outcome says “students compare two forms of government”. The AI’s activities all ask students to define terms. What is the problem?",
          ["The tasks don’t reach the thinking level the outcome requires", "There are too few definitions", "The outcome is wrong", "Nothing; definitions are always enough"],
          "Alignment means tasks demand the same thinking as the outcome’s verb, here comparing.",
        ),
      ]),
      lesson("competency-based", "Competency-based questions with AI", 25, [
        text(`
          ## What boards are asking for

          CBSE and other boards now include a large share of **competency-based questions**: case-based, source-based, data-interpretation and assertion–reason items that test **application in new situations**.

          ## A reliable prompt pattern

          “Write a case-based question set for Class [x] [subject] on [concept].

          - Case: 80–120 words, a realistic situation in India, new to students
          - 4 questions: 2 MCQs testing application, 1 assertion–reason, 1 short answer requiring explanation
          - Each MCQ: distractors based on common misconceptions; state the misconception for each
          - Answer key with explanations”
        `),
        tip("Use real data", "Paste a real table (rainfall, prices, census figures from an official source) and ask for questions on it. Real data avoids invented statistics."),
        quiz(
          "What makes a question competency-based rather than recall-based?",
          ["Students apply a concept to an unfamiliar, realistic situation", "It is longer", "It uses difficult vocabulary", "It appears at the end of the chapter"],
          "Competency-based items assess transfer and application, not memorised text.",
        ),
      ]),
      lesson("bias-inclusion", "Inclusive, culturally relevant output", 20, [
        text(`
          ## Defaults are not neutral

          Models are trained largely on Western, English-language text. Without guidance you get dollars, snow, Thanksgiving and stereotypes.

          ## Ask for inclusion explicitly

          - “Use names and contexts from different Indian regions and communities.”
          - “Balance genders across roles; avoid stereotypes (e.g. only boys in science).”
          - “Include rural and urban examples.”
          - “Use simple language suitable for second-language learners.”

          Then **read it** through the eyes of your most marginalised student.
        `),
        reflect("Look at the last AI output you used in class. Whose experiences did it reflect, and whose were missing?"),
      ]),
    ]),

    mod("m4", "Chaining a full unit", [
      lesson("prompt-chaining", "Prompt chaining: from unit plan to assessment", 30, [
        text(`
          ## Break big jobs into linked steps

          A single prompt for a whole unit gives shallow results. Chain them instead, feeding each output into the next:

          1. **Unit map:** outcomes, key concepts, common misconceptions, number of lessons
          2. **Lesson sequence:** one line per lesson with its objective (check the progression!)
          3. **Lesson plans:** one at a time, each referencing the unit map
          4. **Practice tasks:** differentiated, for each lesson
          5. **Assessment:** an end-of-unit task and rubric aligned to the outcomes in step 1
          6. **Review:** “Check this unit for gaps between outcomes and assessment.”

          ## Keep a ‘unit brief’

          Paste the same short unit brief (class, outcomes, constraints) at the top of each step, or keep the whole chain in one project or conversation.
        `),
        tip("Approve each link", "Fix problems at step 2 before generating step 3. Errors compound down a chain."),
        quiz(
          "Why is prompt chaining better than one giant prompt for a whole unit?",
          ["Each step can be checked and refined before building on it", "It uses fewer words overall", "AI cannot read long prompts", "It avoids the need for teacher review"],
          "Chaining gives you control points where you can correct the direction.",
        ),
      ]),
      lesson("unit-workshop", "Workshop: design a unit with AI", 45, [
        text(`
          ## Your task

          Choose a unit you will teach in the next month and run the six-step chain from the last lesson.

          ## Deliverables

          - Unit map with outcomes and misconceptions
          - Lesson sequence (4–8 lessons)
          - Two complete lesson plans
          - One differentiated practice task
          - One competency-based assessment with answer key
          - One analytic rubric

          ## Quality check before you finish

          - Every outcome is assessed somewhere
          - Every task matches the thinking level of its outcome
          - Facts and answers verified against the textbook
          - Examples are local and inclusive
          - Nothing contains student personal data
        `),
        reflect("Paste your unit map here. What did you change most from the AI’s first draft, and why?"),
      ]),
    ]),

    mod("m5", "Your prompt toolkit", [
      lesson("prompt-templates", "Reusable templates and a prompt library", 20, [
        text(`
          ## Turn good prompts into templates

          Replace the specific parts with **[placeholders]**: [class], [topic], [outcome], [number], [language]. Store them in a shared document organised by task:

          - Planning: unit map, lesson plan, hook ideas
          - Practice: question bank, case-based set, differentiated worksheet
          - Assessment: rubric, answer key review, feedback comments
          - Communication: parent message, notice, translation

          ## Share across your department

          A shared library means everyone benefits from the best version, and your school builds consistent quality.
        `),
        reflect("List the five templates you will add to your library first."),
      ]),
      lesson("custom-assistants", "Custom assistants and projects", 25, [
        text(`
          ## Save your setup once

          Most major tools let you save standing instructions and files:

          - **ChatGPT:** custom instructions, Projects and custom GPTs
          - **Gemini:** Gems
          - **Claude:** Projects with project knowledge and instructions
          - **Copilot:** agents in Microsoft 365 (depending on your licence)

          Features and names change often, so check your tool’s help pages.

          ## What to put in a subject assistant

          - Your **house style**: class level, Indian context, language, inclusion rules
          - Your **formats**: lesson-plan template, rubric template
          - Your **source material**: syllabus outcomes and chapter notes (never student data)
          - **Quality rules**: “Flag uncertain facts. Use only provided sources when asked.”
        `),
        warn("Files you upload", "Only upload documents you are allowed to share: your own notes and public curriculum documents. Never student records."),
        points([
          "Structure prompts: role, goal, context, task, constraints, format",
          "Use examples (few-shot) to control quality",
          "Ground output in real curriculum text and verify alignment",
          "Chain prompts for big jobs and check every link",
          "Save what works as templates and custom assistants",
        ], "Course summary"),
        quiz(
          "What belongs in the standing instructions of a custom subject assistant?",
          ["Your class level, house style, formats and quality rules", "Your students’ names and marks", "Your school login password", "Nothing; instructions don’t help"],
          "Standing instructions encode your teaching context and quality rules, never personal data or credentials.",
        ),
      ]),
    ]),
  ],
};
