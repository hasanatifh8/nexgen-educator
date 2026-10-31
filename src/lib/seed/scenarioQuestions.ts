import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Premium · Advanced · 7 hours — writing and analysing application-level questions. */
export const SCENARIO_QUESTIONS: Content = {
  instructor: { name: "Samuel Okafor", title: "Assessment Specialist" },
  overview: `Write questions that test **judgement and application**, not memory, and use data to improve them over time.

Indian board exams now give a large share of marks to **competency-based questions**: case-based, source-based, data-based and assertion–reason items. This course teaches you to write them well: realistic stems, distractors built from real misconceptions, items that reach higher-order thinking, and fair language for every learner. You’ll then learn **item analysis** (difficulty, discrimination and distractor analysis) and how to build a balanced test with a blueprint.

You’ll finish with a reviewed, field-tested set of items for your own subject.`,
  outcomes: [
    "Explain how competency-based items differ from recall items",
    "Write realistic scenario, case-based and source-based stems",
    "Write assertion–reason and data-interpretation items correctly",
    "Build distractors from genuine student misconceptions",
    "Spot and fix common item-writing flaws",
    "Calculate and interpret difficulty and discrimination indices",
    "Plan a balanced test with a blueprint",
  ],
  modules: [
    mod("m1", "Why application matters", [
      lesson("recall-vs-application", "Recall vs application", 20, [
        text(`
          ## Two questions on the same concept

          **Recall:** “What is the formula for density?”

          **Application:** “A shopkeeper says a 1-litre bottle of mustard oil weighs less than a 1-litre bottle of water. Using the idea of density, explain whether he could be right.”

          The first checks memory. The second checks whether a student can **use** the idea in a new situation, which is what we actually care about.

          ## Why boards are shifting

          NEP 2020 and NCF-SE 2023 call for assessment of **competencies** (understanding, application, analysis) rather than rote memorisation. CBSE has steadily increased the share of competency-focused questions in board papers, roughly half of the paper in many subjects in recent years. Check the current sample papers for your subject on the CBSE academic website.
        `),
        resource("CBSE Academic: sample papers and assessment resources", "https://cbseacademic.nic.in", "Official sample question papers and marking schemes"),
        quiz(
          "Which question tests application rather than recall?",
          [
            "A farmer’s soil test shows low nitrogen. Which crop rotation would help, and why?",
            "Name three nitrogen-fixing crops.",
            "Define crop rotation.",
            "In which chapter is crop rotation explained?",
          ],
          "It asks students to use knowledge to make and justify a decision in a new situation.",
        ),
      ]),
      lesson("bloom-items", "Bloom’s levels in question writing", 20, [
        text(`
          ## Matching verbs to thinking

          - **Remember:** recall facts, terms (name, list, define)
          - **Understand:** explain ideas (explain, summarise, classify)
          - **Apply:** use a procedure or idea in a new situation (solve, use, predict)
          - **Analyse:** break down, find relationships (compare, distinguish, infer)
          - **Evaluate:** judge with criteria (justify, critique, decide)
          - **Create:** produce something new (design, propose)

          ## MCQs can go higher than you think

          A well-written MCQ can test application, analysis and even evaluation, if the stem presents a **situation** and asks for a **decision** or **inference**.
        `),
        quiz(
          "“Which of these two experimental designs gives a fairer test, and why?” is mainly testing which level?",
          ["Evaluate", "Remember", "Understand", "Create"],
          "Judging between designs using criteria is evaluation.",
        ),
      ]),
    ]),

    mod("m2", "Writing better items", [
      lesson("item-anatomy", "Anatomy of a good MCQ", 20, [
        text(`
          ## Parts of an item

          - **Stem:** the situation and question
          - **Key:** the single best answer
          - **Distractors:** plausible wrong answers

          ## Rules of thumb

          1. The stem should make sense **on its own**. A student who knows the content should be able to answer before reading the options.
          2. Test **one idea** per item.
          3. Put most words in the stem, not repeated in every option.
          4. Use **3 or 4 options**. Three good distractors beat five weak ones.
          5. Make options **similar in length and grammar**.
          6. Avoid negatives (“Which is NOT…”). If you must, **bold** the NOT.
        `),
        tip("Cover test", "Cover the options and read the stem. If you can’t tell what is being asked, rewrite the stem."),
        quiz(
          "What is the ‘cover test’ for an MCQ stem?",
          ["A knowledgeable student should be able to answer with the options covered", "Hide the key among long options", "Cover the page so students can’t copy", "Test whether the item fits on one page"],
          "A self-contained stem focuses the item on one clear problem.",
        ),
      ]),
      lesson("stems", "Writing scenario stems", 30, [
        text(`
          ## Put the learner in the situation

          A strong scenario stem describes a **realistic situation** and asks what to **do, predict, explain or decide**, not what to remember.

          ## Ingredients

          - A **context** students can picture: a market, a farm, a cricket match, a kitchen, a news report
          - The **relevant information**, plus a little irrelevant detail (as in real life)
          - A **clear question** that requires the target concept

          ## Keep it fair

          - Use contexts that are familiar to students from **all backgrounds**: rural and urban, all regions
          - Keep the reading level **below** the subject level, so you test science, not English
          - Keep it short: usually 2–5 sentences for a single item
        `),
        scenario("Before and after", `**Before:** “What is the function of the stomata?”

**After:** “Priya notices that the leaves of her tulsi plant droop on very hot afternoons but recover in the evening. Which explanation is best supported by how stomata work?”`),
        tip("One problem per item", "If a stem needs two questions, split it into two items."),
        reflect("Rewrite one recall question from your last test as a scenario item."),
      ]),
      lesson("case-source", "Case-based and source-based item sets", 30, [
        text(`
          ## Item sets

          A **case** (a passage, data table, map, diagram or source extract) is followed by **3–5 questions** that require using it. These appear in many Indian board papers.

          ## Writing a good case

          1. 80–150 words, or a clear table, graph or image
          2. **New to students**: not copied from the textbook
          3. Contains everything needed to answer; no outside facts required beyond the concept
          4. Questions move from **understanding to analysis**

          ## Source-based (history, civics, literature)

          Use a short extract from a primary source or speech. Ask students to **infer**, **identify perspective** or **connect** to a concept, not to recall where it came from.
        `),
        warn("Don’t make it a reading test", "If students can answer without understanding the concept (just by matching words in the passage), the item is testing reading, not the subject."),
        quiz(
          "What is the biggest flaw in a case-based set where every answer can be found by copying a sentence from the passage?",
          ["It tests word-matching instead of applying the concept", "The passage is too short", "There are too many questions", "It uses a real context"],
          "Good case-based items require using the concept, not locating text.",
        ),
      ]),
      lesson("assertion-reason", "Assertion–reason and data items", 25, [
        text(`
          ## Assertion–reason (A–R)

          Two statements: **Assertion (A)** and **Reason (R)**. Standard options:

          1. Both A and R are true, and R is the correct explanation of A
          2. Both A and R are true, but R is not the correct explanation of A
          3. A is true, but R is false
          4. A is false, but R is true

          ## Writing A–R well

          - Each statement must be **clearly true or false** on its own
          - The interesting items test whether R actually **explains** A (options 1 vs 2)
          - Vary which option is correct across a paper

          ## Data-interpretation items

          Use a real table or graph and ask students to **read, compare, infer and predict**. Always cite the data source.
        `),
        quiz(
          "A: Iron nails rust faster near the sea. R: Salty, moist air speeds up rusting. Which option is correct?",
          ["Both A and R are true, and R correctly explains A", "Both true, but R doesn’t explain A", "A is true, R is false", "A is false, R is true"],
          "Salt and moisture accelerate the oxidation of iron, which directly explains faster rusting near the sea.",
        ),
      ]),
    ]),

    mod("m3", "Distractors and flaws", [
      lesson("distractors", "Distractors that diagnose", 25, [
        text(`
          ## Use real misconceptions

          Each wrong option should be something a student who **partly** understands might pick, so the answer tells you **what** they misunderstand.

          ## Where to find misconceptions

          - Common wrong answers in past tests and homework
          - Students’ explanations in class discussion
          - Research lists of misconceptions for your subject (e.g. “heavier objects fall faster”, “multiplication always makes bigger”)
          - Asking AI: “List common student misconceptions about [concept] at Class [x]”, then checking them against your experience
        `),
        scenario("Diagnostic distractors", `“Which fraction is the largest? (a) 1/3 (b) 1/8 (c) 1/5 (d) 1/4”

A student who picks **(b) 1/8** probably thinks “bigger denominator = bigger fraction”. That’s a specific misconception you can re-teach.`),
        quiz(
          "A strong distractor is:",
          ["Plausible and based on a common misconception", "Obviously wrong", "Always “all of the above”", "The longest option"],
          "Misconception-based distractors give you diagnostic information.",
        ),
      ]),
      lesson("item-flaws", "Common item-writing flaws", 20, [
        text(`
          ## Flaws that let students guess

          - **Longest-answer clue:** the key is noticeably longer or more detailed
          - **Grammatical clue:** “an” before a vowel-starting key only
          - **Word repeat:** a word in the stem appears only in the key
          - **Absolute words:** “always”, “never” mark distractors as false
          - **“All of the above”:** recognising two correct options gives it away
          - **Convergence:** the key shares the most features with other options

          ## Flaws that confuse knowledgeable students

          - Two defensible answers
          - Tricky negatives and double negatives
          - Irrelevant difficulty (complex vocabulary, long reading)
        `),
        tip("Peer review", "Swap items with a colleague and try to answer **without** knowing the content. If you can guess the key, there’s a flaw."),
        quiz(
          "In a set of options, the correct one is the only option using the word “usually” while the others say “always” or “never”. What flaw is this?",
          ["Absolute words in distractors give away the key", "Too few options", "A good use of qualifiers", "A stem that is too long"],
          "Test-wise students learn that absolute statements are usually false.",
        ),
      ]),
      lesson("fair-language", "Fairness, language and accessibility", 15, [
        text(`
          ## Test the subject, not the English

          - Short sentences, common words, active voice
          - Define unfamiliar terms not part of the target concept
          - Avoid idioms and culturally specific references (unless that’s the topic)

          ## Inclusive contexts

          - Balance names and roles across genders, regions and communities
          - Avoid contexts that may be upsetting or unfamiliar to some groups
          - Provide bilingual versions where the board/school allows

          ## Accessibility

          Clear fonts, large enough diagrams, enough white space, and readable tables help all learners, especially those with visual or reading difficulties.
        `),
        reflect("Review three items you wrote recently. Is any of them harder because of language rather than content?"),
      ]),
    ]),

    mod("m4", "Item analysis", [
      lesson("difficulty", "Difficulty index (p-value)", 25, [
        text(`
          ## How hard was the item?

          **Difficulty index p** = number of students who answered correctly ÷ total students.

          - p = 0.90 → very easy (90% correct)
          - p = 0.30 → hard (30% correct)

          For classroom tests, most items between **0.30 and 0.80** give useful information. A few easy items help confidence; very hard items may signal a teaching gap, or a flawed item.
        `),
        scenario("Calculate", `40 students take a test. 28 answer item 5 correctly.

p = 28 ÷ 40 = **0.70**, a moderate, useful item.`),
        quiz(
          "50 students attempt an item and 10 answer correctly. What is the difficulty index?",
          ["0.20", "0.50", "0.10", "5.0"],
          "p = 10 ÷ 50 = 0.20, a hard item that deserves a look.",
        ),
      ]),
      lesson("discrimination", "Discrimination index and distractor analysis", 30, [
        text(`
          ## Does the item separate strong from weak?

          1. Rank students by **total test score**.
          2. Take the **top 27%** (upper group) and **bottom 27%** (lower group). In a small class, top and bottom halves or thirds work too.
          3. **D** = (correct in upper group − correct in lower group) ÷ size of one group.

          ## Interpreting D

          - **0.40 and above:** very good
          - **0.20–0.39:** acceptable; consider improving
          - **0–0.19:** weak; review
          - **Negative:** lower scorers did better. Usually a flawed key or ambiguous item.

          ## Distractor analysis

          Look at how many students chose each option:

          - A distractor **nobody** picks isn’t working; replace it
          - A distractor that **many strong students** pick may be arguably correct
          - A distractor chosen by many weak students is diagnostic; it’s doing its job
        `),
        scenario("Calculate", `Upper group: 10 students, 9 correct. Lower group: 10 students, 3 correct.

D = (9 − 3) ÷ 10 = **0.60**, a strongly discriminating item.`),
        warn("Negative D", "If D is negative, check the answer key first. A miskeyed item is the most common cause."),
        quiz(
          "An item has D = −0.25. What should you do first?",
          ["Check the answer key and the item for ambiguity", "Keep it; negative D means it is challenging", "Make it worth more marks", "Remove all items with p above 0.5"],
          "Negative discrimination usually indicates a wrong key or an ambiguous item.",
        ),
      ]),
      lesson("tools-ai", "Spreadsheets and AI for item work", 20, [
        text(`
          ## Spreadsheet item analysis

          Enter each student’s chosen option in a row and each item in a column. Simple formulas (COUNTIF for each option, totals per student, sorting by total) give you p, D and option counts in minutes. Google Forms quizzes show per-question correct rates automatically.

          ## AI as an item-writing assistant

          AI can quickly draft stems, cases and distractors, and review items for flaws. Use prompts such as:

          - “Write 5 scenario-based MCQs on [concept] for Class [x]. For each distractor, name the misconception it targets.”
          - “Review these items for the flaws: longest-answer clue, grammatical clues, two correct answers, absolute words.”

          Always solve every item yourself and check the key.
        `),
        note("Data privacy", "Use roll numbers instead of names in any spreadsheet you share, and never paste identifiable results into a public AI tool."),
        resource("Google Forms", "https://forms.google.com", "Free quiz tool with automatic per-question summaries"),
      ]),
    ]),

    mod("m5", "Building a balanced test", [
      lesson("blueprint", "Test blueprints", 25, [
        text(`
          ## Plan before you write

          A **blueprint** (or design of the question paper) is a grid of **content areas × thinking levels**, showing marks for each cell. It makes sure your test:

          - Covers all important topics in proportion to teaching time
          - Balances recall, application and higher-order thinking
          - Uses a sensible mix of item types

          ## A simple process

          1. List units/topics and weight them by importance and teaching time
          2. Decide the percentage of marks for each thinking level
          3. Fill the grid with marks per cell
          4. Write items to fill each cell; then check the totals
        `),
        tip("Copy the board pattern", "For classes 9–12, model your blueprint on the latest board sample paper’s design, so students practise the real balance of item types."),
        quiz(
          "What is the main purpose of a test blueprint?",
          ["Ensuring balanced coverage of content and thinking levels", "Making the paper longer", "Hiding questions from students", "Choosing fonts and layout"],
          "A blueprint links the test to the curriculum and the thinking you want to see.",
        ),
      ]),
      lesson("item-bank", "Workshop: build and field-test your item set", 45, [
        text(`
          ## Deliverables

          - **10 scenario MCQs** with misconception-based distractors
          - **1 case-based set** (case + 4 questions)
          - **2 assertion–reason items**
          - Answer key with explanations
          - A completed **flaw checklist** for each item

          ## Field test

          Use the set with your class, then calculate p and D for each item and do a distractor analysis. Revise or replace weak items and store the good ones in your **item bank** with their statistics.
        `),
        points([
          "Write stems that present real situations and require decisions",
          "Build distractors from genuine misconceptions",
          "Check every item against the flaw list",
          "Use p, D and distractor counts to improve items",
          "Plan tests with a blueprint and build an item bank over time",
        ], "Course summary"),
        reflect("Which of your items performed worst in the field test? What does the data tell you about how to fix it?"),
      ]),
    ]),
  ],
};
