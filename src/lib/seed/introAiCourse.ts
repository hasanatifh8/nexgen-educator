import type { Block, Course, ExamQuestion, Lesson, Module, Program } from "../catalog";

/**
 * Free flagship course: “Introduction to AI for Class Teachers”.
 * Self-contained (type-only imports) so it can also be inserted into an existing catalog file.
 * Plan prices are approximate and dated — they change often, so lessons always point to official pages.
 */

type B = Block extends infer X ? (X extends Block ? Omit<X, "id"> : never) : never;
const lesson = (id: string, title: string, minutes: number, blocks: B[]): Lesson => ({
  id,
  title,
  minutes,
  blocks: blocks.map((b, i) => ({ ...b, id: `${id}-${i + 1}` }) as Block),
});
const mod = (id: string, title: string, lessons: Lesson[]): Module => ({ id, title, lessons });
const text = (body: string): B => ({ type: "text", body });
const tip = (title: string, body: string): B => ({ type: "callout", tone: "tip", title, body });
const note = (title: string, body: string): B => ({ type: "callout", tone: "note", title, body });
const warn = (title: string, body: string): B => ({ type: "callout", tone: "warning", title, body });
const points = (items: string[], title = "Key takeaways"): B => ({ type: "keyPoints", title, items });
const scenario = (title: string, body: string): B => ({ type: "scenario", title, body });
const quiz = (question: string, options: string[], answer: number, explanation: string): B => ({ type: "quiz", question, options, answer, explanation });
const reflect = (prompt: string): B => ({ type: "reflection", prompt });

export const INTRO_AI_PROGRAM_ID = "intro-ai-class-teachers";
export const INTRO_AI_COURSE_ID = "introduction-to-ai-for-class-teachers";

let examIndex = 0;
/** Rotates the options so correct answers spread evenly across A–D (no “always pick B” pattern). */
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string, scenario?: string): ExamQuestion => {
  const target = [2, 0, 3, 1][examIndex++ % 4] % options.length;
  const shift = (answer - target + options.length) % options.length;
  const rotated = options.map((_, i) => options[(i + shift) % options.length]);
  return { id, prompt, options: rotated, answer: target, explanation, ...(scenario ? { scenario } : {}) };
};

