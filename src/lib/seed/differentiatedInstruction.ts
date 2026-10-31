import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Premium · Intermediate · 8 hours — differentiation and inclusion for diverse, large classes. */
export const DIFFERENTIATED_INSTRUCTION: Content = {
  instructor: { name: "Elena Marquez", title: "Inclusive Practice Specialist" },
  overview: `In every class, students differ in what they already know, how fast they read, which language they think in, and what interests them. Differentiation means planning so that **every learner reaches the same important goal** by different paths, without writing three separate lesson plans.

This course covers the core ideas (readiness, interest, learner profile), practical strategies (tiered tasks, flexible grouping, scaffolding, choice boards), and the frameworks behind inclusive teaching: Universal Design for Learning (UDL 3.0), Teaching at the Right Level, multilingual teaching under NEP 2020, and supporting students with disabilities under the RPwD Act. Everything is designed for real Indian classrooms, including large and multigrade classes.`,
  outcomes: [
    "Use pre-assessment to identify students’ readiness",
    "Differentiate content, process and product while keeping the goal the same",
    "Design tiered tasks and scaffolds for a single learning outcome",
    "Group students flexibly based on evidence, not fixed labels",
    "Design choice boards and learning stations",
    "Apply UDL principles to plan for variability from the start",
    "Support multilingual learners, students with disabilities and advanced learners",
    "Manage differentiation in large and multigrade classrooms",
  ],
  modules: [
    mod("m1", "Why and what of differentiation", [
      lesson("what-is-di", "What differentiation is, and isn’t", 20, [
        text(`
          ## A definition

          Carol Ann Tomlinson, whose work shaped the field, describes differentiation as teachers **proactively** adjusting curriculum, teaching methods, resources and activities to address the diverse needs of individuals and small groups.

          ## It is

          - Planned in advance, based on **evidence** about students
          - Keeping **high expectations** and the same essential goal for all
          - Flexible: groups and supports change from lesson to lesson

          ## It isn’t

          - Three separate lesson plans every day
          - Giving “weak” students less or easier goals permanently
          - Fixed ability groups or labelling children
          - Extra worksheets for fast finishers
        `),
        quiz(
          "Which approach best reflects differentiation?",
          ["Same learning goal, with different levels of support and different routes to it", "Easier goals for some students all year", "Fixed groups by last year’s marks", "More of the same worksheet for fast finishers"],
          "Differentiation varies support and route, not the importance of the goal.",
        ),
      ]),
      lesson("three-dimensions", "Readiness, interest and learner profile", 20, [
        text(`
          ## What we respond to

          - **Readiness:** what a student currently knows and can do relative to the goal. This changes topic by topic.
          - **Interest:** topics and activities that engage the student
          - **Learner profile:** how a student works best: language, preferences for working alone or in groups, need for movement or quiet, cultural background

          ## A note on “learning styles”

          The idea that students learn better when taught in their preferred “style” (visual, auditory, kinaesthetic) is **not supported** by research. Using multiple representations helps **everyone**, but don’t label children as “visual learners” and teach them only one way.
        `),
        warn("Myth alert", "Matching teaching to a student’s supposed learning style does not improve results. Offer varied representations to all, and differentiate by readiness and need."),
        quiz(
          "Which dimension of differentiation changes most from topic to topic?",
          ["Readiness", "Learning style", "Name", "Seating row"],
          "A student may be ahead in fractions but need support in geometry. Readiness is topic-specific.",
        ),
      ]),
      lesson("pre-assessment", "Pre-assessment: finding out where students are", 20, [
        text(`
          ## Before the unit

          A short pre-assessment tells you who already knows what:

          - 5–8 questions from easy to hard on the unit’s key skills
          - A concept map or “What do you know about…?”
          - A quick task such as “Solve this, then explain how”

          ## Use it to plan, not to grade

          Sort results into **three rough groups** for the first lessons: needs foundations, ready, and ready for more. Re-check often; groups should change.
        `),
        scenario("Using a pre-check", `Before a Class 5 unit on decimals, Mr. Sanjay gives a 6-question pre-check. 12 students can’t place 0.5 on a number line, 30 manage the basics, and 8 already add decimals correctly. His first three lessons use a shared hook, then three different practice tasks.`),
        reflect("Draft five pre-assessment questions for your next unit, from easiest to hardest."),
      ]),
    ]),

    mod("m2", "The core strategies", [
      lesson("three-levers", "Content, process, product", 25, [
        text(`
          ## Three levers

          - **Content:** what students learn *from* (texts at different reading levels, videos, manipulatives, home-language glossaries)
          - **Process:** how they make sense of it (guided group with teacher, peer work, worked examples, practice at different levels)
          - **Product:** how they show what they know (written answer, diagram, oral explanation, model, poster)

          Keep the **learning goal and success criteria** constant; vary the lever that best serves your students.

          ## Plus: the learning environment

          Quiet corners, flexible seating, visual timetables and routines for working independently all make differentiation possible.
        `),
        quiz(
          "Which keeps the goal the same for everyone?",
          ["Tiered texts on the same concept", "Giving some students easier objectives", "Removing hard tasks for some", "Fixed ability groups"],
          "Tiered resources change the support, not the destination.",
        ),
      ]),
      lesson("tiered-tasks", "Tiered tasks", 30, [
        text(`
          ## One concept, three entry points

          Design the **core (on-level)** task first, then adjust:

          - **Tier 1 (more support):** worked example, partially completed table, word bank, fewer steps, concrete materials
          - **Tier 2 (core):** the grade-level task
          - **Tier 3 (more challenge):** less scaffolding, an unfamiliar context, a “why” or “what if” extension

          All tiers should be **equally interesting** and require **real thinking**. Tier 1 shouldn’t be colouring while others reason.
        `),
        scenario("Tiered maths task: area", `**Tier 1:** Count squares on a grid to find the area of three rectangles, then check with length × breadth.
**Tier 2:** Find the area of a classroom floor plan made of two rectangles.
**Tier 3:** A family has ₹3,000 for floor tiles that cost ₹50 per square foot. Design a room shape that uses the budget exactly. Is there more than one answer?`),
        tip("Don’t announce tiers", "Use neutral names (blue, green, orange tasks) and let groups change often. Students quickly notice and resist fixed “low” groups."),
        reflect("Take one task from your next lesson and write a Tier 1 and Tier 3 version."),
      ]),
      lesson("scaffolding", "Scaffolding and gradual release", 25, [
        text(`
          ## I do, we do, you do

          The **gradual release of responsibility** model moves from teacher modelling to independence:

          1. **I do:** teacher models and thinks aloud
          2. **We do:** guided practice together
          3. **You do together:** pair or group practice
          4. **You do alone:** independent practice

          Differentiation happens naturally: some students move to “you do alone” quickly, while others stay in a **guided group** with you longer.

          ## Scaffolds that fade

          Sentence starters, worked examples, graphic organisers, checklists, vocabulary cards. Plan how you’ll **remove** them over time.
        `),
        quiz(
          "What is the main purpose of a scaffold?",
          ["Temporary support that is gradually removed as the student gains independence", "A permanent easier version of the task", "A punishment for not finishing", "Extra homework"],
          "Scaffolds are temporary. The goal is independence.",
        ),
      ]),
      lesson("flexible-grouping", "Flexible grouping", 25, [
        text(`
          ## Groups based on evidence, for a purpose

          - **Readiness groups:** similar needs on today’s skill, for targeted teaching
          - **Mixed groups:** different strengths, for discussion and projects
          - **Interest groups:** same topic of interest, different tasks
          - **Pairs:** think–pair–share, peer tutoring
          - **Whole class:** shared hooks, new concepts, discussion

          ## Keep it flexible

          Change groups often, and use a mix of grouping types across a week. Fixed ability groups can lower expectations and self-esteem.
        `),
        tip("Groups in large classes", "Number benches or rows as groups. Turn-and-talk with the bench behind you creates groups of 4–6 without moving furniture."),
        reflect("Plan the grouping for each day of your next week. How many different grouping types will you use?"),
      ]),
      lesson("choice-boards", "Choice boards and learning stations", 25, [
        text(`
          ## Choice boards

          A 3×3 grid of tasks at varied levels and in different formats. Students choose **three in a row** (or a set path), which guarantees they hit core skills while having a choice.

          ## Learning stations

          Set up 3–5 stations around the room (or across benches): a teacher-led station, a practice station, a reading station, a hands-on station. Groups rotate every 10–12 minutes.

          ## Choice works best when

          - Every option targets the **same learning goal**
          - Instructions are **clear and visual** so students work independently
          - Students know **how they’ll be assessed** whatever they choose
        `),
        quiz(
          "Why do many choice boards ask students to complete “three in a row”?",
          ["It gives choice while ensuring they complete the core skills", "It makes the board harder", "It reduces paper", "It allows students to skip the learning goal"],
          "The layout is designed so any line includes essential tasks.",
        ),
        reflect("Sketch a 3×3 choice board for a unit you teach this term."),
      ]),
    ]),

    mod("m3", "Inclusive frameworks", [
      lesson("udl", "Universal Design for Learning (UDL 3.0)", 30, [
        text(`
          ## Plan for variability from the start

          Instead of designing for an “average” student and then adapting, **UDL** designs lessons that work for a wide range of learners from the start. CAST’s **UDL Guidelines 3.0** (2024) are organised around three principles:

          - **Multiple means of engagement:** the “why” of learning: interest, relevance, persistence, belonging
          - **Multiple means of representation:** the “what”: text, visuals, audio, models, and support for language and symbols
          - **Multiple means of action and expression:** the “how”: different ways to respond and show learning, and support for planning

          Version 3.0 puts more emphasis on **learner agency**, **identity** and removing **bias-related barriers**.
        `),
        scenario("UDL in a history lesson", `Instead of only reading a textbook page, Ms. Rekha presents the Dandi March with a short narrated slideshow, a map, a printed passage with key words highlighted, and a timeline. Students can show learning by writing a diary entry, drawing an annotated route map, or recording a 1-minute oral report.`),
        resource("CAST UDL Guidelines", "https://udlguidelines.cast.org", "The official UDL Guidelines 3.0"),
        quiz(
          "What is the central idea of UDL?",
          ["Design flexible lessons that work for diverse learners from the start", "Plan for the average student and adapt later", "Provide a separate lesson for each disability", "Use only digital tools"],
          "UDL removes barriers proactively by building flexibility into the design.",
        ),
      ]),
      lesson("tarl", "Teaching at the Right Level", 25, [
        text(`
          ## Teaching to the level, not just the grade

          Surveys such as ASER repeatedly show that many children in Indian schools are **several grades behind** in basic reading and arithmetic. Teaching only the grade-level textbook leaves them further behind.

          **Teaching at the Right Level (TaRL)**, developed by Pratham, addresses this:

          1. Assess children with a simple one-to-one tool (letter → word → paragraph → story; number recognition → operations)
          2. **Group by level**, not grade, for a dedicated period each day
          3. Use engaging activities matched to each level
          4. Re-assess regularly and move children up as they progress

          Evaluations have found strong gains in foundational skills when implemented well.
        `),
        note("NIPUN Bharat", "India’s national mission for Foundational Literacy and Numeracy (FLN), NIPUN Bharat, aims for every child to achieve foundational skills by the end of Class 3, in line with TaRL-style level-based teaching."),
        resource("Teaching at the Right Level", "https://www.teachingattherightlevel.org", "Methods, assessment tools and evidence"),
        quiz(
          "In TaRL, how are children grouped during the dedicated learning period?",
          ["By their current learning level, regardless of grade", "By age", "By roll number", "By last year’s exam rank"],
          "Grouping by level lets teachers target the skills children actually need.",
        ),
      ]),
      lesson("multilingual", "Multilingual learners", 25, [
        text(`
          ## Home language is a resource

          NEP 2020 recommends that wherever possible the medium of instruction, at least until Class 5, be the **home language or mother tongue**, and encourages **bilingual** teaching. Children understand concepts faster in a language they know well.

          ## Strategies in any medium

          - **Bilingual glossaries** for key terms
          - Allow students to **discuss first in their home language**, then share in the language of instruction
          - **Visuals, gestures and real objects** with new vocabulary
          - Sentence frames: “I think ___ because ___.”
          - Accept answers that show understanding even if the language is imperfect
        `),
        tip("Translanguaging", "Letting students use all their languages to think and talk, then produce in the target language, deepens understanding and builds confidence."),
        reflect("Which languages are spoken in your students’ homes? How could you use them in your next lesson?"),
      ]),
    ]),

    mod("m4", "Every learner", [
      lesson("disabilities", "Supporting students with disabilities", 30, [
        text(`
          ## The legal framework

          The **Rights of Persons with Disabilities (RPwD) Act, 2016** requires inclusive education: schools must admit children with disabilities without discrimination, provide **reasonable accommodation**, and support them to participate fully. It recognises 21 disabilities, including specific learning disabilities like dyslexia, autism spectrum disorder and intellectual disability.

          ## Practical accommodations

          - **Seating** near the board or away from distractions
          - **Extra time**, shorter or chunked tasks
          - **Large print, audio, or a reader/scribe** in assessments, as per board rules
          - **Visual schedules** and clear routines
          - **Alternative formats** to show learning: oral, diagrams, models
          - Working with the special educator, parents and the student on an individual plan
        `),
        warn("Avoid labels and assumptions", "Never diagnose. If you suspect a learning difficulty, document what you observe and refer through your school’s process. Focus on what helps the child learn."),
        quiz(
          "A student with dyslexia understands science concepts well but writes very slowly. Which is a reasonable accommodation?",
          ["Allow oral or diagram-based answers and extra time", "Give an easier science syllabus", "Mark spelling errors heavily", "Excuse the student from all assessments"],
          "Accommodations remove barriers to showing learning while keeping the content goal.",
        ),
      ]),
      lesson("advanced-learners", "Challenging advanced learners", 20, [
        text(`
          ## More depth, not just more work

          Students who already know the content need **challenge**, not extra copies of the same exercise:

          - **Compacting:** test out of what they know, then work on extension
          - **Depth:** “Why does this work? When doesn’t it?”
          - **Complexity:** connect to other topics or real problems
          - **Independent projects** with clear goals and check-ins
          - **Leadership with care:** peer tutoring helps, but it shouldn’t be all they do
        `),
        reflect("Which student in your class is rarely challenged? What depth task could you design for them this week?"),
      ]),
      lesson("multigrade-large", "Large and multigrade classes", 25, [
        text(`
          ## Differentiation with 50+ students

          - Use **three tiers**, not 50 individual plans
          - **Self-checking** materials (answer cards, checklists) free you for the guided group
          - **Bench monitors** manage materials and peer support
          - **Routines** for “what to do when I’m stuck” and “when I’m finished”

          ## Multigrade classrooms

          Many Indian schools combine two or more grades in one room. Effective approaches:

          - **Common theme**, different tasks by grade or level
          - **Alternating direct teaching**: one grade with the teacher, another doing practice, then switch
          - **Peer learning** across ages
          - Learning ladders and self-paced cards, as in some State multigrade programmes
        `),
        scenario("A multigrade lesson", `Mrs. Meena teaches Classes 3, 4 and 5 together. The theme is “water”. Class 3 measures and compares volumes of containers; Class 4 reads and records data on daily water use; Class 5 calculates monthly use and suggests savings. She teaches each group for 10 minutes while the others work with task cards.`),
      ]),
      lesson("assessment-di", "Assessment in a differentiated class", 20, [
        text(`
          ## Fair isn’t always identical

          Fair assessment gives every student the chance to show they’ve met the **same learning goal**. That may mean different formats or supports.

          ## Keep it rigorous

          - Assess against **the same success criteria** for everyone
          - Use **ongoing formative checks** to move students between groups
          - Separate **access** supports (reading the question aloud) from the **skill** being assessed
        `),
        quiz(
          "When assessing reading comprehension, which support would change what is being measured?",
          ["Reading the passage aloud to the student", "Allowing extra time", "Providing a quiet room", "Allowing oral answers"],
          "If the skill is reading the text, reading it aloud removes the skill being assessed. In a science test it would be a fair access support.",
        ),
      ]),
      lesson("planning-workshop", "Workshop: plan a differentiated lesson", 40, [
        text(`
          ## Your plan

          1. **Learning goal and success criteria:** the same for all
          2. **Pre-assessment evidence:** who needs what?
          3. **Shared start:** hook and core teaching for everyone, with UDL representation choices
          4. **Differentiated practice:** three tiers or stations, with clear instructions
          5. **Grouping plan:** who works where, and where you’ll be
          6. **Supports:** language, disability accommodations, extension
          7. **Check:** an exit ticket to plan tomorrow’s groups
        `),
        points([
          "Same goal, different routes",
          "Use evidence (pre-assessment) to plan, and regroup often",
          "Tier tasks, scaffold and fade support",
          "Design for variability with UDL",
          "Use home languages, and accommodate disabilities",
          "Keep advanced learners challenged",
        ], "Course summary"),
        reflect("Paste or write your differentiated lesson plan. What will you look for to decide tomorrow’s groups?"),
      ]),
    ]),
  ],
};
