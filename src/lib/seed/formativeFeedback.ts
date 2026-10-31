import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, points, scenario, reflect, resource, quiz } = kit();

/** Premium · Intermediate · 4 hours — formative assessment and high-impact feedback. */
export const FORMATIVE_FEEDBACK: Content = {
  instructor: { name: "Priya Raman", title: "Classroom Culture Coach" },
  overview: `Formative assessment is one of the most powerful, best-researched ways to raise achievement, and it costs almost nothing. The idea is simple: **find out what students understand during learning, and adjust**.

This course gives you quick, practical routines that work in real Indian classrooms, including large classes with few devices: learning intentions and success criteria, hinge questions, mini whiteboards, exit tickets, feedback that students actually use, peer feedback protocols and time to act on feedback.`,
  outcomes: [
    "Explain the five key strategies of formative assessment",
    "Write learning intentions and success criteria students understand",
    "Use hinge questions and all-student response techniques to check understanding",
    "Give feedback that is timely, specific and actionable",
    "Run a structured 5–10 minute peer-feedback routine",
    "Build dedicated time for students to act on feedback",
  ],
  modules: [
    mod("m1", "Foundations of formative assessment", [
      lesson("what-is-fa", "What formative assessment really is", 20, [
        text(`
          ## Assessment *for* learning

          **Summative** assessment measures learning at the end (unit tests, board exams). **Formative** assessment gathers evidence **during** learning so teachers and students can decide what to do next.

          It’s not a type of test. The same quiz is formative if you use the results to adjust teaching, and summative if you only record the marks.

          ## The research

          Paul Black and Dylan Wiliam’s influential 1998 review, *Inside the Black Box*, found that strengthening formative assessment produced significant learning gains, with particularly large benefits for lower-attaining students. Later syntheses, including the Education Endowment Foundation’s toolkit, rate feedback among the highest-impact, lowest-cost approaches.
        `),
        note("NEP 2020", "NEP 2020 calls for regular, formative, competency-based assessment that “tests higher-order skills, such as analysis, critical thinking, and conceptual clarity” instead of rote memorisation."),
        quiz(
          "What makes an assessment formative?",
          ["The evidence is used to adjust teaching and learning", "It has no marks", "It happens at the end of the year", "It is always multiple choice"],
          "Formative is about how evidence is used, not the format of the task.",
        ),
      ]),
      lesson("five-strategies", "The five key strategies", 20, [
        text(`
          ## Dylan Wiliam’s framework

          1. **Clarify learning intentions and success criteria:** where are we going?
          2. **Engineer effective discussions and tasks** that reveal understanding: where are students now?
          3. **Provide feedback that moves learning forward:** how do we get there?
          4. **Activate students as resources for one another:** peer assessment
          5. **Activate students as owners of their own learning:** self-assessment

          The rest of this course gives you practical routines for each one.
        `),
        reflect("Which of the five strategies is strongest in your teaching now, and which is weakest?"),
      ]),
      lesson("intentions-criteria", "Learning intentions and success criteria", 20, [
        text(`
          ## Learning intention: what we are learning

          “We are learning to compare fractions with different denominators.”

          Focus on **learning**, not the activity (“We are doing worksheet 4” is an activity).

          ## Success criteria: how we’ll know

          - “I can find a common denominator.”
          - “I can explain which fraction is larger, using a diagram or numbers.”

          ## Make them useful

          - Show them on the board and **refer back** during the lesson
          - Co-create criteria by analysing a good example with students
          - Use them for self-check before handing work in
        `),
        quiz(
          "Which is a learning intention rather than an activity?",
          ["We are learning to explain how the monsoon affects farming", "We are completing page 42", "We are watching a video", "We are working in groups today"],
          "Learning intentions describe the learning, not the task.",
        ),
      ]),
    ]),

    mod("m2", "Checking understanding in real time", [
      lesson("all-response", "Every student answers", 20, [
        text(`
          ## Stop asking the same five students

          “Hands up” lets the most confident students answer while others switch off. Better options:

          - **Mini whiteboards or slates:** everyone writes, everyone holds up on “3, 2, 1, show”
          - **Finger voting:** 1–4 fingers for options A–D
          - **ABCD cards:** four coloured cards per student, reusable all year
          - **No hands up, cold calling with names on sticks:** anyone may be asked, with think time first
          - **Think–pair–share:** every student rehearses an answer with a partner before sharing
        `),
        tip("Low-cost in large classes", "A laminated A4 sheet works as a whiteboard; chalk slates work too. With 60 students you can scan the room in under 10 seconds."),
        scenario("A quick check", `Ms. Deepa asks her Class 6 class of 55: “Which is heavier: a kilogram of cotton or a kilogram of iron? A, B or C (same).” Students show finger votes. 20 choose iron, so she stops and runs a two-minute discussion before moving on.`),
      ]),
      lesson("hinge-questions", "Hinge questions", 20, [
        text(`
          ## A decision point in the lesson

          A **hinge question** is a quick question at a key moment that tells you whether to **move on, recap or split the class**. Good hinge questions:

          - Take students **under a minute** to answer
          - Let you see everyone’s answer in **seconds**
          - Have distractors based on **misconceptions**, so wrong answers tell you why

          ## Decide in advance

          Decide your rule before you ask: “If more than 80% are right, move on; otherwise re-teach with a new example.”
        `),
        quiz(
          "What makes a good hinge question?",
          ["Quick to answer, quick to read, with misconception-based wrong options", "A long essay question", "A question only the top students can answer", "A question with no wrong answers"],
          "Hinge questions are designed for fast, diagnostic decisions mid-lesson.",
        ),
        reflect("Write a hinge question for the key moment in your next lesson. What will you do if half the class gets it wrong?"),
      ]),
      lesson("exit-tickets", "Exit tickets and quick quizzes", 15, [
        text(`
          ## Exit tickets

          Two or three questions at the end of a lesson, on a slip of paper or in a notebook corner:

          - One question checking the **core idea**
          - One requiring **application**
          - Optional: “What is still confusing?”

          Sort them into three piles (got it / nearly / not yet) and use the piles to **plan tomorrow’s warm-up and groups**.

          ## Digital options

          Google Forms, Kahoot! and Mentimeter give instant summaries when devices are available. **Plickers** works with one teacher phone and printed cards, ideal for classes without student devices.
        `),
        resource("Plickers", "https://get.plickers.com", "Instant class checks with printed cards and one teacher device"),
        resource("Mentimeter", "https://www.mentimeter.com", "Live polls and word clouds"),
      ]),
    ]),

    mod("m3", "Feedback that moves learning", [
      lesson("feedback-qualities", "Timely, specific, actionable", 20, [
        text(`
          ## Three questions every piece of feedback answers

          Hattie and Timperley’s widely cited model says effective feedback addresses:

          1. **Where am I going?** (the goal)
          2. **How am I going?** (progress towards it)
          3. **Where to next?** (the next step)

          ## Focus on the task and the process

          Feedback about the **task** (“Your conclusion doesn’t refer to the data”) and the **process** (“Try checking each step against the success criteria”) helps. Praise about the **person** (“You’re so clever”) does little for learning.
        `),
        points([
          "Feedback during learning beats grades after it",
          "One clear next step beats ten comments",
          "Focus on the task and the strategy, not the person",
          "Build in time to act on it",
        ]),
        quiz(
          "Which comment is most likely to improve the next draft?",
          ["Your claim is clear. Now explain how your second quotation supports it.", "Good work!", "7/10", "You are very intelligent."],
          "It names a strength and gives one specific, actionable next step.",
        ),
      ]),
      lesson("comments-grades", "Comments, grades and motivation", 15, [
        text(`
          ## When grades get in the way

          Research by Ruth Butler and others found that when students receive **a grade alongside comments**, many look at the grade and ignore the comment. Comment-only feedback on drafts often leads to more improvement.

          ## Practical approach

          - On **drafts and practice work**: comments or rubric levels, no marks
          - On **final work**: marks plus a brief note on what to carry forward
          - Use codes (e.g. “E = add evidence”) to save time in large classes
        `),
        tip("Feedback codes", "Write 4–6 codes on the board (S = spelling, E = add evidence, U = show units). Mark with codes; students look up and fix. It saves you writing the same comment 50 times."),
        reflect("For your next assignment, will you give marks, comments, or both? Why?"),
      ]),
      lesson("whole-class-feedback", "Whole-class feedback for large classes", 20, [
        text(`
          ## Mark smarter, not longer

          Instead of writing comments on 50 notebooks:

          1. Read through the work and note **common strengths**, **common errors** and **misconceptions**
          2. Pick 2–3 anonymous **examples** to show the class
          3. Next lesson: share the feedback sheet, model a correction, then students **fix their own work**

          This takes far less time than individual comments and gives every student actionable feedback.
        `),
        scenario("Whole-class feedback in practice", `Mr. Imran teaches 4 sections of Class 8 maths. After a test on linear equations he notices three common errors. He makes a one-page sheet: “3 things done well, 3 common mistakes, with a worked example of each.” Students find which mistakes they made and redo those questions. The process takes 15 minutes of class time.`),
        quiz(
          "What is the main advantage of whole-class feedback?",
          ["Every student gets actionable feedback quickly, and common errors are re-taught", "Students never see their own work again", "It replaces all individual support", "It removes the need for marking at all"],
          "It focuses on patterns and makes sure students act on feedback efficiently.",
        ),
      ]),
    ]),

    mod("m4", "Students as feedback partners", [
      lesson("peer-feedback", "Peer feedback routines", 20, [
        text(`
          ## Two Stars and a Wish

          Partners give two specific strengths and one improvement, **linked to the success criteria**.

          ## A 5-minute routine

          1. Swap work with a partner
          2. Read with **one criterion** in mind
          3. Write one “star” and one “wish” using sentence starters
          4. Return, read, and ask one clarifying question
          5. Revise

          ## Make it safe and useful

          - Model good and poor feedback first
          - Use sentence starters (“I noticed…”, “Could you…”, “What if…”)
          - Keep it focused on the work, never the person
        `),
        tip("Calibrate", "Before peer review, give feedback on one anonymous sample together as a class."),
      ]),
      lesson("self-assessment", "Self-assessment and student ownership", 15, [
        text(`
          ## Students check before you do

          - **Traffic lights:** students mark their work green / amber / red against each success criterion
          - **Checklists** for longer tasks
          - **Learning logs:** “Today I learned… I’m still unsure about… Next I will…”

          Self-assessment builds the habits of independent learners, and gives you quick information about who needs help.
        `),
        reflect("Design a self-assessment checklist for a task your students will do this week."),
      ]),
      lesson("close-the-loop", "Closing the feedback loop", 20, [
        text(`
          ## Feedback is only useful if it is used

          Plan **Dedicated Improvement and Reflection Time (DIRT)**: protected time in class for students to act on feedback.

          - Correct errors and redo questions
          - Improve one paragraph using the comment
          - Answer a follow-up question you wrote

          Ask students to use a different colour pen so you (and they) can see the improvement.
        `),
        tip("Feedback Friday", "Reserve 10 minutes for students to revise one thing based on feedback, and highlight what they changed."),
        points([
          "Share learning intentions and success criteria",
          "Use all-student response and hinge questions to check understanding",
          "Give specific, actionable feedback; use whole-class feedback to save time",
          "Train students to give peer and self-feedback",
          "Always build in time to act on feedback",
        ], "Course summary"),
        quiz(
          "What is the purpose of DIRT (Dedicated Improvement and Reflection Time)?",
          ["To give students protected class time to act on feedback", "To give extra homework", "To mark work more quickly", "To replace teaching time with tests"],
          "Feedback changes learning only when students act on it.",
        ),
        reflect("How will you make sure students act on the next round of feedback you give?"),
      ]),
    ]),
  ],
};