export const INTRO_AI_PROGRAM: Program = {
  id: INTRO_AI_PROGRAM_ID,
  title: "Introduction to AI for Class Teachers",
  category: "AI Tools for Teachers",
  level: "Beginner",
  price: 0,
  description: "A friendly, practical start with AI: what it is, the main tools (ChatGPT, Claude, Gemini, Copilot), free vs paid plans, and safe classroom use.",
  exam: {
    minutes: 45,
    passPercent: 70,
    questions: [
      q("ia01", "What does “generative AI” do?", ["Only searches the internet for existing pages", "Creates new content such as text or images based on patterns it learned", "Stores your school’s files safely", "Checks spelling only"], 1,
        "Generative AI produces new text, images or audio by using patterns learned from huge amounts of examples."),
      q("ia02", "How do chatbots like ChatGPT, Claude and Gemini mainly produce their answers?", ["They look up each answer in a verified encyclopedia", "A human expert types every reply", "They predict the most likely next words based on patterns in their training", "They copy the first search result"], 2,
        "Language models write by predicting likely next words. That makes them fluent — but not always correct."),
      q("ia03", "An AI tool gives a confident answer that turns out to be false. This is called a…", ["Hallucination", "Firewall", "Download error", "Plug-in"], 0,
        "A hallucination is fluent, confident output that is wrong. Always check facts, names, dates and numbers."),
      q("ia04", "Which company makes Claude?", ["Google", "OpenAI", "Microsoft", "Anthropic"], 3, "Claude is made by Anthropic."),
      q("ia05", "Which company makes Gemini?", ["Google", "Anthropic", "OpenAI", "Meta"], 0, "Gemini is Google’s AI assistant and works with Google apps like Docs and Gmail."),
      q("ia06", "Which company makes ChatGPT?", ["Microsoft", "OpenAI", "Google", "Anthropic"], 1, "ChatGPT is made by OpenAI."),
      q("ia07", "You want AI help directly inside Word and PowerPoint. Which assistant is designed for that?", ["Claude", "Microsoft Copilot", "Gemini", "None of them can"], 1,
        "Copilot is Microsoft’s assistant. The free version works on the web and app; Copilot inside Office apps comes with Microsoft 365 subscriptions."),
      q("ia08", "Which statement about free AI plans is generally true?", ["Free plans have no limits at all", "Free plans cannot write in Indian languages", "Free plans have usage limits and fewer advanced features than paid plans", "Free plans are only for students"], 2,
        "Free plans are very capable for everyday teaching tasks, but they limit how much you can use them and some advanced features."),
      q("ia09", "What is the smartest first step before buying a paid AI plan?", ["Buy the most expensive plan to be safe", "Use the free versions for your real tasks for a few weeks and see where you hit limits", "Ask students which plan to buy", "Pay for every tool at once"], 1,
        "Try the free plans with your actual work first. Pay only if you regularly hit limits or need a specific feature."),
      q("ia10", "Which prompt will most likely give a useful worksheet?", ["Make a worksheet", "Science questions please", "Act as a Class 6 science teacher. Create 10 questions on the water cycle for mixed-ability students, with an answer key, in simple English", "Give me something for class"], 2,
        "A strong prompt includes a role, the task, the context (class, topic, students) and the format you want."),
      q("ia11", "The AI’s first answer is close but too difficult for your class. What should you do?", ["Give up and write it yourself", "Reply with a specific follow-up, e.g. “Make it simpler for Class 4 and shorten each question”", "Start a new chat and paste the same prompt", "Accept it as it is"], 1,
        "Treat AI like a conversation. Specific follow-ups improve the result quickly."),
      q("ia12", "Before pasting a student’s essay into an AI tool, you should…", ["Add the student’s full name so the feedback is personal", "Remove names and any personal details, and follow your school’s policy", "Include the student’s marks and address", "Post it publicly first"], 1,
        "Protect student privacy: de-identify work and follow your school’s data rules (in India, the DPDP Act 2023 also applies)."),
      q("ia13", "An AI tool created a worksheet for you. Before giving it to students, you should…", ["Print it immediately — AI is always right", "Check the facts, the difficulty level and whether it suits your students", "Ask the AI if it is correct and trust its reply", "Remove your name from it"], 1,
        "You are responsible for anything you hand out. Review accuracy, level and suitability every time."),
      q("ia14", "Which is a good way to use AI for differentiation?", ["Give weaker students easier learning goals", "Ask AI to rewrite the same passage at three reading levels, then review them", "Let AI choose which students are “slow”", "Use AI to replace group work"], 1,
        "Same learning goal, different paths: levelled versions of one text help every learner access the content."),
      q("ia15", "You use AI to translate a note to parents into Hindi. What is the best practice?", ["Send it without reading", "Use the AI draft, then have it checked by you or a fluent speaker before sending", "Never translate parent messages", "Ask students to translate it instead"], 1,
        "AI translations are a great first draft, but tone and meaning should be checked before sending to families."),
      q("ia16", "An AI tool keeps describing doctors as men and nurses as women in stories for your class. What should you do?", ["Nothing — it is only a story", "Notice the bias, ask for diverse examples, and edit before using", "Stop teaching stories", "Tell students AI is never biased"], 1,
        "AI can repeat stereotypes from its training data. Spot it, correct it, and use it as a teaching moment."),
      q("ia17", "A student’s homework looks like it was written by AI. What is the best first step?", ["Give zero marks immediately", "Run it through an AI detector and trust the score", "Have a calm conversation asking the student to explain their ideas and process", "Ban phones in the school"], 2,
        "A conversation about the process shows real understanding and keeps trust. Detectors alone are not reliable evidence."),
      q("ia18", "What is true about AI-writing detectors?", ["They are 100% accurate", "They can wrongly flag genuine student work, especially from language learners", "They are required by CBSE", "They improve student writing"], 1,
        "Detectors produce false positives. Never use a detector score as the only evidence."),
      q("ia19", "Before asking students to use an AI tool in class, you should…", ["Check the tool’s minimum age, your school’s policy and parents’ consent where needed", "Ask students to create accounts with fake ages", "Share your own login with the class", "Nothing special"], 0,
        "Each tool has its own age rules in its terms. Follow them and your school’s policy."),
      q("ia20", "Which is a great time-saving use of AI for a teacher?", ["Letting AI decide final report-card grades", "Drafting a question bank from a chapter, which you then review and edit", "Sending AI-written messages to parents without reading them", "Asking AI to take attendance"], 1,
        "Let AI do the first draft; you keep the judgment."),
      q("ia21", "Why might an AI chatbot give outdated information about a new curriculum change?", ["AI always knows today’s news", "Its training data stops at a certain date unless it searches the web", "Curriculum documents are secret", "Chatbots only know about mathematics"], 1,
        "Models have a knowledge cut-off. For recent facts, use a tool that searches the web and still check official sources."),
      q("ia22", "Which decision should always stay with the teacher?", ["Choosing a font for a worksheet", "Final judgments about grades and students’ wellbeing", "Drafting a lesson hook", "Making a list of vocabulary words"], 1,
        "AI can assist, but decisions that affect students’ grades and wellbeing need human judgment."),
      q("ia23", "Why should you tell the AI the class, subject and students’ level in your prompt?", ["It makes the answer longer", "It gives context, so the output fits your students better", "AI tools require it to work", "It is needed to log in"], 1,
        "Context is the secret ingredient of a good prompt. The more relevant detail, the more useful the result."),
      q("ia24", "What can you usually do in an AI tool’s privacy or data settings?", ["Nothing — there are no settings", "See students’ private messages", "Delete chat history and choose whether your chats are used to improve the AI", "Get a refund automatically"], 2,
        "Most tools let you manage history and model-training preferences. Check them when you first sign up."),
      q("ia25", "“Human in the loop” means…", ["AI makes all decisions without people", "A teacher reviews, edits and decides — AI only assists", "Students must use AI for every task", "Only IT staff can use AI"], 1,
        "Keep a human — you — reviewing and deciding. That is the golden rule of AI in education."),
    ],
  },
};

