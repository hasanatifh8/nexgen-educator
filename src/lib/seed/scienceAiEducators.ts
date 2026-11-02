import type { Course, ExamQuestion, Program } from "../catalog";
import { kit, type Content } from "./kit";

/**
 * “Empowering Indian Science Educators” — Generative AI and active pedagogy for science teachers of
 * Classes 5–10 (CBSE and ICSE). Built around the 5E model, inquiry, virtual labs and board-style assessment.
 * Board formats change: lessons point teachers to the latest official sample papers rather than fixing weightages.
 */

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz, prompt, activity } = kit();

export const SCIENCE_PROGRAM_ID = "ai-science-educator";
export const SCIENCE_COURSE_ID = "empowering-indian-science-educators";

let examIndex = 0;
/** Correct answer written first, then rotated so answers spread evenly across A–D. */
const q = (id: string, prompt: string, options: string[], explanation: string, scenario?: string): ExamQuestion => {
  const target = [2, 0, 3, 1][examIndex++ % 4] % options.length;
  const wrong = options.slice(1);
  return { id, prompt, options: [...wrong.slice(0, target), options[0], ...wrong.slice(target)], answer: target, explanation, ...(scenario ? { scenario } : {}) };
};

export const SCIENCE_PROGRAM: Program = {
  id: SCIENCE_PROGRAM_ID,
  title: "AI-Empowered Science Educator (Classes 5–10)",
  category: "AI Tools for Teachers",
  level: "Intermediate",
  price: 0,
  description:
    "Generative AI and active pedagogy for CBSE and ICSE science teachers: 5E lesson design, virtual labs, competency-based assessment and responsible AI use with students.",
  exam: {
    minutes: 45,
    passPercent: 70,
    questions: [
      q("sc01", "What is the correct order of the 5E instructional model?", ["Engage, Explore, Explain, Elaborate, Evaluate", "Explain, Engage, Explore, Evaluate, Elaborate", "Evaluate, Explain, Explore, Engage, Elaborate", "Explore, Explain, Engage, Evaluate, Elaborate"],
        "Students are hooked first, explore before any explanation, then apply and are assessed."),
      q("sc02", "In the 5E model, why does Explore come before Explain?", ["Students build first-hand experience that the explanation can then make sense of", "It saves the teacher from explaining", "Explanations confuse students", "Exploration is only for gifted students"],
        "Concepts stick when students have something concrete to attach the explanation to."),
      q("sc03", "An AI tool says the focal length of a concave mirror is positive in the New Cartesian sign convention. What should you do?", ["Check it against the NCERT/ICSE textbook — in that convention a concave mirror’s focal length is negative", "Teach it as given", "Ask the AI again and accept whichever answer appears twice", "Skip sign conventions"],
        "This is a typical hallucination. Always verify science facts, signs, units and formulae against the prescribed textbook.",
        "You asked AI for quick revision notes on spherical mirrors for Class 10."),
      q("sc04", "Which detail should NEVER be pasted into an AI tool?", ["Students’ names with their marks", "The chapter name “Acids, Bases and Salts”", "“Class 8, mixed-ability, 40 students”", "A list of common misconceptions about electricity"],
        "Personal data stays out of AI tools. De-identify everything and follow your school’s policy and the DPDP Act, 2023."),
      q("sc05", "Which prompt follows the Role–Context–Task–Constraints–Output structure best?", ["“Act as a CBSE Class 10 science teacher. My class is mixed-ability. Create 5 assertion–reason questions on Electricity. Use only NCERT content, no numericals above 2 steps. Output a table with answers and reasons.”", "“Electricity questions please.”", "“Make a test.”", "“You are smart. Help me with science.”"],
        "Role, context, a clear task, limits and an output format give board-ready results."),
      q("sc06", "What is the main difference between guided and open inquiry?", ["In guided inquiry the teacher gives the question; in open inquiry students form their own question and method", "Guided inquiry uses no materials", "Open inquiry means no teacher is present", "There is no difference"],
        "Inquiry levels move responsibility gradually from teacher to students."),
      q("sc07", "A Class 6 lesson begins with: “Why does a steel spoon look bent in a glass of water?” This is an example of…", ["Phenomenon-based learning", "Rote learning", "Summative assessment", "Remediation"],
        "A real, puzzling phenomenon drives curiosity before the concept of refraction is introduced."),
      q("sc08", "In a flipped classroom, students typically…", ["Meet the new content at home (short video or reading) and use class time for problem-solving and discussion", "Never do homework", "Watch the teacher lecture in class and practise at home", "Learn only from AI chatbots"],
        "Class time is freed for the active work that needs the teacher."),
      q("sc09", "Why use a guided worksheet with a PhET simulation rather than just letting students play?", ["Structured predictions, observations and questions turn the simulation into an investigation", "Simulations are too difficult otherwise", "Worksheets replace the simulation", "PhET requires a worksheet to open"],
        "Predict–observe–explain questions keep students thinking, not just clicking."),
      q("sc10", "Which PhET simulation best supports investigating Ohm’s law in Class 10?", ["Circuit Construction Kit: DC", "Build an Atom", "pH Scale", "Bending Light"],
        "Students vary voltage and resistance and record the current."),
      q("sc11", "What is the main risk of using AI-generated images as labelled science diagrams?", ["Labels and structures are often wrong or invented", "They are always in black and white", "They cannot show plants", "They are too small to print"],
        "Use textbook or verified diagrams for labelling. AI images suit hooks and stories, not exam diagrams."),
      q("sc12", "Can virtual labs fully replace hands-on practical work?", ["No — they complement real experiments, which build skills and remain part of board practical assessment", "Yes, always", "Only in Class 10", "Only for biology"],
        "Simulations are excellent for preparation, impossible or dangerous experiments and revision."),
      q("sc13", "In an assertion–reason question, students must decide…", ["Whether the assertion and reason are each true, and whether the reason correctly explains the assertion", "Only whether the assertion is true", "Which option is the longest", "The marks for each answer"],
        "Typical options: both true and R explains A; both true but R does not explain A; A true, R false; A false, R true."),
      q("sc14", "Which is a higher-order (HOTS) question?", ["“A farmer’s soil is too acidic. Suggest what he could add and explain why, using a chemical equation.”", "“Define an acid.”", "“Name two acids.”", "“Write the formula of common salt.”"],
        "It asks students to apply and justify, not just recall."),
      q("sc15", "What is a case-based question?", ["A short real-life passage or data set followed by questions that apply the concept", "A question about a court case", "A question with only one-word answers", "A question copied from the textbook exercise"],
        "Case-based items test competency — applying knowledge to an unfamiliar situation."),
      q("sc16", "Why include a marking scheme when you generate a Class 10 question with AI?", ["To check that the question really tests what you intend and to mark consistently", "Because AI cannot write questions without one", "To make the paper longer", "So students can see the answers first"],
        "A clear scheme exposes vague questions and makes marking fair."),
      q("sc17", "A hinge question is…", ["A quick, well-designed question mid-lesson that shows whether the class is ready to move on", "The last question of a board exam", "A question about door hinges", "A question asked only to toppers"],
        "Answers reveal misconceptions instantly so you can re-teach before moving on."),
      q("sc18", "Which is a common student misconception about electric circuits?", ["Current is “used up” as it goes around the circuit", "Current is the same at every point in a simple series circuit", "A switch completes or breaks a circuit", "Cells provide energy to the circuit"],
        "In a series circuit the current is the same everywhere. AI is very good at listing misconceptions to plan around."),
      q("sc19", "The three-level differentiation prompt rewrites a concept as…", ["Foundational, grade-level and advanced versions with the same core idea", "Three unrelated topics", "Three languages", "Three versions with different answers"],
        "Same learning goal, different paths. Every version must stay scientifically correct."),
      q("sc20", "A struggling Class 9 student keeps confusing mass and weight. The best AI use is to…", ["Generate a short remedial worksheet with everyday examples, which you review before giving", "Ask AI to grade the student", "Give the student an advanced extension task", "Tell the student to ask the chatbot for the answers"],
        "Targeted remediation, checked by the teacher, closes the gap."),
      q("sc21", "How should students use AI as a “thinking partner” in science?", ["To question their hypothesis, suggest variables to control and explain their own reasoning back to them", "To write the full practical record for them", "To copy answers for homework", "To replace the experiment"],
        "AI should push students’ thinking, not do it for them."),
      q("sc22", "Before asking students to use an AI tool, a teacher should check…", ["The tool’s minimum age, the school’s policy and parental consent where required", "Nothing — all tools are for all ages", "Only the tool’s price", "The student’s marks"],
        "Every AI tool sets its own age rules in its terms of use."),
      q("sc23", "A student shows a viral video claiming a home remedy cures every disease. As a science teacher you should…", ["Use it to teach evidence: ask what proof exists, who made the claim and how it could be tested", "Ignore it", "Share it with the class as fact", "Ban phones"],
        "Building scientific temper — a duty under Article 51A(h) — means teaching students to question claims."),
      q("sc24", "In India, online fraud or cybercrime can be reported…", ["On the National Cyber Crime Reporting Portal (cybercrime.gov.in) or helpline 1930", "Only by writing to the school principal", "Nowhere", "Only on social media"],
        "Teach students and parents these official channels."),
      q("sc25", "What makes a capstone 1-week module strong?", ["Clear objectives, a 5E flow, an investigation, differentiated tasks, board-style assessment and verified AI content", "As many AI tools as possible", "Only a final test", "Long lectures with slides"],
        "The rubric rewards alignment, active learning, inclusion, assessment quality and responsible AI use."),
    ],
  },
};

