import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Free · Beginner · 5 hours — designing and using rubrics that measure thinking. */
export const ACTIVE_RUBRICS: Content = {
  instructor: { name: "Samuel Okafor", title: "Assessment Specialist" },
  overview: `A good rubric tells students exactly what success looks like **before** they start. It makes grading fairer and faster, and turns feedback into something students can act on.

This course walks you through designing rubrics that measure **thinking and skill**, not just neatness and compliance. You’ll turn learning outcomes into criteria, write clear performance levels, choose between analytic, holistic and single-point rubrics, and use rubrics for self- and peer-assessment. You’ll also connect rubric evidence to the Holistic Progress Card approach in NEP 2020.

By the end you’ll have a finished, tested rubric for a real assignment in your subject.`,
  outcomes: [
    "Turn a learning outcome into 3–5 observable criteria",
    "Write performance-level descriptors that describe quality, not quantity",
    "Choose between analytic, holistic and single-point rubrics for a task",
    "Calibrate scoring with colleagues so marks are consistent",
    "Use rubrics for student self- and peer-assessment",
    "Turn rubric results into feedback, re-teaching and progress reports",
  ],
  modules: [
    mod("m1", "Rubric foundations", [
      lesson("why-rubrics", "Why rubrics matter", 15, [
        text(`
          ## A rubric is a promise

          A rubric is a scoring guide that lists the **criteria** for a piece of work and describes **levels of quality** for each one. Shared at the start, it tells students, “This is what good looks like, and this is how I will judge it.”

          ## What good rubrics do

          - Make expectations **visible** to students and parents
          - Make marking **more consistent** across students, sections and teachers
          - Make feedback **faster**: circle a descriptor instead of writing the same comment 40 times
          - Help students **assess their own work** before they hand it in
        `),
        note("NEP 2020 and assessment", "NEP 2020 calls for a shift from rote, summative testing towards regular, formative, competency-based assessment. Rubrics are one of the simplest tools to make that shift in a real classroom."),
        quiz(
          "When is a rubric most useful to students?",
          ["When it is shared and discussed before they start the task", "Only after marks are announced", "When it is kept secret to prevent copying", "Only for board exam classes"],
          "Students can only aim for success criteria they know about. Share rubrics early.",
        ),
      ]),
      lesson("objective-to-criteria", "From learning outcome to criteria", 20, [
        text(`
          ## Start with the verb

          Look at the outcome’s verb (*analyse*, *justify*, *design*, *compare*) and ask: **what would I see or hear** if a student did this well?

          Those observable qualities become your **criteria**. Most tasks need **3 to 5 criteria**. Fewer is too vague; more is hard to use.

          ## Use Bloom’s revised taxonomy

          Bloom’s levels (Remember, Understand, Apply, Analyse, Evaluate, Create) help you check that your criteria match the thinking the outcome asks for. If the outcome says *evaluate*, a criterion like “lists facts” is too low.
        `),
        scenario("Outcome → criteria", `Outcome: “Students justify a claim using evidence from a text.”

Criteria might be:

- **Claim:** clear and answers the question
- **Evidence:** relevant, accurate quotations or facts from the text
- **Reasoning:** explains *how* the evidence supports the claim
- **Communication:** organised and readable`),
        warn("Avoid compliance criteria", "“Neat handwriting”, “submitted on time” and “500 words” are easy to score but don’t show the target skill. Track them separately if you must, not inside the rubric score."),
        quiz(
          "Which criterion best matches “students can design a fair experiment”?",
          ["Identifies and controls variables", "Report is typed", "Uses colourful diagrams", "Submitted before Friday"],
          "Controlling variables is the core of a fair test. The others are about presentation or compliance.",
        ),
      ]),
      lesson("levels-descriptors", "Writing performance levels", 25, [
        text(`
          ## Three or four levels work best

          For example: **Beginning → Developing → Proficient → Advanced**. Four levels avoid a “safe middle” and give useful distinctions.

          ## Describe quality, not quantity

          - Weak: “Uses 3 pieces of evidence” / “Uses 2 pieces of evidence”
          - Strong: “Explains how **each** piece of evidence supports the claim” / “Lists evidence but the link to the claim is unclear”

          ## Write in student-friendly language

          Use “I can…” statements or simple sentences students can read on their own. For younger classes add an icon or example.
        `),
        tip("Write proficient first", "Describe the **proficient** level first, the standard you expect, then adjust up and down. It keeps the whole rubric anchored to your goal."),
        text(`
          ## A descriptor checklist

          - Is it **observable**? Could two teachers agree?
          - Does each level differ in **one clear way** from the next?
          - Does it avoid vague words like *good*, *nice*, *some*, *excellent*?
          - Does it describe what the student **does**, not what they lack?
        `),
        quiz(
          "Which descriptor best describes quality rather than quantity?",
          ["Explains clearly how each piece of evidence supports the claim", "Includes at least five quotations", "Writes three full pages", "Uses many difficult words"],
          "Quality descriptors focus on how well the skill is shown, not how much is produced.",
        ),
        reflect("Pick one assignment you’ll mark this month. Draft the “Proficient” descriptor for its most important criterion."),
      ]),
    ]),

    mod("m2", "Choosing the right rubric", [
      lesson("rubric-types", "Analytic, holistic and single-point", 20, [
        text(`
          ## Analytic rubric

          Scores **each criterion separately** in a grid. Best for detailed **feedback** and for showing students exactly what to improve. Takes longer to mark.

          ## Holistic rubric

          One overall score with a description for each level. **Faster**, useful for quick checks, timed writing or large classes, but gives less targeted feedback.

          ## Single-point rubric

          Lists only the **proficient** description for each criterion, with two empty columns: “Areas for growth” and “Evidence of exceeding”. Simple to make, easy for students to read, and pushes you to write specific comments.
        `),
        scenario("Matching type to task", `- End-of-unit project that students will revise → **analytic**
- 10-minute daily journal writing for 55 students → **holistic**
- Lab report draft that you’ll discuss one-to-one → **single-point**`),
        quiz(
          "You want students to know exactly which part of their essay to revise. Which rubric type fits best?",
          ["Analytic", "Holistic", "None; just give a mark", "A checklist of formatting rules"],
          "Analytic rubrics score each criterion separately, so students see which part needs work.",
        ),
      ]),
      lesson("rubrics-for-tasks", "Rubrics for projects, presentations and practicals", 25, [
        text(`
          ## Projects

          Separate the **product** (accuracy, depth) from the **process** (planning, collaboration, use of sources). Keep group and individual criteria separate so one student isn’t marked for another’s work.

          ## Oral presentations and viva

          Useful criteria: *content accuracy*, *organisation*, *use of evidence*, *responding to questions*. Avoid scoring confidence or accent, which penalises shy students and second-language speakers.

          ## Science practicals and art/craft

          Focus on **skills you taught**: following a procedure safely, recording observations, drawing conclusions; or for art, use of technique and intention, not “talent”.
        `),
        warn("Language vs content", "When assessing science or social science, don’t let spelling or English grammar lower the content score. If language matters, make it a separate criterion."),
        reflect("Which kind of task do you find hardest to mark fairly? Draft two criteria for it now."),
      ]),
      lesson("build-your-rubric", "Workshop: build your first rubric", 30, [
        text(`
          ## Step by step

          1. Write the **learning outcome** at the top.
          2. Choose the **rubric type** (analytic, holistic or single-point).
          3. List **3–5 criteria** from the outcome’s verbs.
          4. Write the **proficient** descriptor for each criterion.
          5. Write the levels above and below.
          6. Test it on **two real samples** of student work. Can you place each one quickly?
          7. Rewrite any descriptor that made you hesitate.
        `),
        tip("Use AI as a drafting partner", "Prompt: “Draft a 4-level analytic rubric for this outcome: [outcome], for Class [x]. Use student-friendly language and describe quality, not quantity.” Then edit it heavily with your own judgement."),
        reflect("Paste or write your finished rubric here. Note one descriptor you changed after testing it on student work."),
      ]),
    ]),

    mod("m3", "Fair and consistent marking", [
      lesson("calibration", "Calibration and moderation", 20, [
        text(`
          ## Why the same rubric gives different marks

          Two teachers can read “clear explanation” differently. **Calibration** (also called moderation) is how a department agrees on what each level looks like.

          ## A 30-minute calibration meeting

          1. Each teacher marks the **same 3 anonymous samples** independently.
          2. Compare scores criterion by criterion.
          3. Discuss any gap of more than one level: what did each person see?
          4. Agree on **anchor samples** for each level and keep them.
          5. Clarify the descriptor wording if needed.
        `),
        note("Anchor papers", "Keep a folder of anonymised “anchor” samples for each level. New teachers can calibrate quickly, and you can show students what proficient looks like."),
        quiz(
          "Two teachers give the same essay 2/4 and 4/4 on “use of evidence”. What should happen next?",
          ["Discuss what each saw and agree on anchor examples", "Average the scores and move on", "The senior teacher’s mark wins", "Drop the criterion"],
          "Calibration discussions build shared understanding, which makes future marking consistent.",
        ),
      ]),
      lesson("bias", "Reducing bias in marking", 15, [
        text(`
          ## Common marking biases

          - **Halo effect:** a student’s past performance or behaviour colours today’s mark
          - **Handwriting and presentation:** neat work scores higher for the same content
          - **Order effects:** the 30th script is marked more harshly than the 3rd
          - **Language bias:** content marks drop for students writing in a second language

          ## Simple fixes

          - Mark **anonymously** where possible (roll numbers on the back)
          - Mark **one criterion across all scripts**, then the next
          - Take breaks and re-check the first few scripts at the end
          - Keep language as its own criterion
        `),
        reflect("Which bias do you think affects your marking most? What one change will you try?"),
      ]),
    ]),

    mod("m4", "Rubrics as learning tools", [
      lesson("self-peer", "Self- and peer-assessment with rubrics", 25, [
        text(`
          ## Make the rubric a learning tool

          1. Share it **before** the task and read it together.
          2. Show **anonymous examples** at different levels; let students place them.
          3. Have students **highlight** the descriptor that matches their own draft.
          4. Pair students for peer review using **one or two criteria** only.
          5. Give time to **revise** before final submission.

          ## Peer feedback sentence starters

          - “You met this criterion when you…”
          - “To reach the next level, you could…”
          - “I was confused when…”
        `),
        tip("Calibrate students too", "Score one sample together as a class before peer review. It dramatically improves the quality of peer feedback."),
        scenario("Large class peer review", `Ms. Lakshmi has 58 students. She uses a single-point rubric with just two criteria. Students swap notebooks with the person behind them, write one “glow” and one “grow” in 6 minutes, and then revise for 10 minutes. She collects 10 notebooks a day to spot-check.`),
        quiz(
          "What makes peer assessment with rubrics most effective?",
          ["Practising on a sample together first and focusing on one or two criteria", "Letting students give marks out of 100", "Using all criteria at once without guidance", "Skipping the revision step"],
          "Calibration and focus make peer feedback specific and usable.",
        ),
      ]),
      lesson("feedback-reteach", "From rubric scores to feedback and re-teaching", 20, [
        text(`
          ## Read the class pattern

          After marking, tally how many students reached each level **per criterion**. If 60% are at “Developing” on *reasoning*, that’s not 30 individual problems. It’s one re-teaching lesson.

          ## Feedback students can act on

          Circle the current level, then write **one next step** that moves the student to the next level. Give 10 minutes in class to act on it.
        `),
        points([
          "Tally levels per criterion to find class-wide gaps",
          "Re-teach the weakest criterion to the whole class",
          "One next step per student beats ten comments",
          "Give class time to act on feedback",
        ]),
      ]),
      lesson("hpc-grades", "Rubrics, grades and the Holistic Progress Card", 20, [
        text(`
          ## Rubric levels are not percentages

          A 3/4 on a rubric does **not** mean 75%. If you must convert to marks, decide a conversion table in advance and apply it the same way for every student. A common approach: Advanced = A, Proficient = B…

          ## Connecting to the Holistic Progress Card (HPC)

          NCERT’s PARAKH has developed **Holistic Progress Cards** that report progress across cognitive, socio-emotional and physical domains, using teacher, self and peer assessment. Rubric evidence fits naturally:

          - Rubric descriptors give you **specific language** for HPC remarks
          - Self-assessment against a rubric feeds the **self-reflection** sections
          - Peer rubrics feed the **peer feedback** sections
        `),
        resource("NCERT PARAKH", "https://ncert.nic.in/parakh/", "National assessment centre: Holistic Progress Card templates and guidance"),
        quiz(
          "A student scores 3 out of 4 levels on a rubric. What does this tell you?",
          ["They reached the proficient level described in the rubric", "They scored exactly 75%", "They failed the task", "Nothing useful"],
          "Rubric levels describe quality of performance; converting to percentages needs a planned, consistent table.",
        ),
        reflect("How will you introduce your next rubric so students actually use it, before, during and after the task?"),
      ]),
    ]),
  ],
};