const content: Pick<Course, "overview" | "outcomes" | "instructor" | "modules"> = {
  instructor: { name: "Dr. Maya Chen", title: "Learning Design Lead" },
  overview:
    "New to AI? This course is for you. In plain, simple language you’ll learn **what AI is**, how tools like **ChatGPT, Claude, Gemini and Copilot** work, what you get **for free and what costs money**, and how to use them to save time on lesson planning, worksheets, feedback and parent communication.\n\nNo technical background is needed. Every lesson ends with a quick check or a small task you can try in your own classroom the next day.\n\n- 4 short modules, 14 easy lessons\n- Real classroom examples from Indian schools\n- Free certificate after the 25-question exam",
  outcomes: [
    "Explain what AI and generative AI are in simple words",
    "Know the main AI assistants — ChatGPT, Claude, Gemini, Copilot — and who makes them",
    "Understand what free plans include and when a paid plan is worth it",
    "Write clear prompts that produce classroom-ready material",
    "Use AI for lesson plans, worksheets, differentiation and feedback",
    "Protect student privacy and check AI output for accuracy and bias",
    "Set fair rules for students’ use of AI",
    "Make a simple 30-day plan to start using AI confidently",
  ],
  modules: [
    // ─────────────────────────────── MODULE 1 ───────────────────────────────
    mod("m1", "Understanding AI", [
      lesson("what-is-ai", "What is AI? (In plain words)", 10, [
        text("## AI is already around you\n\n**Artificial Intelligence (AI)** means computer programs that can do tasks we normally think need human intelligence — like understanding language, recognising pictures or making suggestions.\n\nYou already use AI every day:\n\n- **Google Maps** suggests the fastest route\n- **YouTube** recommends videos\n- Your phone **unlocks with your face**\n- **Autocorrect** fixes your spelling"),
        text("## What is “generative” AI?\n\n**Generative AI** is the newer kind of AI that can **create** things — writing a paragraph, a poem, a quiz, a picture or even a song — when you ask it in normal language.\n\nTools such as **ChatGPT, Claude, Gemini and Copilot** are generative AI *assistants*. You type (or speak) a request, and they reply like a helpful colleague."),
        note("Simple definition", "Think of a generative AI assistant as a **very fast, well-read helper** that can draft almost anything — but it doesn’t truly *understand* your students, and it can make mistakes."),
        points(["AI = programs that do “thinking” tasks", "Generative AI creates new text, images or audio", "ChatGPT, Claude, Gemini and Copilot are AI assistants", "They are helpers — you stay in charge"]),
        quiz("Which of these is an example of generative AI?", ["A calculator adding numbers", "An assistant writing a 10-question quiz on photosynthesis for you", "A light switch", "A printer"], 1, "Generative AI creates new content — like a quiz — from your request."),
      ]),
      lesson("how-chatbots-work", "How do AI chatbots actually work?", 12, [
        text("## A super-powered autocomplete\n\nAI chatbots learned by reading a huge amount of text — books, websites, articles. From this they learned patterns of language.\n\nWhen you ask a question, the AI **predicts the most likely next words**, one after another, to build an answer. That’s why the replies sound so natural."),
        text("## Why this matters for teachers\n\nBecause the AI is *predicting*, not *looking things up*:\n\n- It is **very good** at drafting, explaining, rewording and brainstorming\n- It can be **confidently wrong** about facts, dates, numbers and quotes\n- Its knowledge has a **cut-off date** — it may not know recent changes (like a new syllabus) unless the tool searches the web"),
        warn("Hallucinations", "When AI gives a fluent but **false** answer, it’s called a **hallucination**. Example: inventing a quote from a freedom fighter or a book that doesn’t exist. Always check facts before using them in class."),
        scenario("The wrong date", "Mrs. Kapoor asked an AI for a short history of the Indian Constitution. The text was excellent — but it gave the wrong year for one event. She caught it because she checked one fact against the NCERT textbook. Now she always does a quick “fact check” before printing."),
        quiz("Why can AI chatbots give wrong facts confidently?", ["They are trying to trick you", "They predict likely words rather than check facts", "They only work in English", "They are broken"], 1, "Prediction makes them fluent, not always accurate — so verify important facts."),
      ]),
      lesson("ai-myths", "Myths and facts about AI in schools", 10, [
        text("## Let’s clear up some common worries\n\n1. **Myth: “AI will replace teachers.”** Fact: AI can draft and explain, but it cannot build relationships, read the room, inspire or care for students. Those are the heart of teaching.\n2. **Myth: “You need to be good with computers.”** Fact: If you can send a WhatsApp message, you can use an AI assistant.\n3. **Myth: “AI is always right.”** Fact: AI makes mistakes. Your expertise is what makes it useful.\n4. **Myth: “Using AI is cheating.”** Fact: For teachers, using AI to *draft* is like using a good reference book — as long as you review and own the final work.\n5. **Myth: “AI is only in English.”** Fact: Major tools work in **Hindi and many Indian languages** — quality varies, so check important text."),
        tip("The 80/20 rule", "Let AI do the first **80%** — the draft. You spend your energy on the most important **20%**: checking, personalising and connecting it to your students."),
        reflect("Which of these myths did you believe before? What do you think now?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 2 ───────────────────────────────
    mod("m2", "Meet the AI tools", [
      lesson("the-big-four", "ChatGPT, Claude, Gemini and Copilot", 15, [
        text("## The four assistants most teachers use\n\nAll four can chat, write, explain, summarise and translate. Each has its own strengths."),
        text("### ChatGPT — by OpenAI\n\n- The most widely known AI assistant\n- Great all-rounder: writing, ideas, explanations, images, voice chat\n- Website **chatgpt.com** and mobile apps"),
        text("### Claude — by Anthropic\n\n- Known for **clear, thoughtful writing** and handling **long documents** (for example, a whole chapter or policy PDF)\n- Good at following detailed instructions and explaining step by step\n- Website **claude.ai** and mobile apps"),
        text("### Gemini — by Google\n\n- Works closely with **Google apps** — Gmail, Docs, Drive, Slides\n- Useful if your school uses **Google Workspace** or Google Classroom\n- Website **gemini.google.com** and the Gemini app on Android/iPhone"),
        text("### Copilot — by Microsoft\n\n- Free chat at **copilot.microsoft.com** and in the Copilot app\n- With a Microsoft 365 subscription, Copilot also works **inside Word, PowerPoint, Excel and Outlook**\n- Handy if your school uses Microsoft Office or Teams"),
        tip("Which one should I pick?", "Honestly — any of them is fine to start. Pick **one**, use it for two weeks, and get comfortable. If your school uses Google, try Gemini; if it uses Microsoft, try Copilot. Many teachers keep two: one for writing (often Claude or ChatGPT) and one inside their school apps."),
        note("Other useful free tools", "**NotebookLM** (Google) — upload your notes or chapters and ask questions about only those sources. **Perplexity** — an AI search tool that shows its sources. **Canva** — AI help for posters and presentations."),
        quiz("Your school uses Google Classroom and Google Docs. Which assistant fits most naturally?", ["Gemini", "Copilot", "None — AI can’t work with Google", "Only paid tools"], 0, "Gemini is built by Google and works closely with Google apps."),
      ]),
      lesson("free-vs-paid", "Free vs paid: what do you really get?", 15, [
        text("## The good news: free is enough to start\n\nAll four assistants have a **free plan** that is very capable for everyday teaching tasks — lesson ideas, worksheets, emails, explanations.\n\n**Paid plans** mainly give you:\n\n- **More usage** — fewer “you’ve reached your limit” messages\n- Access to the **most advanced models** and faster replies\n- Extra features — longer documents, file analysis, image/video tools, deeper research, storage"),
        warn("Prices change often", "The figures below are **approximate, as of October 2026**, and offers change frequently (for example student or telecom offers). Always check the **official pricing page** inside each app before paying. Prices usually exclude GST."),
        text("### ChatGPT (OpenAI)\n\n- **Free:** everyday chat with daily limits\n- **Go:** about ₹399/month — more usage at a low price\n- **Plus:** about ₹1,999/month — advanced models and more features\n- **Pro:** much more expensive, for very heavy professional use"),
        text("### Gemini (Google)\n\n- **Free:** Gemini app with a Google account\n- **Google AI Plus:** about ₹399/month (introductory offers have been lower)\n- **Google AI Pro:** about ₹1,950/month — advanced models plus extra Google storage\n- Look out for special offers for students and some mobile networks"),
        text("### Claude (Anthropic)\n\n- **Free:** chat with usage limits that reset every few hours\n- **Pro:** about US$20/month (shown in rupees at checkout) — much more usage and extra features like Projects\n- **Max:** higher-priced plans for very heavy use"),
        text("### Copilot (Microsoft)\n\n- **Free:** Copilot chat on the web and app\n- **Microsoft 365 Personal / Family:** a subscription that includes Copilot inside Word, Excel, PowerPoint and Outlook (with usage limits)"),
        tip("Ask your school first", "Many schools already pay for **Google Workspace for Education** or **Microsoft 365** — your school account may already include AI features. Ask your IT coordinator before buying anything yourself."),
        points(["Start free — it’s enough for most teachers", "Pay only if you hit limits every week or need a specific feature", "One paid plan is usually enough — not all four", "Check official pricing pages; offers change"], "Smart money tips"),
        quiz("You use the free plan and only hit the limit once a month. What makes most sense?", ["Buy every paid plan", "Stay on the free plan for now", "Stop using AI", "Buy the most expensive “Pro” plan"], 1, "If free covers your real needs, there’s no need to pay."),
      ]),
      lesson("getting-started", "Getting started: your first conversation", 12, [
        text("## Step by step\n\n1. **Pick a tool** and open its website or download the official app (check the maker’s name — avoid look-alike apps).\n2. **Sign up** with your email or Google/Microsoft account. Use your **school account** if your school allows it.\n3. **Open Settings → Privacy / Data.** Look at chat history and whether your chats are used to improve the AI. Choose what you’re comfortable with.\n4. **Type your first request** — just like a message to a colleague.\n5. **Read, check, and ask follow-up questions.**"),
        text("## Try this first prompt\n\n*“I teach Class 5 in a CBSE school. Suggest 5 fun ways to start a lesson on fractions. Keep each idea to two lines.”*\n\nThen follow up: *“I like idea 3. Turn it into a 10-minute activity with steps.”*"),
        tip("Use your voice", "Most apps have a **microphone** button. You can speak your request in English, Hindi or another language — great when you’re busy."),
        warn("Age limits for students", "Each AI tool sets its **own minimum age** in its terms (for example, some require users to be 13+ with parental permission; Claude’s consumer apps require users to be 18+). Check the terms and your school policy before asking students to sign up."),
        reflect("Open one AI assistant now and ask it for 3 ideas for tomorrow’s lesson. Which idea would you actually use?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 3 ───────────────────────────────
    mod("m3", "Using AI for your teaching", [
      lesson("prompting-made-simple", "Prompting made simple", 15, [
        text("## The RTCF recipe\n\nA **prompt** is simply what you ask the AI. Good prompts have four ingredients:\n\n1. **Role** — who should the AI act as? *“Act as an experienced Class 7 maths teacher.”*\n2. **Task** — what do you want? *“Create 8 word problems on percentages.”*\n3. **Context** — who is it for? *“Students are mixed ability; use Indian names and rupees.”*\n4. **Format** — how should it look? *“Make a table with question, answer and difficulty.”*"),
        scenario("Before and after", "**Weak prompt:** “Make a maths worksheet.”\n\n**Strong prompt:** “Act as a Class 7 maths teacher. Create 8 word problems on percentages for mixed-ability students using Indian names and rupees. Give a table with question, answer and difficulty (easy/medium/hard).”"),
        text("## Magic follow-up phrases\n\n- *“Make it simpler for Class 4.”*\n- *“Shorter, please — maximum 5 points.”*\n- *“Add an answer key at the end.”*\n- *“Give two more examples like number 3.”*\n- *“Translate this into Hindi.”*\n- *“Explain this to a 10-year-old.”*"),
        tip("Save your best prompts", "Keep a note on your phone with prompts that worked well. Next time, just change the topic."),
        quiz("Which part of RTCF is “students are mixed ability; use Indian names”?", ["Role", "Task", "Context", "Format"], 2, "Context tells the AI who the output is for."),
      ]),
      lesson("planning-with-ai", "Lesson plans and worksheets with AI", 15, [
        text("## A lesson plan in 5 minutes\n\nTry this prompt:\n\n*“Create a 40-minute lesson plan for Class 6 Science on ‘Separation of Substances’. Include: learning objective, a 5-minute hook, main activity using things found at home, a quick group task, and a 5-minute exit ticket with 3 questions.”*"),
        text("## Worksheets and question banks\n\n- *“Make 10 MCQs on this chapter with 4 options each and mark the answer.”*\n- *“Create a fill-in-the-blanks worksheet using these 12 vocabulary words.”*\n- *“Write 5 higher-order thinking questions about this poem.”*\n\nYou can paste a paragraph from your textbook or notes so the questions match exactly what you taught."),
        text("## Teaching ideas\n\n- Real-life examples: *“Give 5 everyday Indian examples of friction.”*\n- Analogies: *“Explain electric current using a water pipe analogy.”*\n- Stories: *“Write a short story that teaches the importance of saving water, for Class 3.”*"),
        warn("Always review", "Check every fact, answer key and difficulty level. AI answer keys can contain mistakes — solve a few questions yourself."),
        points(["Ask for a structure: objective, hook, activity, check", "Paste your own textbook text for accurate questions", "Use AI for examples, analogies and stories", "Review answer keys yourself"]),
        reflect("Write the prompt you would use to plan your next lesson. Try it and note what you changed in the result."),
      ]),
      lesson("every-learner", "Reaching every learner: levels and languages", 12, [
        text("## Differentiation made easy\n\nOne class, many levels. AI can quickly create versions of the same material:\n\n- *“Rewrite this passage at three levels: simple, standard and advanced. Keep the same key facts.”*\n- *“Make a picture-based version of this worksheet for students who struggle with reading.”*\n- *“Create extension questions for students who finish early.”*"),
        text("## Language support\n\nAI tools can translate and simplify in **Hindi and many other Indian languages**:\n\n- Translate notes for students who are more comfortable in their home language\n- Draft messages to parents in their preferred language\n- Create bilingual vocabulary lists (English–Hindi)"),
        warn("Check translations", "Translations are a good **first draft**, but tone and meaning can be off. Read them yourself, or ask a colleague who is fluent, before sending to families."),
        scenario("Three levels, one goal", "Mr. Iyer’s Class 8 had students reading at very different levels. He asked AI to rewrite a passage on the Mughal Empire at three levels. Everyone learned the same key facts, then discussed together — and quieter students joined in because they understood the text."),
        quiz("What stays the same when you differentiate with AI?", ["The learning goal", "The difficulty for everyone", "The number of words", "Nothing"], 0, "Change the path, not the destination — every student works towards the same goal."),
      ]),
      lesson("feedback-with-ai", "Assessment and feedback with AI", 12, [
        text("## Faster, better feedback\n\n- **Rubrics:** *“Create a simple 4-level rubric for a Class 7 paragraph on ‘My favourite festival’: ideas, organisation, vocabulary, grammar.”*\n- **Feedback starters:** paste an anonymous answer and ask *“Give two strengths and one next step, in a kind tone for a 12-year-old.”*\n- **Common mistakes:** *“Here are 5 wrong answers students gave. What misconceptions do they show?”*"),
        warn("You decide the marks", "AI can suggest feedback, but **final grades and judgments are yours**. Remove names before pasting student work, and never upload marks lists with student details."),
        tip("Glow and grow", "Ask AI for one **glow** (what went well) and one **grow** (what to improve). Short, kind feedback is the kind students actually read."),
        quiz("Which task should stay with the teacher, not the AI?", ["Drafting a rubric", "Suggesting feedback phrases", "Deciding a student’s final grade", "Listing common mistakes"], 2, "AI assists; humans decide grades."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 4 ───────────────────────────────
    mod("m4", "Safe and responsible AI", [
      lesson("privacy", "Protecting student privacy", 12, [
        warn("Never paste", "Student **names with marks**, Aadhaar or phone numbers, addresses, health or family details, or anything your school treats as personal data."),
        text("## A simple privacy checklist\n\n1. **Remove names** and personal details before pasting student work (use “Student A”).\n2. Use tools **approved by your school**, ideally with your school account.\n3. Check the tool’s **privacy settings** — history and whether chats are used to train the AI.\n4. Don’t upload confidential documents (exam papers before the exam, staff records).\n5. Be ready to explain to a parent how you used AI."),
        note("The law in India", "The **Digital Personal Data Protection (DPDP) Act, 2023** sets rules for handling personal data, including children’s data. Your school may have its own policy — follow it."),
        points(["De-identify first", "Use school-approved tools", "Check privacy settings once", "When in doubt, leave it out"]),
        quiz("Which is safe to paste into an AI tool?", ["A list of students’ names with marks", "An anonymous paragraph written by “Student A”", "A parent’s phone number", "A student’s medical report"], 1, "Remove personal details — anonymous work is the safe choice."),
      ]),
      lesson("accuracy-bias", "Checking accuracy and spotting bias", 10, [
        text("## The 3-check habit\n\nBefore using AI output in class, check:\n\n1. **Facts** — dates, names, numbers, formulas. Compare with your textbook or an official source.\n2. **Level** — is it right for your students’ age and language?\n3. **Fairness** — does it show different genders, communities and regions fairly?"),
        text("## What is AI bias?\n\nAI learned from human writing — so it can repeat **stereotypes**. For example, always showing engineers as men or using only city-life examples.\n\nYou can fix it: *“Use a mix of names from different regions of India and show both girls and boys in leadership roles.”*"),
        tip("Turn it into a lesson", "Show students an AI answer with a mistake or a stereotype and ask them to find it. It builds critical thinking — a skill they need for life."),
        quiz("AI wrote a story where every scientist is a man. Best response?", ["Use it anyway", "Ask the AI for diverse characters and edit the story", "Tell students AI is always fair", "Never use stories"], 1, "Spot bias and correct it before using."),
      ]),
      lesson("students-and-ai", "Students and AI: honesty and good habits", 12, [
        text("## Set clear rules — the traffic light\n\nFor each assignment, tell students what is allowed:\n\n- **Red:** no AI at all (e.g. a class test)\n- **Amber:** AI for ideas only, and say how you used it\n- **Green:** AI allowed, but you must check and explain your work"),
        scenario("The too-perfect essay", "Riya’s essay was far more polished than her usual work. Instead of accusing her, Ms. Fernandes asked Riya to explain her main argument and how she wrote it. Riya admitted she’d used AI for most of it. Together they agreed she would rewrite one section in her own words — and Riya learned more than a punishment would have taught."),
        warn("Detectors are not proof", "AI-writing detectors often make mistakes and can wrongly flag honest students, especially those writing in a second language. Use conversations and process (drafts, notes, oral explanation) instead."),
        text("## Teach AI literacy\n\nHelp students understand that AI can be wrong, can be biased, and that **their own thinking matters**. Teach them to check facts and to use AI as a study helper — for example, *“Quiz me on this chapter”* — not as a shortcut."),
        reflect("Write one simple AI rule you could share with your class this week."),
      ]),
      lesson("thirty-day-plan", "Your 30-day AI starter plan", 10, [
        text("## Start small, grow steadily\n\n1. **Week 1 — Explore:** pick one AI assistant, set your privacy settings, and use it for 3 small tasks (an email, lesson ideas, a quiz).\n2. **Week 2 — Plan:** use RTCF prompts to plan two full lessons and one worksheet. Review everything.\n3. **Week 3 — Differentiate:** create levelled versions of one text and a translated parent note.\n4. **Week 4 — Reflect and share:** note what saved time, what needed fixing, and share one great prompt with a colleague."),
        points([
          "AI is a helper — you are the teacher",
          "Free plans are enough to start; pay only when you need more",
          "Good prompts = Role + Task + Context + Format",
          "Always check facts, level and fairness",
          "Protect student privacy — de-identify first",
          "Set clear, kind rules for students’ AI use",
        ], "What you’ve learned"),
        tip("You’re ready!", "Finish this lesson to complete the course — then take the **25-question certification exam** (45 minutes, 70% to pass) to earn your free certificate."),
        reflect("What is the first task you will hand to AI tomorrow?"),
      ]),
    ]),
  ],
};

export const INTRO_AI_COURSE: Course = {
  id: INTRO_AI_COURSE_ID,
  programId: INTRO_AI_PROGRAM_ID,
  price: 0,
  title: "Introduction to AI for Class Teachers",
  category: "AI Tools for Teachers",
  hours: 3,
  level: "Beginner",
  blurb: "Learn what AI is, how ChatGPT, Claude, Gemini and Copilot work, what’s free vs paid, and how to use AI safely to save time every week.",
  ...content,
};
