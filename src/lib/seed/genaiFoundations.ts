import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Free · Beginner · 4 hours — practical, planning-focused introduction to generative AI. */
export const GENAI_FOUNDATIONS: Content = {
  instructor: { name: "Dr. Maya Chen", title: "Learning Design Lead" },
  overview: `Generative AI can draft, adapt and explain in seconds, but only a teacher knows what a class actually needs. This course shows you how to use AI assistants as a **planning partner**, not a replacement.

You’ll learn how these tools work and why they make mistakes, how to write prompts that produce classroom-ready material, and how to build AI into your weekly planning for lesson plans, worksheets, question banks, parent messages and work in Indian languages. Throughout, we follow India’s privacy rules and your school’s policy.

No technical background needed. Every lesson ends with something you can use in class the next day.`,
  outcomes: [
    "Explain in plain words how generative AI produces text and why it makes mistakes",
    "Write prompts using Role–Task–Context–Format that give usable classroom material",
    "Draft a lesson plan, worksheet and question bank aligned to your NCERT/State chapter",
    "Adapt one resource for three readiness levels and for Hindi or regional-language learners",
    "Fact-check AI output with a quick five-point routine",
    "Apply a privacy checklist that keeps student data safe under India’s DPDP Act",
  ],
  modules: [
    mod("m1", "Understanding generative AI", [
      lesson("what-is-genai", "What generative AI actually does", 15, [
        text(`
          ## A very well-read prediction machine

          Tools like ChatGPT, Gemini, Claude and Copilot are built on **large language models (LLMs)**. During training, a model reads a huge amount of text: books, websites, code and textbooks. From that it learns patterns: which words, ideas and structures tend to follow each other.

          When you type a question, the model doesn’t search a database for the answer. It **predicts the next most likely piece of text**, one small chunk (a *token*) at a time, until the reply is complete.

          ## Why this matters for teachers

          - It is **fluent**, because it has seen millions of well-written explanations.
          - It is **flexible**: the same tool can write a story, a quiz or a parent letter.
          - It can be **confidently wrong**. When the patterns are thin (a local fact, a recent event, a page number in your textbook), it still produces something that *sounds* right.
        `),
        note("Vocabulary", `A **hallucination** is fluent output that is factually false, such as an invented quotation, a wrong date or a book that doesn’t exist. Treat every AI answer as a **first draft** that needs your expert review.`),
        text(`
          ## More than text

          Generative AI now also creates **images** (diagrams, illustrations), **audio** (read-aloud, translation) and **slides**. The same rule applies to all of them: fast drafts, human checking.
        `),
        points([
          "AI predicts plausible text; it doesn’t “know” or look up facts by default",
          "Fluency is not accuracy, so always verify names, numbers and dates",
          "Your subject knowledge is what turns AI output into good teaching",
        ]),
        quiz(
          "An AI tool gives a wrong date in a Class 8 history worksheet. What is the best explanation?",
          ["It generated plausible-sounding text without verifying the fact", "The tool has been hacked", "Someone edited its database that morning", "History questions are not supported by AI"],
          "Language models generate likely text, not checked facts, so dates, names and figures always need a quick check.",
        ),
      ]),
      lesson("strengths-limits", "Where AI helps, and where it doesn’t", 15, [
        text(`
          ## Great at

          - First drafts of explanations, examples, stories and analogies
          - Generating **many** practice questions quickly, at different difficulty levels
          - Rewriting text at a simpler reading level, or translating it
          - Brainstorming hooks, activities, project ideas and discussion questions
          - Turning your rough notes into a neat format (tables, checklists, letters)

          ## Weak at

          - Knowing **your** students, school context or exact syllabus page
          - Reliable facts, citations, statistics and current events
          - Judging what is developmentally appropriate or culturally sensitive
          - Maths with many steps (it can slip, so check working)
          - Telling you when it doesn’t know
        `),
        scenario("Two teachers, one tool", `Ms. Kavita asks an AI to “make a lesson on fractions” and gets something generic and American (dollars, pizza slices, “5th grade”).

Mr. Rahul asks for “a 15-minute Class 4 warm-up on equivalent fractions using roti and laddoo examples, in simple English, ending with a 3-question exit ticket” and uses it almost unchanged.

Same tool. The difference was the **context** each teacher gave.`),
        tip("Rule of thumb", `Use AI for **volume and variety**; keep **judgement and relationships** for yourself.`),
        reflect("List two planning tasks that take you the most time each week. Which parts could an AI draft for you, and which parts must stay with you?"),
      ]),
      lesson("choosing-tools", "Choosing a tool for school work", 15, [
        text(`
          ## The main general-purpose assistants

          - **ChatGPT** (OpenAI): popular and versatile, with a free tier and paid plans
          - **Gemini** (Google): works closely with Google Docs, Slides and Classroom
          - **Claude** (Anthropic): strong at long documents and careful writing
          - **Microsoft Copilot**: built into Edge, Windows and Microsoft 365

          All four have **free versions** that are enough for this course. Paid plans add higher limits, file uploads and newer models.

          ## What to check before you rely on one

          1. Is it **allowed or provided** by your school?
          2. Does it work well in the **languages** your class uses? Test a Hindi or regional-language prompt.
          3. Can you turn off chat history or **training on your data**? Look in its settings.
          4. Does it work on the **device and internet** you actually have?
        `),
        note("Prices change", "Plans and prices change every few months. Check each tool’s official pricing page before paying. The free course “Introduction to AI for Class Teachers” compares them in detail."),
        quiz(
          "Your school uses Google Workspace for all class documents. Which assistant will probably fit your workflow most smoothly?",
          ["Gemini", "A tool your school hasn’t reviewed", "Whichever has the most adverts", "Any tool, because integrations never matter"],
          "Gemini is built into Google Docs, Slides and Classroom, so drafts land where you already work. Still check your school’s policy first.",
        ),
      ]),
    ]),

    mod("m2", "Prompting basics", [
      lesson("rtcf", "The RTCF formula for strong prompts", 20, [
        text(`
          ## Four parts of a good prompt

          1. **Role**: “Act as an experienced Class 6 science teacher in a CBSE school.”
          2. **Task**: “Create a 10-question exit ticket on photosynthesis.”
          3. **Context**: “Most students are first-generation English learners; keep sentences short. We have finished NCERT Chapter 7.”
          4. **Format**: “Return a table with columns: question, answer, difficulty (easy/medium/hard).”

          You don’t need all four every time, but **context and format** make the biggest difference.
        `),
        scenario("Weak vs strong", `**Weak:** “Questions on the water cycle.”

**Strong:** “You are a Class 5 EVS teacher. Write 8 questions on the water cycle for a class of 45 students, many of whom read below grade level. Mix 4 MCQs, 2 fill-in-the-blanks and 2 ‘explain why’ questions that use everyday examples from Indian villages and cities (drying clothes, monsoon, a matka). Give answers separately at the end.”`),
        tip("Give it your material", "Paste a paragraph from the textbook or your own notes and say “use only this text”. Grounding the AI in your source sharply reduces errors."),
        quiz(
          "Which prompt is most likely to give a usable result?",
          [
            "As a Class 6 science teacher, write 10 exit-ticket questions on photosynthesis for English learners, as a table with answers",
            "Make a quiz",
            "Create a quiz about science for kids",
            "Give me questions please",
          ],
          "It includes role, task, context and format, the four parts of a strong prompt.",
        ),
      ]),
      lesson("iterate", "Iterate instead of starting over", 15, [
        text(`
          ## Treat it like a conversation

          The first answer is rarely the final one. Reply with **specific feedback**:

          - “Make questions 3–5 harder; they should require explaining, not recalling.”
          - “Replace the US examples with Indian ones.”
          - “Shorten each explanation to two sentences.”
          - “Add a Hindi translation under each question.”

          ## Useful follow-up moves

          - **Ask for options:** “Give me three different hooks for this lesson.”
          - **Ask it to critique itself:** “Which of these questions might confuse a Class 4 student, and why?”
          - **Ask for the format change only:** “Same content, but as a printable half-page worksheet.”
        `),
        tip("Save your winners", "When a prompt works well, copy it into a document called “My prompt library”. Next term you only change the chapter name."),
        reflect("Write the first version of a prompt you’ll actually use this week. Then write two follow-up instructions you expect to need."),
      ]),
      lesson("prompt-library", "Practice: build your starter prompt library", 25, [
        text(`
          ## Five prompts every teacher can reuse

          Copy these, replace the parts in [brackets], and test each one with your current chapter.

          1. **Lesson plan:** “Act as an experienced [class/subject] teacher. Create a [40]-minute lesson plan on [topic] from [NCERT chapter]. Include a 5-minute hook, explicit teaching, guided practice in pairs, independent practice and a 3-question exit ticket. Students: [describe class].”
          2. **Question bank:** “Write [15] questions on [topic]: 5 easy recall, 5 application, 5 higher-order. Include answers and the most common wrong answer for each.”
          3. **Simplify:** “Rewrite this paragraph for a student reading at Class [3] level. Keep all key facts. [paste text]”
          4. **Explain differently:** “Give three different everyday Indian analogies to explain [concept] to Class [7].”
          5. **Parent message:** “Draft a warm, short WhatsApp message to parents about [event/request] in English and [Hindi]. Under 80 words.”
        `),
        warn("Check before you share", "Every output goes through you before students or parents see it: facts, tone, level and cultural fit."),
        reflect("Which of the five prompts saved you the most time when you tested it? What did you change in the output before using it?"),
      ]),
    ]),

    mod("m3", "AI in your weekly planning", [
      lesson("lesson-plans", "Drafting lesson plans aligned to your syllabus", 20, [
        text(`
          ## Start from the learning outcome, not the activity

          NCERT and most State boards publish **learning outcomes** for every class and subject. Paste the outcome into your prompt:

          “The learning outcome is: *‘Students classify materials as conductors and insulators.’* Plan a 40-minute Class 6 lesson that ends with students able to do this. We have one set of batteries, bulbs and wires for the whole class.”

          ## Make it realistic

          Tell the AI about your real constraints:

          - Class size (40? 60?) and seating
          - Materials and devices available
          - Periods per week and time already spent
          - Languages students are comfortable in
        `),
        tip("Ask for the ‘why’", "Add “For each step, give one line on why it helps learning.” It helps you judge the plan and adjust it confidently."),
        scenario("A realistic plan", `Ms. Fatima teaches Class 7 science to 52 students with no lab. She asks for a plan on acids and bases “using only kitchen items students can bring: haldi, lemon, soap, baking soda”. The AI suggests a turmeric-indicator demonstration with group observation sheets, which works well in her room.`),
        quiz(
          "What should you paste into a prompt to keep a lesson plan aligned to your curriculum?",
          ["The official learning outcome and chapter details", "Your students’ full names and marks", "Nothing, because AI knows every syllabus perfectly", "Only the word “CBSE”"],
          "The learning outcome anchors the plan. Never paste student names or marks.",
        ),
      ]),
      lesson("worksheets", "Worksheets, question banks and answer keys", 20, [
        text(`
          ## A quick, reliable workflow

          1. Paste the textbook section or your notes.
          2. Ask for questions **at three levels**: recall, application, reasoning.
          3. Ask for an **answer key with short explanations**.
          4. Ask: “Which answers could be disputed or have more than one correct option?”
          5. Solve the hard ones yourself before printing.

          ## Competency-based questions

          Boards such as CBSE now include many **competency-based questions** that test application of a concept to a new situation. AI is very good at drafting these when you ask:

          “Write 3 case-based questions on [topic]. Each starts with a short real-life situation from India (4–5 lines), followed by 3 questions that require applying the concept, not recalling definitions.”
        `),
        warn("Maths and science answers", "AI can make arithmetic slips and mix up units. Work through every numerical answer yourself before printing the key."),
        quiz(
          "After AI drafts a 20-question worksheet with answers, what is the most important next step?",
          ["Solve or check the answers yourself, especially numerical ones", "Print it immediately", "Ask the AI if it is sure and accept its word", "Delete the answer key"],
          "AI cannot be its own fact-checker. You stay responsible for correctness.",
        ),
      ]),
      lesson("differentiate", "Differentiating one resource three ways", 20, [
        text(`
          ## Same goal, different support

          Give the AI one text or task and ask for **three versions with the same learning goal**:

          - **Support:** shorter sentences, key words in bold, a word bank, a worked example
          - **Core:** the grade-level version
          - **Stretch:** an extra “why” or “what if” question, less scaffolding

          Prompt: “Here is a passage on the Mughal empire for Class 7. Create three versions for different reading levels. Keep the same five key facts in all versions. Add two comprehension questions to each.”
        `),
        tip("Avoid labels", "Print versions on the same coloured paper and call them A, B and C, not ‘easy’ and ‘hard’. Students should never feel sorted."),
        reflect("Think of two students in your class who need different support. What would each one need in their version of tomorrow’s task?"),
      ]),
      lesson("languages-parents", "Indian languages and parent communication", 15, [
        text(`
          ## Bilingual support

          NEP 2020 encourages teaching in the mother tongue or home language where possible, especially in the early years. AI can help you:

          - Produce a **bilingual glossary** (English + Hindi/Marathi/Tamil…) for a chapter
          - Translate instructions so parents can help at home
          - Explain a concept first in the home language, then in English

          ## Check translations with a person

          Translation quality varies by language and topic. Technical terms (photosynthesis, denominator) are often translated oddly. Ask a colleague who speaks the language to check before printing.
        `),
        scenario("PTM reminder", `Mr. Arjun asks: “Write a polite reminder for a Parent–Teacher Meeting on Saturday 10am, in English and Kannada, under 60 words, warm tone, mention they can bring younger children.” He checks the Kannada with the school clerk and sends it in the class WhatsApp group.`),
        quiz(
          "AI translates a science worksheet into Odia. What is the best next step?",
          ["Have a fluent Odia speaker check key terms before using it", "Use it as is, since AI translation is perfect", "Never use translated material", "Translate it back to English and assume it is right"],
          "Translation is a great first draft, but technical vocabulary needs a human check.",
        ),
      ]),
    ]),

    mod("m4", "Using AI responsibly", [
      lesson("verify", "A five-point fact-check routine", 15, [
        text(`
          ## Before anything reaches students, check:

          1. **Facts:** names, dates, numbers and definitions against the textbook
          2. **Level:** is the vocabulary right for this class?
          3. **Bias:** are examples fair to girls and boys, all regions, castes, religions and abilities?
          4. **Context:** is it Indian and local where it should be (₹, monsoon, cricket, not dollars and snow days)?
          5. **Purpose:** does it actually serve today’s learning outcome?
        `),
        warn("Invented sources", "If AI gives you a reference, a quotation or a statistic, assume it may be invented until you find it in an original source."),
        points(["Check facts against the textbook", "Check level and tone", "Check for bias and stereotypes", "Localise examples", "Keep it tied to the learning outcome"], "The 5-point check"),
      ]),
      lesson("privacy", "Protecting student privacy", 20, [
        text(`
          ## India’s data protection law

          The **Digital Personal Data Protection (DPDP) Act, 2023**, with its Rules notified in November 2025, treats everyone under 18 as a child. It sets strict conditions on processing children’s personal data, including verifiable parental consent in many cases. Schools have limited exemptions for their own educational activities, but **pasting student data into a public AI tool is not one of them**.

          ## Never paste into an AI tool

          - Student names, roll numbers, Aadhaar, phone numbers or photos
          - Marks or remarks linked to an identifiable child
          - Health, disability, family or caste information
          - Anything your school policy classifies as confidential

          ## Safe habit: de-identify first

          Instead of “Riya Sharma, 7B, scored 12/40 and has dyslexia”, write “A Class 7 student who finds reading difficult scored 30% on fractions.” You get the same help without sharing anyone’s data.
        `),
        quiz(
          "Which request is safe to put into a public AI assistant?",
          [
            "Suggest activities for a Class 5 student who struggles with multiplication facts",
            "Here are my class’s names and marks; write report-card remarks for each",
            "Here is a photo of a student’s Aadhaar card; fill in this form",
            "Summarise this counselling note about a student’s family situation",
          ],
          "Describe the learning need without identifying the child. Names, marks, IDs and sensitive personal details must never be pasted.",
        ),
        resource("MeitY: Data protection framework", "https://www.meity.gov.in/data-protection-framework", "Official page for the DPDP Act and Rules"),
      ]),
      lesson("students-and-ai", "When students use AI", 15, [
        text(`
          ## Teach it, don’t just ban it

          Students are already using AI tools at home. UNESCO’s guidance recommends **age-appropriate, teacher-guided** use, with a strong focus on critical thinking. A simple classroom approach:

          - **Show** how AI can be wrong. Ask it a question about your town and check the answer together.
          - **Model** good use: brainstorming, explaining a concept differently, checking your own answer.
          - **Be clear** for each task: AI not allowed, allowed for ideas only, or allowed with acknowledgement.
          - **Value process:** ask for drafts, rough work and short oral explanations.
        `),
        note("Age limits", "Most AI assistants set a minimum age (often 13, or 18 without parental permission). Check the terms before asking younger students to use any tool directly; you can always demonstrate it from your own screen."),
        resource("UNESCO: AI competency framework for teachers", "https://www.unesco.org/en/articles/ai-competency-framework-teachers", "15 competencies across ethics, pedagogy and professional learning"),
      ]),
      lesson("action-plan", "Your personal AI action plan", 20, [
        text(`
          ## Start small and keep going

          1. Pick **one** recurring task (for example, weekly worksheets).
          2. Use your saved prompt for it for **four weeks**.
          3. Track the time saved, and what you still had to fix.
          4. Share one good prompt with a colleague.
          5. Add a second task only when the first is routine.
        `),
        points([
          "AI drafts; you decide",
          "Context and format make prompts work",
          "Check facts, level, bias, context and purpose",
          "Never share identifiable student data",
          "Start with one task and build the habit",
        ], "Course summary"),
        reflect("Write your plan: which task you’ll start with, which tool, and how you will check the output before it reaches students."),
        quiz(
          "What is the best way to start using AI in your teaching?",
          ["Pick one recurring task and build a habit with a saved prompt", "Use AI for every task from day one", "Wait until the tools are perfect", "Let students run all AI use for you"],
          "Small, repeated wins build confident, responsible practice.",
        ),
      ]),
    ]),
  ],
};
