import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Free · Beginner · 5 hours — preventive, relationship-based classroom management. */
export const POSITIVE_BEHAVIOR: Content = {
  instructor: { name: "Priya Raman", title: "Classroom Culture Coach" },
  overview: `Most disruptions are prevented, not punished. This course shows you how to build **relationships, routines and clear expectations** that make your classroom calm, predictable and focused on learning, even with 50+ students.

You’ll learn why behaviour happens, how to teach routines like content, how to use praise that works, how to respond to disruptions without stopping the lesson, and how to repair relationships after a difficult moment. We also cover what Indian law says: physical punishment and mental harassment are prohibited under the RTE Act, so this course gives you effective alternatives.`,
  outcomes: [
    "Explain behaviour in terms of what a student is trying to get or avoid",
    "Design, teach and practise three essential classroom routines",
    "Use behaviour-specific praise and a 4:1 positive-to-correction ratio",
    "Respond to minor disruptions with least-invasive strategies",
    "De-escalate conflict and hold a restorative repair conversation",
    "Partner with parents and colleagues on persistent behaviour concerns",
  ],
  modules: [
    mod("m1", "Understanding behaviour", [
      lesson("why-behaviour", "Why students behave the way they do", 20, [
        text(`
          ## Behaviour is communication

          Almost all behaviour serves a **purpose**. A student is usually trying to **get** something (attention, a turn, control, a feeling of success) or **avoid** something (a hard task, embarrassment, a peer).

          When you identify the purpose, you can teach a better way to meet the same need.

          ## The ABC lens

          - **A**ntecedent: what happened just before? (a difficult reading task, a teasing comment)
          - **B**ehaviour: what exactly did the student do? (describe it, don’t label it)
          - **C**onsequence: what happened next? (the student was sent out and so *avoided* the reading)
        `),
        scenario("The pencil sharpener", `Every time a writing task starts, Ravi gets up to sharpen his pencil, chats on the way, and returns after 5 minutes. Being sent to the corner hasn’t helped.

Looking at the ABC: writing tasks (A) → leaves his seat (B) → avoids writing for 5+ minutes (C). Ravi is **avoiding** writing, perhaps because he finds it hard. Pre-sharpened pencils, a sentence starter and a shorter first target address the real need.`),
        quiz(
          "A student who finds reading difficult often clowns around when reading starts and is sent out. What is likely keeping this behaviour going?",
          ["Being sent out lets the student avoid the reading", "The student wants to be punished", "The student has no reason for the behaviour", "The reading is too easy"],
          "If the consequence removes the hard task, the behaviour is being rewarded. Change the support, not just the punishment.",
        ),
      ]),
      lesson("relationships", "Relationships first", 20, [
        text(`
          ## Students work for teachers they trust

          Research on classroom management consistently shows that **warm, consistent relationships** reduce disruptions. Students who feel known are more likely to accept correction.

          ## Small daily habits

          - **Greet at the door** by name, every day
          - Learn something about each student: a hobby, a cricket team, a sibling
          - Use the **2×10 strategy** for a student you struggle with: talk for 2 minutes about anything non-academic, 10 days in a row
          - Notice and mention effort, not just results
        `),
        tip("Names in a large class", "With 50–60 students, use a seating chart for the first two weeks and make a point of using five new names in every lesson."),
        reflect("Which student do you know least well? What will you talk to them about this week?"),
      ]),
      lesson("law-and-ethics", "What Indian law says", 15, [
        text(`
          ## Corporal punishment is prohibited

          **Section 17 of the Right of Children to Free and Compulsory Education (RTE) Act, 2009** prohibits **physical punishment and mental harassment** of children, and makes it a punishable offence.

          The **National Commission for Protection of Child Rights (NCPCR)** guidelines define corporal punishment broadly to include:

          - **Physical punishment:** hitting, making students stand or kneel for long periods, ear-pulling, “murga” position
          - **Mental harassment:** sarcasm, humiliation, name-calling, shaming in front of peers
          - **Discrimination:** treating students differently based on caste, gender, religion, disability or background

          Schools are expected to have a **grievance mechanism** and a monitoring cell.
        `),
        warn("Not just illegal, ineffective", "Punishment may stop behaviour for a moment, but it damages trust, increases anxiety and dropout risk, and doesn’t teach the student what to do instead."),
        quiz(
          "Under NCPCR guidelines, which of these counts as corporal punishment?",
          ["Publicly mocking a student’s mistake to make an example of them", "A private conversation about expectations", "Moving a student’s seat closer to the teacher", "Calling home to work out a plan together"],
          "Mental harassment, including humiliation and sarcasm, is included alongside physical punishment.",
        ),
        resource("NCPCR: National Commission for Protection of Child Rights", "https://ncpcr.gov.in", "Guidelines on eliminating corporal punishment in schools"),
      ]),
    ]),

    mod("m2", "Prevention first", [
      lesson("expectations", "Setting clear expectations", 20, [
        text(`
          ## Three to five positive expectations

          Write expectations as what students **should do**, not what they shouldn’t:

          - “Be respectful: listen when others speak.”
          - “Be responsible: bring your materials and start the warm-up.”
          - “Be safe: walk in the corridor.”

          ## Make them concrete

          For each expectation, show what it **looks like and sounds like** in different settings: during teacher talk, group work, the assembly line.
        `),
        tip("Co-create", "Ask the class: “What does a classroom where everyone can learn look like?” Students follow rules they helped write."),
        quiz(
          "Which is the best way to phrase a classroom expectation?",
          ["Raise your hand and wait to be called on", "Don’t shout out", "No talking ever", "Bad behaviour will be punished"],
          "Positive, specific statements tell students exactly what to do.",
        ),
      ]),
      lesson("routines", "Teaching routines that stick", 25, [
        text(`
          ## Teach routines like content

          Entering the room, transitions, distributing materials and getting help are **skills**. Teach them explicitly:

          1. Explain **why** the routine matters
          2. **Model** it, including a non-example
          3. **Practise** it, and practise again if it isn’t right
          4. **Reinforce** it with specific praise
          5. **Re-teach** it after holidays or when it slips

          ## Three routines that save the most time

          - **Entry and warm-up:** a task on the board every day, so learning starts in the first minute
          - **Attention signal:** raised hand, clap pattern or countdown, used every time
          - **Materials:** row monitors hand out and collect notebooks in under a minute
        `),
        tip("Narrate the positive", "“I see row 3 already has notebooks open” reinforces the routine without calling anyone out."),
        quiz(
          "When is the best time to teach a transition routine?",
          ["In the first weeks, explicitly and with practice", "After it goes wrong", "Only when the principal visits", "Never; students pick it up naturally"],
          "Explicit early teaching and practice prevent most transition problems.",
        ),
      ]),
      lesson("environment", "Classroom layout and large classes", 15, [
        text(`
          ## The room teaches too

          - Make sure you can **see every student** and **reach every row** within a few steps
          - Leave walking lanes so you can circulate during practice
          - Seat students who need support where you naturally pass by, not always at the very front
          - Keep displays useful: today’s objective, routines, key vocabulary

          ## Managing 50+ students

          - Use **row or bench captains** for materials and attendance
          - Use **choral response** and **mini whiteboards** (or slates) so everyone answers, not just the front benches
          - Keep instructions short, one step at a time, with a visual on the board
        `),
        reflect("Sketch your classroom layout. Where are the ‘blind spots’ you rarely visit? How will you change your movement?"),
      ]),
      lesson("specific-praise", "Behaviour-specific praise", 15, [
        text(`
          ## Name the behaviour

          “Good job” is pleasant but vague. “You used the checklist to find your own mistake; that’s exactly what independent learners do” tells students **what to repeat**.

          ## The 4:1 ratio

          Aim for about **four positive interactions for every correction**. It changes the emotional climate of a room, and makes corrections land better.
        `),
        points(["Specific beats generic", "Aim for 4 positives for every correction", "Praise effort and strategy, not intelligence", "Private praise works for students who dislike attention"]),
        reflect("Write three behaviour-specific praise statements you could use tomorrow."),
      ]),
    ]),

    mod("m3", "Responding calmly", [
      lesson("minor-disruptions", "Handling minor disruptions", 25, [
        scenario("Calling out", "During a discussion, Leo keeps calling out answers. Other students start to tune out."),
        text(`
          ## Least-invasive first

          1. **Planned ignoring** for attention-seeking behaviour that isn’t harmful
          2. **Proximity:** move near the student while continuing to teach
          3. **Non-verbal cue:** a hand signal you’ve pre-taught
          4. **Quiet redirect:** “Leo, hand up please; I want to hear your idea.”
          5. **Choice:** “You can answer with your hand up, or write it down for me. Your choice.”
          6. **Private follow-up** after the lesson

          Each step keeps the lesson moving and keeps the student’s dignity intact.
        `),
        tip("Take-up time", "After a redirect, turn away and give the student a few seconds to comply. Standing over them turns it into a public contest."),
        quiz(
          "What should you try first with Leo?",
          ["Move closer and use a pre-taught signal", "Send him out", "Stop the class to discuss it", "Take away games time for everyone"],
          "Least-invasive strategies correct behaviour without derailing learning.",
        ),
      ]),
      lesson("consequences", "Consequences that teach", 20, [
        text(`
          ## Logical, not punitive

          A good consequence is **related** to the behaviour, **respectful**, and **reasonable** in size:

          - Wasted class time → make up the work during a break
          - Damaged a book → help repair or cover it
          - Hurt a classmate’s feelings → a repair conversation and a plan

          ## Consistency matters more than severity

          Students learn quickly whether a warning means anything. A small, certain consequence works better than a big, unpredictable one.
        `),
        warn("Avoid", "Group punishment for one student’s behaviour, standing outside the class (it removes learning time and supervision), extra homework as punishment, or any humiliation."),
        quiz(
          "A student scribbles on a classmate’s notebook. Which consequence is most logical?",
          ["Help fix or replace the page, and agree on a plan", "Stand outside the class for the period", "Write “I will not scribble” 100 times", "Lose marks in the next test"],
          "Logical consequences connect directly to the harm and teach responsibility.",
        ),
      ]),
      lesson("de-escalation", "De-escalation when emotions run high", 20, [
        text(`
          ## When a student is upset or angry

          - **Stay calm** yourself: lower voice, slow speech, relaxed posture
          - **Give space**: don’t crowd or touch
          - **Acknowledge feelings**: “I can see you’re really upset.”
          - **Offer a simple choice**: “Do you want to sit by the window for two minutes, or get some water?”
          - **Delay the discussion**: “We’ll talk about it after class.”

          The goal in the moment is **safety and calm**, not winning the argument.
        `),
        note("Safety", "If a student may hurt themselves or others, follow your school’s safety procedure and call for support immediately. Never handle it alone."),
        reflect("What do you personally do when you feel your own frustration rising in class? What could help you pause?"),
      ]),
      lesson("repair", "Repairing after a tough moment", 20, [
        text(`
          ## Restore the relationship

          After a conflict, a short, private **repair conversation** matters more than the consequence:

          1. What happened?
          2. What were you thinking or feeling at the time?
          3. Who was affected, and how?
          4. What can we do to make it right?
          5. What will you do next time?

          These **restorative questions** help students take responsibility without shame.
        `),
        tip("Separate the deed from the doer", "“That choice wasn’t okay. You’re still welcome here, and I know you can do this.”"),
        reflect("Think of a recent tense moment. What would a repair conversation have sounded like?"),
      ]),
    ]),

    mod("m4", "Building a positive culture", [
      lesson("bullying", "Preventing bullying and building belonging", 20, [
        text(`
          ## Recognise bullying

          Bullying is **repeated**, **intentional** harm where there is a **power imbalance**. It can be physical, verbal, social (exclusion, rumours) or online (WhatsApp groups, social media).

          ## Prevention

          - Make belonging visible: mixed seating, rotating groups, every student has a role
          - Teach and practise **upstander** behaviour: what to say, who to tell
          - Supervise hotspots: corridors, toilets, buses, unsupervised breaks
          - Respond to every report seriously and follow up
        `),
        quiz(
          "Which situation best fits the definition of bullying?",
          ["A group repeatedly excludes one student and spreads rumours about them online", "Two friends argue once over a cricket score", "A student disagrees with the teacher’s answer", "A student is upset after losing a game"],
          "Bullying involves repetition, intent and a power imbalance.",
        ),
      ]),
      lesson("parents", "Working with parents and colleagues", 20, [
        text(`
          ## Call home with good news first

          Make your first contact with each family **positive**. When a problem comes later, you already have a partnership.

          ## When a concern persists

          1. Describe the **behaviour** factually, with examples and dates
          2. Share what you’ve already tried
          3. Ask what works at home
          4. Agree on **one** goal and how you’ll communicate progress
          5. Involve the counsellor or coordinator if needed
        `),
        tip("Mind your words", "Say “He’s struggling to stay seated during writing,” not “He’s a troublemaker.” Labels make parents defensive; descriptions invite help."),
        reflect("Write a positive message you could send to one family this week."),
      ]),
      lesson("wellbeing", "Teacher wellbeing and your behaviour plan", 20, [
        text(`
          ## You set the weather

          A calm, rested teacher handles disruption far better. Protect small routines for yourself: a short break, a colleague to talk to, a realistic to-do list.

          ## Your one-page behaviour plan

          - My **3–5 expectations**
          - My **3 key routines** and when I’ll teach them
          - My **attention signal**
          - My **least-invasive ladder** of responses
          - My **repair** questions
          - Who I go to for **support**
        `),
        points([
          "Behaviour is communication: find the purpose",
          "Relationships and routines prevent most problems",
          "Praise specifically; correct quietly",
          "Corporal punishment and humiliation are prohibited and ineffective",
          "Repair the relationship after conflict",
        ], "Course summary"),
        resource("PBIS: Positive Behavioral Interventions & Supports", "https://www.pbis.org", "Research-based framework and free classroom resources"),
        reflect("Draft your one-page behaviour plan. What will you teach on day one?"),
      ]),
    ]),
  ],
};