const content: Content = {
  instructor: { name: "NextGen Educator Science Faculty", title: "Science Pedagogy & EdTech Specialists" },
  overview: `A practical course for **science teachers of Classes 5 to 10** in **CBSE and ICSE** schools — whether you teach integrated General Science in the middle years or Physics, Chemistry and Biology in Classes 9 and 10.

You will move from textbook-and-board teaching to **active, inquiry-based science**, and use **generative AI** to plan faster, assess smarter and support every learner. Everything is grounded in chapters you already teach: *Light, Electricity, Acids, Bases and Salts, Life Processes, the Human Digestive System, Reflection and Refraction, and the Periodic Table*.

**What you will work with**

- **NEP 2020:** experiential learning, scientific temper, computational thinking and multidisciplinary links
- **Frameworks:** the 5E model, inquiry-based learning, flipped classroom, phenomenon-based learning and differentiation
- **Tools:** ChatGPT, Claude or Gemini, PhET simulations, OLabs and DIKSHA
- **Board-style assessment:** CBSE competency-based, case-based and assertion–reason questions, and ICSE application-type questions with marking schemes

**Format:** 7 modules, about 6 hours of self-paced lessons plus about 6 hours of practice in your own classroom. We suggest spreading it over **4 weeks** — one or two modules a week, trying each idea in class before the next. It ends with a **capstone**: your own one-week interactive science module, assessed against a rubric.

**Prerequisites:** you teach (or are training to teach) science in Classes 5–10, and can use a smartphone or computer. No AI experience needed.`,
  outcomes: [
    "Explain how generative AI works and spot hallucinations in science content (Understand)",
    "Write structured prompts using Role, Context, Task, Constraints and Output format (Apply)",
    "Design a board-aligned 5E lesson plan for a CBSE or ICSE chapter (Create)",
    "Build a guided-inquiry worksheet around a PhET or OLabs simulation (Create)",
    "Generate and critique competency-based, HOTS and assertion–reason questions with marking schemes (Evaluate)",
    "Differentiate a complex concept into three reading levels and plan remediation and extension (Apply)",
    "Analyse student responses in real time to find and correct misconceptions (Analyse)",
    "Teach students to use AI responsibly as a thinking partner, with cyber-safety awareness (Apply)",
    "Design and present an end-to-end, one-week interactive science module (Create)",
  ],
  modules: [
    // ─────────────────────────────── MODULE 1 ───────────────────────────────
    mod("m1", "The modern science classroom and AI primer", [
      lesson("course-map", "Welcome: your 4-week course map", 10, [
        text(`
          ## Why this course

          Most of us learnt science by copying notes and memorising definitions. Our students are growing up with AI chatbots, YouTube and board exams that increasingly test **application and reasoning**, not recall. This course helps you bridge that gap — practically, chapter by chapter.

          ## Suggested 4-week plan

          - **Week 1:** Module 1 (AI primer and inquiry) and Module 2 (5E lesson design). Try one 5E lesson.
          - **Week 2:** Module 3 (virtual labs and visuals). Run one simulation-based investigation.
          - **Week 3:** Module 4 (assessment and remediation). Build a short competency-based test and one remedial worksheet.
          - **Week 4:** Module 5 (responsible AI with students), Module 6 (toolkit) and Module 7 (capstone).
        `),
        note("Middle school vs high school", `Throughout the course, look for **grade nuance** notes:

- **Classes 5–7:** integrated General Science, tactile observation, stories and gamified inquiry.
- **Classes 8–10:** sharper Physics, Chemistry and Biology, rigorous diagrams, numericals and board-pattern assessment. CBSE keeps one Science subject up to Class 10; many ICSE schools teach Physics, Chemistry and Biology separately from the middle years.`),
        reflect("Which science chapter do your students find most boring or difficult? Keep it in mind — you will redesign it during this course."),
      ]),
      lesson("genai-for-science", "Generative AI for science teachers", 18, [
        text(`
          ## What generative AI is (and isn’t)

          Tools like **ChatGPT, Claude and Gemini** are *language models*. They learnt patterns from huge amounts of text and write answers by **predicting the next likely words**. That makes them brilliant at drafting lesson plans, questions and explanations — and capable of being **confidently wrong**.

          ## Hallucinations in science

          A hallucination is a fluent, confident error. In science they often hide in:

          - **Sign conventions** (e.g. mirror and lens formulae)
          - **Units and numericals** (wrong unit conversions, arithmetic slips)
          - **Chemical equations** (unbalanced, wrong products or states)
          - **Diagrams and labels** (invented parts of a flower or the heart)
          - **Syllabus facts** (topics that were removed or added recently)
        `),
        warn("The 3-check rule", `Before anything AI-generated reaches students:

1. **Facts and formulae** — check against the NCERT or ICSE prescribed textbook.
2. **Syllabus fit** — check against the current syllabus from CBSE or CISCE.
3. **Level and language** — is it right for your class?`),
        scenario("The balanced-looking equation", "Mr. Iyer asked AI for revision notes on Chemical Reactions and Equations for Class 10. The notes looked perfect — until a student noticed that one equation had 2 oxygen atoms on the left and 3 on the right. Mr. Iyer now asks AI to “show the atom count on each side” for every equation, and checks it himself."),
        quiz("Where do AI hallucinations most often hide in science content?", ["Sign conventions, units, equations and diagram labels", "Only in spelling", "Only in long answers", "AI never makes science mistakes"], "Always verify these high-risk details."),
        resource("CBSE Academic (syllabus and sample papers)", "https://cbseacademic.nic.in/", "Official CBSE curriculum and sample question papers."),
        resource("CISCE (ICSE)", "https://cisce.org/", "Official ICSE syllabus and specimen papers."),
      ]),
      lesson("privacy-prompts", "Ethics, privacy and prompt literacy", 18, [
        text(`
          ## Privacy first

          - **Never paste** students’ names, marks, photos, roll numbers, phone numbers or health details.
          - Use “Student A” and describe the learning need, not the person.
          - Use school-approved tools and check each tool’s **data and history settings**.
          - India’s **Digital Personal Data Protection Act, 2023** sets rules for personal data, including children’s data.

          ## The RTCCO prompt structure

          - **Role** — who the AI should act as
          - **Context** — board, class, chapter, students
          - **Task** — exactly what you want
          - **Constraints** — limits: NCERT-only, no numericals beyond 2 steps, simple English
          - **Output format** — table, numbered list, marking scheme
        `),
        prompt(`Role: Act as an experienced CBSE science teacher.
Context: Class 8, mixed-ability class of 40 students, chapter "Force and Pressure".
Task: List the 5 most common student misconceptions about force and pressure.
Constraints: Use only concepts in the NCERT Class 8 syllabus. Simple English.
Output format: A table with columns: Misconception | Why students think this | A 2-minute activity to challenge it.`, "Try the RTCCO structure"),
        activity("Spot the hallucination", "Run the prompt above. Then check every row against your textbook. Mark each one ✓ (correct), ✗ (wrong) or ? (not in syllabus). How many needed fixing?"),
        quiz("Which part of RTCCO tells the AI “use only NCERT content”?", ["Constraints", "Role", "Output format", "Task"], "Constraints set the limits the answer must stay within."),
      ]),
      lesson("rote-to-inquiry", "From rote memorisation to inquiry", 18, [
        text(`
          ## What inquiry-based learning (IBL) looks like

          Students **ask questions, investigate, gather evidence and explain** — the way scientists work. NEP 2020 calls this building **scientific temper**, which is also a fundamental duty under **Article 51A(h)** of the Constitution.

          ## Four levels of inquiry

          1. **Confirmation:** students follow steps to confirm a known result.
          2. **Structured:** the teacher gives the question and method; students find the answer.
          3. **Guided:** the teacher gives the question; students design the method.
          4. **Open:** students choose the question and the method.

          Move up the levels gradually through the year.
        `),
        note("Grade nuance", `**Classes 5–7:** start with structured inquiry and lots of touching and observing — “Which materials does a magnet attract? Sort them and find out.”

**Classes 8–10:** guided and open inquiry with variables, tables and graphs — “How does the length of a nichrome wire affect its resistance? Design a fair test.”`),
        prompt(`Act as an inquiry-based science teacher. Turn this textbook activity into a guided-inquiry task for Class 7 (CBSE): "Test different solutions with turmeric and litmus to see which are acidic or basic." Give: a driving question, what students should predict, a materials list using household items, an observation table, and 3 questions that push students to explain their results.`),
        activity("Level up one activity", "Pick one confirmation activity from your textbook. Rewrite it one level higher (structured → guided). Try it with one section this week."),
        quiz("In guided inquiry, who designs the method?", ["The students — the teacher gives the question", "The teacher, step by step", "The AI tool", "No one — there is no method"], "Students design the method; the teacher sets the question."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 2 ───────────────────────────────
    mod("m2", "AI-powered lesson planning and 5E unit design", [
      lesson("five-e", "The 5E model, step by step", 18, [
        text(`
          ## The 5Es

          1. **Engage** — hook curiosity and surface prior knowledge. A puzzle, demo or question.
          2. **Explore** — students investigate *before* you explain. Hands-on or simulation.
          3. **Explain** — students share findings; you introduce the formal concept and vocabulary.
          4. **Elaborate** — apply the idea to a new situation or real-world problem.
          5. **Evaluate** — check understanding: exit ticket, quiz, explanation or performance task.

          ## Example: Reflection of light (Class 7)

          - **Engage:** “Why is AMBULANCE written backwards on the front of an ambulance?”
          - **Explore:** students use a plane mirror and a torch to trace rays on paper.
          - **Explain:** angle of incidence = angle of reflection; lateral inversion.
          - **Elaborate:** design a simple periscope from a carton and two mirrors.
          - **Evaluate:** draw a labelled ray diagram and explain the ambulance lettering.
        `),
        tip("Don’t skip Explore", "The most common mistake is to explain first and then “do an activity to confirm”. Let students puzzle first — the explanation lands much better."),
        quiz("A teacher explains refraction, then does a demo. Which E has been skipped or misplaced?", ["Explore — students should investigate before the explanation", "Evaluate", "Elaborate", "None"], "Explore comes before Explain."),
        reflect("In your last science lesson, which of the 5Es did you spend the most time on? Which did you skip?"),
      ]),
      lesson("lesson-prompts", "Prompt template: a 5E lesson plan", 20, [
        text(`
          ## Toolkit template 1: 5E lesson plan (Class 7)

          Copy the template, then replace the parts in [square brackets]. It works for any chapter — *Nutrition in Plants, Heat, Acids, Bases and Salts, Electric Current and its Effects*.
        `),
        prompt(`Role: Act as an expert science pedagogy consultant for Indian schools, skilled in the 5E instructional model and NEP 2020.
Context: I teach Class 7 Science ([CBSE / ICSE]) in [city/type of school]. Chapter: [Nutrition in Plants — Photosynthesis]. Class size: [40], mixed ability, [some students learning in a second language]. One period is [40] minutes; I have [3] periods. Available materials: [basic lab, potted plants, iodine solution, no projector].
Task: Create a 5E lesson plan for this chapter.
Constraints:
- Align strictly with the [NCERT / ICSE] syllabus for Class 7; do not add out-of-syllabus content.
- Explore must come before Explain and must be hands-on.
- Include one real-life Indian example and one link to another subject (maths, geography or health).
- Simple English; key terms also given in [Hindi].
- Flag any safety precautions.
Output format:
1. Learning objectives (3, using Bloom's verbs)
2. A table: Phase | Time | Teacher does | Students do | Materials
3. 5 likely misconceptions and how the plan addresses them
4. An exit ticket with 3 questions and answers
5. A differentiation note: support for struggling learners and an extension for advanced learners`, "Template 1 — 5E lesson plan (Class 7)"),
        activity("Generate, then critique", "Use the template for a chapter you will teach in the next two weeks. Then review it with the 3-check rule and change at least three things to fit your class. Keep the before and after — you will need it for the capstone."),
        note("Grade nuance", `**Classes 5–7:** ask for more play, stories and short activities; fewer definitions.

**Classes 8–10:** add “Include one numerical problem with a worked solution and the board-style diagram students must practise” to the constraints.`),
      ]),
      lesson("flipped-phenomena", "Flipped classrooms and phenomenon-based learning", 18, [
        text(`
          ## Phenomenon-based learning

          Start with a **real, puzzling event**, and let the chapter explain it.

          - *Why does curd set faster in summer?* (microorganisms, Class 8)
          - *Why does an iron gate near the sea rust faster?* (corrosion, Class 10)
          - *Why does a pencil look bent in water?* (refraction, Classes 6–10)
          - *Why do we feel sleepy after a heavy lunch?* (digestion and blood flow, Class 7/10)
          - *Why does a fuse protect the house wiring?* (heating effect of current, Class 10)

          ## Flipped classroom

          Students meet the new content at home — a 5-minute video from DIKSHA or a short reading — and come to class ready to **solve, discuss and experiment**. Class time is used for the hard thinking that needs you.
        `),
        warn("Mind the digital divide", "Not every student has a device or data at home. Offer printed notes, the textbook pages or a school-time viewing slot as alternatives."),
        prompt(`Act as a science teacher using phenomenon-based learning. For the CBSE Class 10 chapter "Light — Reflection and Refraction", suggest 5 everyday Indian phenomena that can open the chapter. For each: the phenomenon, the driving question to ask students, the concept it leads to, and a 5-minute classroom demonstration with household items.`),
        activity("Flip one lesson", "Choose a 5-minute DIKSHA video or textbook section as homework. In class, start directly with a problem or experiment that uses it. Ask students afterwards whether they preferred it."),
        resource("DIKSHA", "https://diksha.gov.in/", "Free government platform with videos and resources mapped to textbooks."),
        quiz("Which is a phenomenon-based opener for corrosion?", ["“Why does an iron gate near the sea rust faster than one in Delhi?”", "“Define corrosion.”", "“Write the formula of rust.”", "“Copy the notes from the board.”"], "A real puzzle makes students want the explanation."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 3 ───────────────────────────────
    mod("m3", "Virtual labs, PhET simulations and visual storytelling", [
      lesson("phet-olabs", "PhET and OLabs in your classroom", 20, [
        text(`
          ## Free virtual labs

          - **PhET Interactive Simulations** (University of Colorado Boulder) — free, run in a browser, many work on phones. Great ones for Classes 5–10: *Circuit Construction Kit: DC*, *pH Scale*, *Bending Light*, *Build an Atom*, *States of Matter*.
          - **OLabs** — online labs for secondary science, developed under a Government of India initiative, mapped to school practicals.
          - **DIKSHA** — textbook-linked videos and interactive content.

          ## When simulations shine

          - Experiments that are **dangerous, expensive or invisible** (atoms, electron flow, acids in high concentration)
          - **Changing variables quickly** to see patterns
          - **Preparing** for a real practical, and **revising** afterwards
        `),
        warn("Simulations complement real labs", "Hands-on practical work builds skills that a screen cannot, and practicals are part of board assessment. Use simulations before or after — not instead of — real experiments wherever possible."),
        note("One-device classroom?", "Project the simulation and let students predict, vote and direct you: “Should I increase the voltage or the resistance next?” Small groups can share phones if your school allows it."),
        resource("PhET: Circuit Construction Kit — DC", "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc", "Build circuits; investigate Ohm’s law, series and parallel."),
        resource("PhET: pH Scale", "https://phet.colorado.edu/en/simulations/ph-scale", "Test everyday liquids for Acids, Bases and Salts."),
        resource("PhET: Bending Light", "https://phet.colorado.edu/en/simulations/bending-light", "Refraction and total internal reflection."),
        resource("PhET: Build an Atom", "https://phet.colorado.edu/en/simulations/build-an-atom", "Protons, neutrons, electrons and atomic structure."),
        resource("OLabs", "https://www.olabs.edu.in/", "Online labs for school science practicals."),
        quiz("When are simulations MOST useful?", ["For dangerous, invisible or fast-changing experiments, and for preparing or revising", "To replace every real practical", "Only for Class 5", "Only when the teacher is absent"], "Use them where they add something a real lab can’t."),
      ]),
      lesson("guided-worksheets", "Designing guided-inquiry worksheets", 20, [
        text(`
          ## Predict – Observe – Explain (POE)

          A good simulation worksheet keeps students thinking:

          1. **Predict:** “What will happen to the current if you add a second bulb in series? Why?”
          2. **Observe:** “Build it. Record the current in the table.”
          3. **Explain:** “Was your prediction right? Explain using the idea of resistance.”
          4. **Extend:** “Now try it in parallel. What changed, and why?”

          ## Example: Ohm’s law with the Circuit Construction Kit (Class 10)

          Students keep the resistor fixed, change the battery voltage in steps, record current, plot V against I and find the slope.
        `),
        prompt(`Role: Act as a physics teacher designing a guided-inquiry worksheet.
Context: CBSE Class 10, chapter "Electricity". Students will use the free PhET simulation "Circuit Construction Kit: DC" in pairs.
Task: Create a worksheet to investigate Ohm's law.
Constraints: Use the Predict-Observe-Explain structure. Include a data table with 5 readings, a graph to plot, and 2 questions about sources of error. Stay within the NCERT syllabus.
Output format: A printable worksheet with headings, followed by a short answer key for the teacher.`),
        activity("Run a POE lesson", "Use the worksheet with one class. Collect the Predict answers before they start — they are a goldmine of misconceptions for your next lesson."),
        note("Grade nuance", `**Classes 5–7:** fewer readings and more drawing — “Draw what happens to the bulb when you add another cell.” Use the *pH Scale* sim with turmeric and litmus at home.

**Classes 8–10:** full tables, graphs, slopes, error analysis and links to the board numericals.`),
      ]),
      lesson("visual-storytelling", "Visual storytelling with AI", 15, [
        text(`
          ## Stories make abstract science stick

          - A **journey story**: “A day in the life of a roti — from your mouth to your small intestine” (Human Digestive System).
          - A **comic strip**: “Electron Ellie travels through a series circuit.”
          - **Analogies**: the heart as a double pump; a circuit as water in pipes (and where the analogy breaks down).

          AI is excellent at drafting these stories. AI image generators can create hooks, characters and scenes.
        `),
        warn("Never trust AI diagrams for labelling", "AI images often invent structures or put labels in the wrong place. For anything students must label or reproduce in exams, use the textbook diagram or one you have checked."),
        prompt(`Write a 300-word "journey" story for Class 7 students called "A Day in the Life of a Roti", following a bite of roti through the human digestive system. Name each organ in bold, mention which juice or enzyme acts there and what it does (as per the NCERT Class 7 syllabus), and end with 3 quick questions for the class.`),
        activity("Story starter", "Read the AI story to your class (after checking it). Ask students to draw the journey as a comic strip — and compare their drawing with the textbook diagram."),
        quiz("What is the safest use of AI-generated images in science?", ["Hooks, characters and story scenes — not labelled exam diagrams", "Labelled diagrams for board exams", "Replacing the textbook", "Practical records"], "Use verified diagrams for anything students label."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 4 ───────────────────────────────
    mod("m4", "Formative assessment, rubrics and remediation", [
      lesson("question-types", "HOTS, competency-based and assertion–reason questions", 22, [
        text(`
          ## Question types you need

          - **Recall:** “Name the gas released when zinc reacts with dilute sulphuric acid.”
          - **HOTS (higher-order):** “A farmer’s soil is too acidic. What could she add, and why? Support your answer with a chemical equation.”
          - **Case-based (CBSE competency-based):** a short real-life passage, table or graph followed by 4–5 questions that apply the concept.
          - **Assertion–reason (CBSE):** two statements; students judge whether each is true and whether the reason explains the assertion.
          - **Application-type (ICSE):** precise, often multi-step questions — exact definitions, balanced equations, labelled diagrams and numericals with correct units.

          ### An assertion–reason example (Class 10, Electricity)

          **Assertion (A):** A fuse wire is made of a material with a low melting point.
          **Reason (R):** The heating effect of current melts the fuse when excess current flows.

          - (a) Both A and R are true, and R is the correct explanation of A.
          - (b) Both A and R are true, but R is not the correct explanation of A.
          - (c) A is true, but R is false.
          - (d) A is false, but R is true.

          *Answer: (a).*
        `),
        note("Board patterns change", "Weightages and formats are revised often. Always base your papers on the **latest sample or specimen papers** from CBSE and CISCE."),
        prompt(`Role: Act as a CBSE Class 10 science paper-setter experienced in competency-based assessment.
Context: Chapter "Acids, Bases and Salts". My students are mixed-ability; this is a unit test.
Task: Create 1 case-based question set (a 120-word real-life passage about soil pH and farming, followed by 4 questions) and 3 assertion-reason questions.
Constraints: Strictly within the NCERT Class 10 syllabus. Test application and reasoning, not recall. Use the standard 4 assertion-reason options.
Output format:
1. The questions, numbered, with marks for each.
2. A marking scheme with the expected answer, value points and step-wise marks.
3. For each question, the Bloom's level and the competency it tests.`, "Template 2 — Competency-based questions with a marking scheme (Class 10)"),
        activity("Audit an AI question paper", "Run Template 2. For each question, ask: Is it in the syllabus? Does it test application? Is there only one correct answer? Is the marking scheme fair? Rewrite any question that fails."),
        note("ICSE version", "Change the role to “ICSE Class 10 Chemistry examiner” and ask for “application-type questions with balanced equations, observations and exact terminology, following the latest CISCE specimen paper style”."),
        quiz("Which is an assertion–reason question?", ["A statement and a reason; students judge whether each is true and whether the reason explains the statement", "A multiple-choice question about one fact", "A long answer question with diagrams", "A fill-in-the-blank"], "Students analyse two statements and their relationship."),
      ]),
      lesson("real-time", "Real-time formative assessment", 18, [
        text(`
          ## Find out what they think — during the lesson

          - **Hinge questions:** one carefully designed multiple-choice question mid-lesson. Each wrong option matches a known misconception.
          - **Mini whiteboards or paper slates:** everyone holds up an answer at once.
          - **Finger voting (A/B/C/D)** or coloured cards — instant, no devices needed.
          - **Exit tickets:** 2–3 questions on a slip of paper at the end of the period.
          - **Quick online quizzes** (e.g. Google Forms) where devices are available.

          ## Common misconceptions worth testing

          - Current is “used up” in a circuit.
          - Plants get their food from the soil.
          - Heavier objects fall faster (ignoring air resistance).
          - All acids are dangerous; bases are “safe”.
          - Food is digested only in the stomach.
        `),
        prompt(`Act as a science assessment expert. Write 3 hinge questions for CBSE Class 8 on "Force and Pressure". Each question should have 4 options, where each wrong option matches a specific common misconception. After each question, explain which misconception each wrong option reveals and what to re-teach if many students choose it.`),
        activity("One hinge question tomorrow", "Use one hinge question halfway through your next lesson with finger voting. If fewer than 80% are correct, re-teach before moving on."),
        quiz("What makes a hinge question powerful?", ["Each wrong option reveals a specific misconception", "It is very long", "It is asked only at the end of term", "It has no correct answer"], "The answers tell you exactly what to fix."),
      ]),
      lesson("differentiate-remediate", "Rubrics, three reading levels and remediation", 22, [
        text(`
          ## Same concept, three paths

          Explain one concept at **three levels** so every student can access it:

          - **Foundational:** everyday language, short sentences, analogies, key vocabulary.
          - **Grade-level:** the textbook standard, with correct terms and one example.
          - **Advanced:** extra depth, quantitative reasoning or real-world applications.

          ## Remediation and extension

          - **Remedial worksheets** target one gap with everyday examples, worked steps and a few practice items.
          - **Extension tasks** stretch fast finishers: design an experiment, research an application, solve a harder numerical.

          ## Simple rubrics

          For practicals and projects, a 4-level rubric (Beginning, Developing, Proficient, Exemplary) with 3–4 criteria — *planning, observations, explanation, presentation* — makes marking fair and feedback clear.
        `),
        prompt(`Role: Act as a science teacher skilled in differentiation.
Context: Class 9 (CBSE/ICSE), concept: [Newton's third law of motion / Chemical bonding / Refraction of light].
Task: Explain this concept at three reading levels.
Constraints: All three versions must be scientifically accurate and cover the same core idea. Use Indian everyday examples. Foundational: under 120 words, very simple English, one analogy. Grade-level: textbook standard with correct terms. Advanced: add one quantitative or real-world application.
Output format: Three labelled sections (Foundational, Grade-Level, Advanced), each followed by 2 check questions with answers.`, "Template 3 — Three reading levels"),
        prompt(`Create a one-page remedial worksheet for a Class 9 student who confuses mass and weight. Include: a simple explanation with an everyday example, a 3-row comparison table, 5 practice questions that start easy and get harder, and an answer key. Use g = 9.8 m/s² and correct SI units.`, "Remedial worksheet prompt"),
        activity("Differentiate one lesson", "Use Template 3 for a concept you are teaching this week. Hand out the three versions without labels like “weak” or “bright” — use colours or names like Level A, B and C, and let students move between them."),
        quiz("What must stay the same across all three reading levels?", ["The core scientific idea and its accuracy", "The number of words", "The examples", "The difficulty"], "Paths differ; the destination doesn’t."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 5 ───────────────────────────────
    mod("m5", "Teaching responsible AI and scientific inquiry", [
      lesson("thinking-partner", "AI as a thinking partner, not a shortcut", 18, [
        text(`
          ## Good and poor uses of AI by students

          **Good uses**
          - “Here is my hypothesis about what affects the rate of evaporation. What variables should I control?”
          - “Ask me 5 questions to check whether I understand refraction. Don’t give me the answers.”
          - “Explain my mistake in this numerical without solving the whole thing.”

          **Poor uses**
          - “Write my practical record.”
          - “Answer these homework questions.”
          - Copying an AI explanation without checking it.

          ## Make AI use visible

          Use a traffic-light rule for each task — **Red:** no AI; **Amber:** AI for ideas, declared; **Green:** AI allowed, but students must check and explain. Ask students to attach their prompts and a line on how they verified the answer.
        `),
        prompt(`You are a Socratic science tutor for a Class 8 student. The student is learning about "Combustion and Flame". Do not give direct answers. Ask one question at a time to help the student reason it out, give a hint if they are stuck twice, and finish by asking them to explain the idea in their own words.`, "A Socratic tutor prompt students can use"),
        warn("Age rules and consent", "Each AI tool sets its own minimum age and consent rules in its terms of use. Check them, follow your school’s policy, and get parental consent where required before asking students to use a tool."),
        activity("Model it in class", "Project an AI tool and use the Socratic prompt live with a student volunteer. Then discuss: how was that different from just asking for the answer?"),
        quiz("Which is a responsible student use of AI in science?", ["Asking it to challenge their hypothesis and suggest variables to control", "Asking it to write the practical record", "Copying its homework answers", "Using it during a test"], "AI should push thinking, not replace it."),
      ]),
      lesson("cyber-safety", "Classroom safety and cyber awareness", 15, [
        text(`
          ## Cyber awareness every science student needs

          - **Misinformation:** viral “cures”, fake science claims, edited images. Teach students to ask: *Who says so? What is the evidence? Can it be tested?*
          - **Deepfakes:** AI can fake voices, photos and videos. If something is shocking, verify before sharing.
          - **Phishing and fraud:** never share OTPs, passwords or personal details; be careful with links and “free prize” messages.
          - **Digital footprint:** what is posted online can stay forever.
          - **Reporting:** online fraud and cybercrime can be reported on the **National Cyber Crime Reporting Portal (cybercrime.gov.in)** or by calling **1930**.
        `),
        tip("Turn it into science", "A fact-checking lesson *is* a science lesson. Give students a viral claim (“Drinking hot water kills all viruses in the body”) and ask them to design how they would test it."),
        prompt(`Create a 30-minute lesson for Class 9 on "Spotting fake science online". Include: 3 realistic but fake science claims common in India, a 4-step checklist students can use to evaluate a claim, a group activity, and an exit ticket. Keep it respectful — do not mock any community or tradition.`),
        activity("Myth-busters board", "Put up a “Myth or Science?” board in your classroom. Each week, add one viral claim; students vote, investigate and post the evidence."),
        resource("National Cyber Crime Reporting Portal", "https://cybercrime.gov.in/", "Report cybercrime online; helpline 1930."),
        quiz("A student wants to report an online fraud. Where should they go?", ["cybercrime.gov.in or helpline 1930", "Post it on social media", "Reply to the fraudster", "Nowhere — it cannot be reported"], "Teach students the official channels."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 6 ───────────────────────────────
    mod("m6", "Your classroom toolkit", [
      lesson("checklist", "The AI-enhanced lesson checklist", 15, [
        text(`
          ## Before the lesson

          1. Objectives written with Bloom’s verbs and matched to the syllabus.
          2. AI-generated material checked with the **3-check rule** (facts, syllabus, level).
          3. No student personal data used in any prompt.
          4. Simulation or demo tested on the actual device and network you will use.
          5. Offline backup ready (printed worksheet, textbook pages, a real demo).
          6. Differentiated versions and an extension task prepared.
          7. Safety precautions noted for any practical.

          ## During the lesson

          1. Engage with a phenomenon or question — before any notes.
          2. Students explore before you explain.
          3. Use at least one hinge question or quick poll.
          4. Circulate and listen; note misconceptions.
          5. If students use AI, the traffic-light rule is clear on the board.

          ## After the lesson

          1. Review exit tickets; sort into “got it”, “nearly” and “not yet”.
          2. Plan remediation for “not yet” and extension for “got it”.
          3. Note which AI material needed fixing — improve the prompt for next time.
          4. Save your best prompts in a personal prompt bank.
        `),
        activity("Print your checklist", "Copy this checklist into your planner or print it. Use it for your next three science lessons and tick each item."),
        points([
          "Check every AI output against the textbook and syllabus",
          "Explore before explain",
          "One hinge question per lesson",
          "Always have an offline backup",
          "Keep student data out of AI tools",
        ], "The five non-negotiables"),
      ]),
      lesson("prompt-bank", "Your science prompt bank", 15, [
        text(`
          ## Quick prompts for everyday science teaching

          Save these and adapt the details in brackets.
        `),
        prompt(`List 5 common misconceptions Class [7] students have about [Heat], and for each give a 2-minute demonstration with household items that challenges it.`, "Misconception buster"),
        prompt(`Write 10 numerical problems on [the mirror formula] for CBSE Class 10, increasing in difficulty, using the New Cartesian sign convention. Give step-by-step solutions with correct units and signs.`, "Graded numericals"),
        prompt(`Create a 10-question oral quiz game for Class [6] on [Components of Food], with answers, designed for two teams and a buzzer round.`, "Revision game"),
        prompt(`Write a lab safety briefing for Class [9] students before an experiment on [the reaction of metals with acids]. Include the hazards, the safety equipment, what to do if acid spills on skin, and 5 rules, in simple language.`, "Lab safety briefing"),
        prompt(`Suggest 3 multidisciplinary project ideas for Class [8] that connect science chapter [Pollution of Air and Water] with mathematics, geography and social science, suitable for students in [my city]. Include the final product students will create.`, "Multidisciplinary project"),
        reflect("Which of these prompts will you use first? What would you add to your own prompt bank?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 7 ───────────────────────────────
    mod("m7", "Capstone: design a one-week interactive science module", [
      lesson("capstone-brief", "The capstone brief", 20, [
        text(`
          ## Your task

          Design an **end-to-end, one-week interactive science module** (4–6 periods) for a chapter you teach, for one class between 5 and 10.

          ## What to include

          1. **Overview:** board, class, chapter, number of periods, and 3–4 learning objectives with Bloom’s verbs.
          2. **5E sequence** across the week, with a phenomenon-based Engage.
          3. **One investigation:** a hands-on experiment or a simulation with a guided POE worksheet.
          4. **Differentiation:** a three-level explanation of one key concept, a remedial worksheet and an extension task.
          5. **Assessment:** at least 2 hinge questions, an exit ticket, and a short board-style test (case-based or application-type, plus assertion–reason for CBSE) with a marking scheme.
          6. **Responsible AI:** the prompts you used, what you changed after checking, and the traffic-light rule for students.
          7. **Reflection:** after teaching it (or a part of it), what worked and what you would change.
        `),
        tip("Build on what you have", "You have already created most of the pieces in this course — your 5E plan, worksheet, question paper and differentiated texts. The capstone puts them together for one chapter."),
        prompt(`Role: Act as a senior science pedagogy coach.
Context: I am designing a one-week (5-period) module for [CBSE Class 10 — Electricity]. My draft plan is below.
Task: Review my plan against these criteria: alignment with the syllabus, a complete 5E flow, quality of the investigation, differentiation, assessment quality, and responsible AI use.
Constraints: Be specific and practical. Do not rewrite the whole plan.
Output format: For each criterion give a score from 1 to 4, one strength and one improvement.
[Paste your plan here — with no student names]`, "Get AI feedback on your draft"),
        activity("Build and teach", "Complete your module, teach at least two periods of it, and write your reflection. Share it with your head of department or a colleague for feedback."),
      ]),
      lesson("capstone-rubric", "The certification rubric", 15, [
        text(`
          ## How your module is judged

          Each criterion is scored from **1 (Beginning)** to **4 (Exemplary)**.

          ### 1. Curriculum alignment
          - **4:** objectives precisely match the CBSE/ICSE syllabus and Bloom’s levels; no errors.
          - **3:** aligned with minor gaps.
          - **2:** partly aligned; some content out of syllabus.
          - **1:** unclear objectives or significant errors.

          ### 2. Active learning (5E and inquiry)
          - **4:** a compelling phenomenon; students explore before explanation; inquiry at guided level or higher.
          - **3:** a clear 5E flow with some student investigation.
          - **2:** mostly teacher-led with one activity.
          - **1:** lecture and notes only.

          ### 3. Investigation and tools
          - **4:** a well-designed experiment or simulation with a POE worksheet, safety notes and an offline backup.
          - **3:** a good investigation with minor gaps.
          - **2:** a demonstration only.
          - **1:** no investigation.

          ### 4. Differentiation and inclusion
          - **4:** three accurate reading levels, targeted remediation and a stretching extension.
          - **3:** two levels or one support strategy and one extension.
          - **2:** a single generic support idea.
          - **1:** no differentiation.

          ### 5. Assessment quality
          - **4:** hinge questions, exit ticket and board-style test that tests application, with a clear marking scheme.
          - **3:** good assessment with minor issues.
          - **2:** mainly recall questions.
          - **1:** no assessment planned.

          ### 6. Responsible AI use
          - **4:** prompts shared, outputs verified and corrected, no personal data, clear student AI rules.
          - **3:** AI used and checked, with minor gaps.
          - **2:** AI output used with little checking.
          - **1:** unverified AI content or personal data used.

          **Strong module:** 18 or more out of 24, with no criterion below 2.
        `),
        points([
          "Inquiry beats instruction: phenomenon, explore, then explain",
          "RTCCO prompts give board-ready drafts — you check and decide",
          "Simulations complement real labs",
          "Assess for misconceptions during the lesson, not only at the end",
          "Differentiate the path, not the goal",
          "Teach students to question claims and use AI to think, not to copy",
        ], "What you’ve learned"),
        tip("Ready for certification", "Finish this lesson, then take the **25-question exam** (45 minutes, 70% to pass) to earn your **AI-Empowered Science Educator** certificate."),
        reflect("Score your own draft module with this rubric. Which criterion will you improve first?"),
      ]),
    ]),
  ],
};

export const SCIENCE_COURSE: Course = {
  id: SCIENCE_COURSE_ID,
  programId: SCIENCE_PROGRAM_ID,
  price: 450,
  title: "Empowering Indian Science Educators: Generative AI & Active Pedagogy (Classes 5–10, CBSE & ICSE)",
  category: "AI Tools for Teachers",
  hours: 12,
  level: "Intermediate",
  blurb: "5E lesson design, PhET and OLabs, competency-based questions and responsible AI — for CBSE and ICSE science teachers of Classes 5 to 10.",
  ...content,
};
