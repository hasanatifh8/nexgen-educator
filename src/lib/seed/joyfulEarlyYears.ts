import type { Course, ExamQuestion, Program } from "../catalog";
import { kit, type Content } from "./kit";

/**
 * “The Joyful Classroom” — for preschool and primary teachers (playgroup to Class 5).
 * Draws on Finland, Reggio Emilia, Montessori, Singapore (NEL), UK EYFS, IB PYP and New Zealand (Te Whāriki),
 * set in India’s NEP 2020 / NCF for the Foundational Stage. Children learn with their hands; AI is the teacher’s assistant.
 */

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz, prompt, activity } = kit();

export const JOYFUL_PROGRAM_ID = "joyful-early-years-educator";
export const JOYFUL_COURSE_ID = "joyful-classroom-playgroup-to-class-5";

let examIndex = 0;
/** Correct answer written first, then rotated so answers spread evenly across A–D. */
const q = (id: string, prompt: string, options: string[], explanation: string, scenario?: string): ExamQuestion => {
  const target = [1, 3, 0, 2][examIndex++ % 4] % options.length;
  const wrong = options.slice(1);
  return { id, prompt, options: [...wrong.slice(0, target), options[0], ...wrong.slice(target)], answer: target, explanation, ...(scenario ? { scenario } : {}) };
};

export const JOYFUL_PROGRAM: Program = {
  id: JOYFUL_PROGRAM_ID,
  title: "Joyful Early Years & Primary Educator",
  category: "Early Years & Primary",
  level: "Beginner",
  price: 0,
  description:
    "Modern, play-based teaching for playgroup to Class 5, drawn from Finland, Reggio Emilia, Montessori, Singapore and India’s NEP 2020 — with AI as the teacher’s free planning assistant.",
  exam: {
    minutes: 40,
    passPercent: 70,
    questions: [
      q("jy01", "In this course, what is the right role for AI in a kindergarten classroom?", ["The teacher’s planning assistant — children learn with their hands, not screens", "A screen children use for most of the day", "A replacement for circle time", "A tool children use to do worksheets"],
        "Young children learn through their bodies and senses. AI helps the teacher plan, write stories and draft messages — away from the children."),
      q("jy02", "Under NEP 2020, which ages make up the Foundational Stage?", ["Ages 3 to 8 (three years of preschool plus Classes 1 and 2)", "Ages 6 to 10", "Only Class 1 to Class 5", "Ages 0 to 3"],
        "The 5+3+3+4 structure starts with a five-year Foundational Stage: three years of preschool/anganwadi plus Classes 1 and 2."),
      q("jy03", "Which idea comes from the Reggio Emilia approach?", ["The environment is the “third teacher”", "Children should sit at desks from age 3", "Learning is measured mainly by weekly tests", "Only the teacher chooses what children explore"],
        "Reggio Emilia treats a thoughtfully arranged room — light, materials, displays of children’s work — as a teacher in its own right."),
      q("jy04", "What does the CPA approach in maths stand for, in order?", ["Concrete → Pictorial → Abstract", "Counting → Practice → Assessment", "Abstract → Pictorial → Concrete", "Copy → Paste → Answer"],
        "Children handle real objects first, then pictures, and only then digits and symbols."),
      q("jy05", "A child counts 4 crayons as “1, 2, 3, 4, 5, 6, 7”. What skill do they still need?", ["One-to-one correspondence — one number word for each object", "Writing the digit 7", "Reciting numbers faster", "Learning numbers up to 100"],
        "Reciting is not counting. Touch-and-move counting with real objects builds one-to-one correspondence.",
        "During a counting game, Anaya recites numbers perfectly but keeps counting after the crayons run out."),
      q("jy06", "When teaching the sound /m/, what is the most helpful first step?", ["Say the pure sound “mmm” with an action, not the letter name “em”", "Teach the letter name “em” first", "Ask children to write m twenty times", "Show a video of the alphabet song"],
        "Synthetic phonics teaches pure sounds first, linked to actions and mouth feelings. Letter names come later."),
      q("jy07", "In dialogic reading, the teacher…", ["Pauses to ask children to predict, point and make sound effects", "Reads the whole story without stopping", "Only reads books children already know by heart", "Asks children to sit silently until the end"],
        "Dialogic reading turns story time into a conversation, which builds vocabulary and comprehension."),
      q("jy08", "Two four-year-olds are screaming over one toy truck. What should you do first?", ["Get down to their level, stay calm, and help them name the feeling before solving the problem", "Take the toy away and give both a time-out", "Shout to stop the noise", "Ask them to say sorry immediately"],
        "Young children need co-regulation first. Calm adult, named feelings, then problem-solving.",
        "Circle time has stopped. Both children are crying and one is throwing blocks."),
      q("jy09", "What belongs in a classroom “Calm Corner”?", ["Soft cushions, a sensory bottle, a mirror and feeling cards", "A chair facing the wall", "A list of punishments", "A tablet with cartoons"],
        "A calm corner is a kind, chosen place to regulate — never a punishment."),
      q("jy10", "Under India’s RTE Act, physical punishment and mental harassment of children are…", ["Prohibited", "Allowed with parents’ permission", "Allowed for children above 6", "Left to each teacher"],
        "Section 17 of the RTE Act, 2009 prohibits physical punishment and mental harassment. Positive guidance is the only option."),
      q("jy11", "Which is SAFE to type into an AI tool?", ["“A 4-year-old in my class bites when frustrated. Suggest gentle strategies.”", "“Kabir Sharma, age 4, of Green Park school, bites other kids.”", "A photo of your class with children’s faces", "A parent’s phone number so AI can draft a message"],
        "Describe the situation, never the child. No names, photos, school names or contact details."),
      q("jy12", "What are the four pieces of the prompt recipe in this course?", ["Who AI is + your class details + what you need + rules/limits", "Hello + question + thank you + goodbye", "Subject + verb + object + full stop", "Name + age + photo + school"],
        "Role, context, task and limits — the same way you would brief an assistant teacher."),
      q("jy13", "An AI lesson plan suggests a craft with small beads for 2-year-olds. What should you do?", ["Reject or adapt it — small beads are a choking hazard for that age", "Use it because AI planned it", "Use it but tell children to be careful", "Ask the AI if it is safe and trust its answer"],
        "You are the safety check. Always review AI ideas for age, safety and your real classroom."),
      q("jy14", "Differentiation means…", ["Giving every child a way into the same activity at their own level", "Giving weaker children a different, easier goal forever", "Separating children into fixed ability groups", "Letting advanced children skip the activity"],
        "Same goal, different paths — for example tearing paper instead of cutting, or glue sticks instead of wet glue."),
      q("jy15", "A child with sensory sensitivity cries when touching wet glue. A good adaptation is…", ["Offer double-sided tape or a glue stick so they can take part", "Make them use the wet glue to get used to it", "Send them to sit out the activity", "Do the craft for them"],
        "Change the material, not the goal. The child still makes the rainbow."),
      q("jy16", "Why does Finland’s early-years approach avoid formal tests for young children?", ["Children of this age learn best through play, movement and relationships, without test stress", "Finnish children cannot write", "Tests are too expensive", "Teachers there have no time for marking"],
        "Formal school starts at 7 in Finland. Before that, learning is play-based and joyful."),
      q("jy17", "A Montessori classroom typically uses…", ["Hands-on, self-correcting materials children choose and use independently", "Rows of desks and teacher lectures", "Screens for each child", "Only group singing"],
        "Montessori materials let children work at their own pace and notice their own mistakes."),
      q("jy18", "What is a “learning story” (from New Zealand’s Te Whāriki)?", ["A short written observation of a child’s learning moment, shared with the family", "A fairy tale read at bedtime", "A test score report", "A story the child writes in Class 5"],
        "Learning stories capture what a child did, what it shows about their learning, and what could come next."),
      q("jy19", "In a Class 3 unit of inquiry (IB PYP style) on “Water”, what usually comes first?", ["Children’s own questions — for example on a “wonder wall”", "A chapter test", "Copying definitions from the board", "The teacher’s final answer"],
        "Inquiry starts from children’s curiosity. Questions drive the investigation."),
      q("jy20", "In Singapore-style primary maths, a “bar model” is used to…", ["Draw a problem as rectangles so children can see the parts and the whole", "Measure the classroom", "Record attendance", "Decorate the maths corner"],
        "Bar models are the pictorial step that bridges real objects and written equations."),
      q("jy21", "A child bit a classmate. How should the message to the biting child’s parents begin?", ["Calmly and without blame, explaining it is common at this age and what the school did", "“Your child is aggressive and must be punished.”", "With the other child’s full name and injuries", "By asking them to remove the child from school"],
        "Partnership, not blame. Focus on development and next steps together.",
        "Little Kabir, 3, bit a classmate during a dispute over a toy train."),
      q("jy22", "AI drafts a WhatsApp message to parents. Before sending it you should…", ["Read it, check facts and tone, and add the child’s name yourself", "Send it straight away", "Paste in both children’s full names for AI to personalise", "Forward it to all parents in the class group"],
        "AI drafts; you check, personalise and send. Names are added by you, outside the AI tool."),
      q("jy23", "NEP 2020 recommends that, wherever possible, the medium of instruction until at least Class 5 should be…", ["The home language or mother tongue", "Only English", "Only Hindi", "Any language the school prefers"],
        "Children understand concepts fastest in the language they speak at home."),
      q("jy24", "What is the main aim of the “One-Hour Sunday” workflow?", ["Plan the whole week in one focused session so teachers get their weekends back", "Work every Sunday for four hours", "Let AI teach on Monday", "Skip planning altogether"],
        "One master prompt plus a quick review gives you a week of songs, games, stories and a parent note."),
      q("jy25", "Which is the best way to assess a 4-year-old’s counting?", ["Watch them count real objects during play and note what you see", "Give a written test with 20 sums", "Ask them to recite to 100", "Compare them with the rest of the class on a chart"],
        "Observation during real activities shows what young children truly understand."),
    ],
  },
};

const content: Content = {
  instructor: { name: "NextGen Educator Early Years Team", title: "Preschool & Primary Specialists" },
  overview: `A warm, practical course for teachers of **playgroup, nursery, LKG, UKG and Classes 1 to 5**. You’ll learn the methods used by the world’s most admired early-years systems, and how to use them in a real Indian classroom with ordinary materials.

- **Finland** — joyful play, movement and nature, with zero test stress
- **Reggio Emilia (Italy)** — the room as the “third teacher”, learning through exploration and art
- **Montessori** — hands-on materials children choose and use on their own
- **Singapore (NEL & primary maths)** — purposeful play, confident language and the bar model
- **UK Early Years** — synthetic phonics and play-based learning
- **IB PYP & New Zealand** — inquiry, projects and “learning stories”
- **India’s NEP 2020 and NCF for the Foundational Stage** — play, mother tongue and holistic progress

**The core rule:** young children learn with their hands, eyes and bodies — they should **not** sit in front of AI screens. Instead, **AI becomes your free assistant**: it plans lessons in seconds, writes custom stories, adapts crafts for children who struggle and drafts polite messages to parents.

Every lesson has a real classroom scenario, a ready-to-copy AI prompt, a hands-on activity to try, and a quick check. No technical skills needed.`,
  outcomes: [
    "Explain how children learn from age 2 to 11, and what NEP 2020 expects at each stage",
    "Run play-based lessons the Finnish way, using toys, movement and the outdoors",
    "Set up your room as a “third teacher” with learning corners and a calm corner",
    "Teach letter sounds and early reading with synthetic phonics and dialogic reading",
    "Teach numbers with real objects using the Concrete–Pictorial–Abstract approach",
    "Calm big emotions with co-regulation, and guide behaviour without punishment",
    "Run inquiry and project-based units for Classes 1 to 5",
    "Adapt any activity so every child can take part, and assess through observation",
    "Use AI safely to plan a week, write stories and draft parent messages in minutes",
  ],
  modules: [
    // ─────────────────────────────── MODULE 1 ───────────────────────────────
    mod("m1", "How young children learn", [
      lesson("welcome", "Welcome: the joyful classroom", 10, [
        text(`
          ## Children learn with their whole body

          A three-year-old learns what “heavy” means by lifting a bucket of sand, not by looking at a picture of one. A seven-year-old understands fractions faster by sharing a roti than by reading a definition.

          This course is built on one simple idea: **children learn by doing, playing, talking and moving.** Your job is to set up the experiences. And now you have a free assistant to help you plan them.
        `),
        note("The core rule of this course", `**Children do not sit in front of AI screens.** AI is the **teacher’s** helper — used at home or in the staffroom to plan, write and adapt. In the classroom, children use blocks, leaves, clay, songs and each other.`),
        text(`
          ## How this course works

          Every lesson has:

          - a **real classroom scenario** you will recognise
          - a **methodology spotlight** from a top school system
          - a **ready-to-copy AI prompt** with a Copy button
          - a **Try it in class** activity you can mark as done
          - a quick **knowledge check**
        `),
        reflect("Think of a moment when a child in your class was completely absorbed in an activity. What were they doing with their hands?"),
      ]),
      lesson("ages-and-stages", "Ages and stages: playgroup to Class 5", 15, [
        text(`
          ## What children can do at each age

          - **Playgroup (2–3 years):** learning through the senses; short attention (about 3–5 minutes); parallel play next to other children; big movements like climbing and pouring.
          - **Nursery (3–4):** lots of “why?” questions; pretend play; starts sharing with help; holds a crayon in a fist or simple grip.
          - **LKG/UKG (4–6):** cooperative play; hears sounds in words; counts real objects; enjoys rules in games; attention of about 10–15 minutes.
          - **Classes 1–2 (6–8):** starts reading and writing; adds and subtracts with objects; loves fairness and “my turn”.
          - **Classes 3–5 (8–11):** reads to learn; thinks logically about real things; enjoys projects, teams and responsibility.
        `),
        tip("A simple attention rule", "A rough guide is **2–3 minutes of focused attention per year of age**. Plan short bursts and change the activity before the energy drops."),
        text(`
          ## India’s 5+3+3+4 structure (NEP 2020)

          - **Foundational Stage (ages 3–8):** three years of preschool or anganwadi, plus Classes 1 and 2. Learning is **play-based and activity-based**.
          - **Preparatory Stage (ages 8–11):** Classes 3 to 5. Play and discovery continue, with more formal reading, writing and maths.

          The **National Curriculum Framework for the Foundational Stage (NCF-FS, 2022)** describes how to teach ages 3–8 through play, stories, rhymes, toys and conversation.
        `),
        quiz("Under NEP 2020, the Foundational Stage includes…", ["Three years of preschool plus Classes 1 and 2", "Only Classes 1 to 5", "Only nursery", "Classes 3 to 5"], "Ages 3–8: three years of preschool/anganwadi, then Classes 1 and 2."),
        resource("NEP 2020 — Ministry of Education", "https://www.education.gov.in/nep/about-nep", "Official overview of the National Education Policy 2020."),
        resource("NCERT", "https://ncert.nic.in/", "Find the National Curriculum Framework for the Foundational Stage and Jaadui Pitara materials."),
      ]),
      lesson("world-tour", "A tour of the world’s best early-years models", 18, [
        text(`
          ## What the top systems have in common

          - **Finland:** formal school starts at **age 7**. Before that, children learn through play, nature and relationships. Even in primary, short outdoor breaks between lessons are normal.
          - **Reggio Emilia (Italy):** children have “a hundred languages” — drawing, clay, music, building. The **environment is the third teacher**, after adults and peers.
          - **Montessori:** a calm, prepared room with hands-on, **self-correcting materials**. Children choose their work and repeat it until they master it.
          - **Singapore (NEL framework):** **purposeful play** with clear learning goals, strong language and social confidence. In primary maths, the famous **bar model**.
          - **UK Early Years (EYFS):** play-based learning for under-5s, with **synthetic phonics** for early reading.
          - **New Zealand (Te Whāriki):** teachers write **learning stories** about each child to share with families.
          - **IB Primary Years Programme:** learning through **inquiry** — children’s questions lead units of study.
        `),
        points([
          "Play comes before paper",
          "Real objects come before symbols",
          "The room itself teaches",
          "Children’s questions drive learning",
          "Teachers observe and document rather than test",
        ], "Five ideas they all share"),
        scenario("Same theme, two classrooms", `Classroom A: children colour a printed worksheet of a butterfly and copy the word “butterfly”.

Classroom B: children watch real caterpillars in a jar for a week, act out the life cycle with their bodies, paint wings with their fingers and tell the story to their parents.

Which children will remember how a butterfly grows — and which children want to come back tomorrow?`),
        quiz("Which approach calls the environment the “third teacher”?", ["Reggio Emilia", "Synthetic phonics", "The bar model", "Formal testing"], "Reggio Emilia sees a well-designed room as a teacher alongside adults and peers."),
        resource("Reggio Children", "https://www.reggiochildren.it/en/", "The official home of the Reggio Emilia approach."),
        resource("Association Montessori Internationale", "https://montessori-ami.org/", "Founded by Maria Montessori."),
        resource("Singapore Nurturing Early Learners (NEL) portal", "https://www.nel.moe.edu.sg/", "Singapore’s preschool curriculum framework."),
        resource("UK Early Years Foundation Stage framework", "https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2", "The statutory framework for England."),
        resource("Finnish National Agency for Education", "https://www.oph.fi/en", "Early childhood education and care in Finland."),
        reflect("Which of these models feels closest to how you already teach? Which one would you like to borrow from first?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 2 ───────────────────────────────
    mod("m2", "Play-based learning (the Finnish way)", [
      lesson("play-is-work", "Play is a child’s work", 15, [
        scenario("Nobody wants to sit on the carpet", "You announce it’s time to learn shapes. Three children run to the block corner, two are playing with plastic animals, and nobody wants to sit on the carpet."),
        text(`
          ## Methodology spotlight: Finland

          In Finnish early-years classrooms, children don’t sit at desks to learn shapes. They **discover shapes on the floor, in blocks and in the playground**. The teacher sets up the play and joins in with questions.

          ## Free play vs guided play

          - **Free play:** children choose what to do and how. It builds imagination, independence and social skills.
          - **Guided play:** the teacher sets up the play with a learning goal in mind, then follows the children’s lead and asks questions.

          Both matter. Most good lessons for under-6s are **guided play**.
        `),
        tip("Questions that turn play into learning", `- “What do you notice?”
- “How did you make that?”
- “What would happen if…?”
- “Can you find another one that is the same?”`),
        prompt(`Act as an early-childhood expert. I have 15 four-year-old children who love playing with building blocks and toy cars. Give me 3 fun, 10-minute classroom games where they learn to identify circles, squares and triangles using only their existing toys and zero worksheets.`),
        activity("Build a Shape Garage", `Use painter’s tape or chalk to draw parking bays on the floor: circles, squares and triangles.

1. Give each child a toy car or block.
2. Ask them to “park” round things in the circle bays and box shapes in the square bays.
3. Watch: who sorts easily, and who needs help? Note it down.`),
        quiz("What makes play “guided”?", ["The teacher sets it up with a learning goal and joins in with questions", "Children play with no adult nearby", "Children fill in a worksheet after playing", "The teacher tells children exactly what to build"], "Guided play keeps the joy of play but has a learning goal behind it."),
      ]),
      lesson("move-and-outdoors", "Movement and outdoor learning", 15, [
        text(`
          ## Children think better when they move

          Finnish schools give children regular outdoor breaks between lessons — even in winter. Movement helps children focus, manage feelings and remember.

          ## Ideas for every age

          - **Playgroup–UKG:** animal walks (hop like a frog, crawl like a crab), parachute games, “freeze dance” with numbers.
          - **Classes 1–2:** hopscotch with sight words, a number line drawn on the ground, sound hunts in the school garden.
          - **Classes 3–5:** measuring shadows at different times of day, a leaf survey for data handling, a treasure hunt with map directions.
        `),
        note("No garden? No problem", "A corridor, the terrace or a cleared classroom floor works. Even 3 minutes of movement between activities makes a difference."),
        prompt(`Act as a Finnish-style primary teacher. Give me 5 outdoor maths activities for Class 2 students (age 7) in a small Indian school playground with no equipment except chalk, stones and leaves. Each activity should take 10 minutes and practise addition up to 20.`),
        activity("A 3-minute movement break", "Before your next sit-down activity, try: “Touch something red. Jump 5 times. Find a friend and do a high-five. Back to your spot!” Notice whether children settle faster afterwards."),
        reflect("Where in your daily timetable could you add 5 more minutes of movement?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 3 ───────────────────────────────
    mod("m3", "The room as the third teacher", [
      lesson("third-teacher", "Designing a room that teaches", 15, [
        text(`
          ## Methodology spotlight: Reggio Emilia

          In Reggio Emilia schools, the room is arranged so children can **explore on their own**: natural light, open shelves, real materials, mirrors, and children’s own work displayed at their eye level.

          ## Learning corners that work in any classroom

          - **Block and building corner** — blocks, boxes, toy vehicles
          - **Pretend play corner** — a “kirana shop”, kitchen or clinic with real empty packets and old phones
          - **Book corner** — a mat, cushions and books facing out
          - **Art and making table** — crayons, clay, waste material (bottle caps, cardboard, newspaper)
          - **Nature and discovery tray** — leaves, seeds, shells, a magnifying glass
        `),
        tip("Display at child height", "Put children’s drawings and photos of their work **at their eye level**, with a few words from the child: “This is my house. My dadi lives here.” It tells children their ideas matter."),
        prompt(`Act as a Reggio Emilia-inspired preschool consultant. My classroom is 15 x 20 feet with 25 children aged 4–5 and a very small budget. Suggest how to arrange 4 learning corners using low-cost or free materials found in an Indian home, and give me a simple daily rotation plan.`),
        activity("Look at your room from a child’s height", "Kneel down in your classroom. What can a child see, reach and use on their own? Move one shelf, display or basket so children can reach it without asking."),
        quiz("In a Reggio-inspired room, where should children’s work be displayed?", ["At the children’s eye level, with their own words", "High up, where only adults can see it", "Only in the principal’s office", "Nowhere — walls should stay bare"], "Displays at child height make children feel their ideas are valued."),
      ]),
      lesson("montessori-hands", "Montessori: hands-on and independent", 15, [
        text(`
          ## Methodology spotlight: Montessori

          Montessori classrooms are calm and ordered. Each material has a place on the shelf, and children **choose their work, use it and put it back**.

          Many Montessori materials are **self-correcting**: if the pieces don’t fit, the child sees the mistake and tries again — no adult needed.

          ## Practical-life activities (ages 2–6)

          - Pouring water or rice between two jugs
          - Spooning beans from one bowl to another
          - Buttoning, zipping and folding a cloth
          - Watering a plant, wiping a table, sweeping with a small broom

          These build **concentration, fine-motor control and independence** — the foundations for writing.
        `),
        tip("Show, don’t tell", "Demonstrate an activity slowly and silently, then invite the child: “Would you like to try?” Fewer words help young children watch your hands."),
        prompt(`I teach a nursery class of 3-year-olds in India. Give me 8 Montessori-style practical-life activities using everyday Indian household items (steel tumblers, katoris, rice, rajma, cloth napkins). For each, list the materials, the skill it builds, and a safety note.`),
        activity("Set up one practical-life tray", "Put two small steel bowls, a spoon and a handful of rajma on a tray. Show one child how to spoon beans across slowly. Watch how long they choose to repeat it."),
        quiz("Why are self-correcting materials useful?", ["Children can see and fix their own mistakes without an adult", "They are cheaper than books", "They keep children quiet", "They replace the teacher"], "Self-correction builds independence and concentration."),
      ]),
      lesson("calm-corner", "The Calm Corner", 12, [
        text(`
          ## A kind place to feel better

          A **Calm Corner** (or Peace Corner, or Cozy Nook) is a soft, quiet space where a child can go to settle big feelings. It is a **choice, never a punishment**.

          ## What to put in it

          - Soft cushions or a folded durrie
          - A **sensory bottle** (water, glitter and a drop of oil in a sealed plastic bottle)
          - A small unbreakable mirror
          - **Feelings cards** with faces: happy, sad, angry, scared, worried
          - A soft toy to hug
          - A breathing picture: “smell the flower, blow out the candle”
        `),
        warn("Not a time-out", "Never send a child to the calm corner as a punishment. If it becomes a place of shame, it stops working."),
        activity("Make a Calm-Down Basket", "Fill a basket with a mirror, a glitter bottle and a soft toy. Introduce it at circle time when everyone is calm: “This is our calm basket. When your feelings are very big, you can come here.” Practise using it together."),
        reflect("Where could your calm corner go? What three items would you put in it first?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 4 ───────────────────────────────
    mod("m4", "Language, phonics and stories", [
      lesson("phonics", "Letter sounds without screen time", 18, [
        scenario("Mmm or em?", "You are teaching the sound /m/, but children keep saying the letter name “em”, and half the class is bored after 3 minutes of repeating after you."),
        text(`
          ## Methodology spotlight: synthetic phonics (UK Early Years)

          Children first learn the **pure sound** each letter makes — “mmm”, not “em” — then **blend** sounds together to read words: m-a-t → mat.

          Connect each sound to a **feeling, taste or action**:

          - /m/ — rub your tummy: “Mmmm, yummy!”
          - /s/ — wiggle your hand like a snake: “sssss”
          - /t/ — tap your wrist like a clock: “t, t, t”

          ## Before phonics: listening games

          For playgroup and nursery, start with **hearing** sounds: clapping syllables (ba-na-na), rhyming words (cat, hat, mat), and “I spy something that starts with mmm”.
        `),
        tip("Keep it short", "For 3–4-year-olds, 5–10 minutes of phonics fun a day beats one long session a week."),
        prompt(`I am teaching the letter sound /m/ to 3-to-4-year-olds. Give me: 1) A silly 4-line rhyme focusing on the /m/ sound that has hand motions, 2) A quick sensory scavenger hunt where children search the classroom for things that start with this sound, and 3) A simple physical gesture to help them remember the sound.`),
        activity("A 5-minute sound circle", "Run a mock circle time with a colleague using the AI rhyme and the tummy-rub gesture. Then hide 5 objects in the room — 3 that start with /m/ (mango, mug, mirror) and 2 that don’t. Can children find the /m/ ones?"),
        quiz("When teaching /m/, you should first teach…", ["The pure sound “mmm” with an action", "The letter name “em”", "How to write capital M", "The whole alphabet song"], "Pure sounds first; letter names come later."),
      ]),
      lesson("mother-tongue", "Many languages, one classroom", 12, [
        text(`
          ## Learning in the home language

          NEP 2020 says that **wherever possible, the medium of instruction until at least Class 5 should be the home language or mother tongue**. Children understand new ideas fastest in the language they already speak.

          ## In a mixed-language class

          - Welcome words from children’s home languages: “How do you say *water* at home?”
          - Sing rhymes in two or three languages.
          - Make a **word wall** with pictures and words in English and the local language.
          - Let children explain their thinking in any language, then help them find the English words.
        `),
        prompt(`Write a 6-line action rhyme about the monsoon for 4-year-olds, first in simple English and then the same rhyme in simple Hindi. Add a hand action for each line.`),
        activity("Our language map", "At circle time, ask each child how they say “mother”, “water” and “hello” at home. Write the words on a chart with a picture. Use one new word each week."),
        reflect("How many home languages are spoken in your class? How could you bring one of them into tomorrow’s lesson?"),
      ]),
      lesson("storytelling", "Dialogic reading and custom stories", 15, [
        scenario("The truck lovers", "Your class is obsessed with muddy trucks, but your library only has fairy tales and animal books. Children are losing interest during story time."),
        text(`
          ## Methodology spotlight: dialogic reading

          Story time should be a **conversation**, not a performance. Use the **PEER** steps:

          1. **Prompt** the child to say something about the book: “What is the truck doing?”
          2. **Evaluate** their answer warmly: “Yes, it’s stuck!”
          3. **Expand** it: “It’s stuck in the thick, brown mud.”
          4. **Repeat**: ask the child to say the longer sentence.

          Pause to let children **predict**, **point** and make **sound effects**.

          ## For Classes 3–5

          Move from listening to **talking about books**: book circles, “Would you rather…” questions about characters, and children writing their own endings.
        `),
        prompt(`Write an interactive 3-minute read-aloud story for 3-year-olds about a little blue dump truck named Benny who gets stuck in the mud and asks his animal friends for help. Include [Sound Effect] brackets where the children make "Vroom vroom" or "Oink oink" sounds, and add 2 pause questions to ask the children mid-story.`),
        activity("Mirror rehearsal", "Read the AI story aloud in front of a mirror. Practise your voices, the sound effects and where you will pause. Then read it to your class and count how many children join in."),
        quiz("In dialogic reading, “Expand” means…", ["Repeating the child’s answer back with a few more words", "Reading the next chapter", "Asking the child to sit quietly", "Showing a video of the story"], "Expanding models richer language for the child to copy."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 5 ───────────────────────────────
    mod("m5", "Hands-on maths (Singapore & Montessori)", [
      lesson("cpa", "Concrete, pictorial, abstract", 18, [
        scenario("Counting to seven", "Children can recite 1 to 10 like a song, but when you hand them 4 crayons, they count to 7 — they don’t yet understand that each number is one real object."),
        text(`
          ## Methodology spotlight: the CPA approach

          1. **Concrete** — real objects: buttons, leaves, bangles, bottle caps.
          2. **Pictorial** — drawings or dots that stand for the objects.
          3. **Abstract** — written digits and symbols: 3 + 1 = 4.

          **Never show digits before objects.** Children need to hold four leaves before “4” means anything.

          ## Key early skills

          - **One-to-one counting:** touch and move one object for each number word.
          - **Subitising:** seeing a small amount at a glance (like dots on a dice) without counting.
          - **Ten frames:** a 2 × 5 grid that shows numbers as “5 and some more”.
        `),
        prompt(`I want to teach the number 4 to 4-year-olds. Do not use worksheets or screens. Give me 3 hands-on counting games using ordinary objects like plastic cups, dry pasta or fallen leaves. Include a quick snack-time routine where they practise counting.`),
        activity("A bean-and-ten-frame tray", "Draw ten-frames (2 rows of 5 boxes) on cardboard. Fill a tray with dry beans or pebbles. Ask a child to “show me 4” on the ten-frame, then “show me one more”. Watch whether they touch each bean as they count."),
        quiz("What is the correct order of the CPA approach?", ["Real objects → pictures → digits", "Digits → pictures → real objects", "Pictures → digits → real objects", "Digits only"], "Concrete first, then pictorial, then abstract."),
      ]),
      lesson("primary-maths", "Classes 1–5: bar models and number talks", 18, [
        text(`
          ## Methodology spotlight: Singapore primary maths

          In Singapore, children draw **bar models** to understand word problems. A bar model turns the story into rectangles, so children can **see the parts and the whole**.

          *Example (Class 3):* Riya has 24 bangles. Meena has 8 more than Riya. How many does Meena have?

          Draw one bar for Riya (24). Draw Meena’s bar the same length plus a small extra piece (8). Now children can see: 24 + 8 = 32.

          ## Number talks (5–10 minutes)

          Show a problem like **19 + 6** with no paper. Children solve it in their heads and share **how**:

          - “I made 20 and then added 5.”
          - “I did 10 + 6 + 9.”

          Every strategy is celebrated. Children learn there are many ways to think.

          ## Maths in real life

          A classroom “kirana shop” with real coins and price tags teaches addition, change-giving and estimation better than any worksheet.
        `),
        prompt(`Act as a Singapore maths expert. Create 5 word problems for Class 3 students in India about everyday situations (market shopping, cricket scores, sharing laddoos). For each, describe the bar model the children should draw and give the answer.`),
        activity("Run one number talk", "Write 19 + 6 on the board. Give children 1 minute of thinking time, with a thumb up when they have an answer. Ask three children to explain how they did it, and write each strategy on the board."),
        quiz("What is the main purpose of a bar model?", ["To show the parts and the whole of a problem as pictures", "To decorate maths notebooks", "To replace real objects in nursery", "To time children’s answers"], "Bar models are the pictorial bridge to equations."),
        reflect("Which maths topic do your students find hardest? How could you teach it with real objects first?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 6 ───────────────────────────────
    mod("m6", "Big emotions and kind discipline", [
      lesson("big-emotions", "Calming big feelings", 18, [
        scenario("The red fire engine", "Two children are screaming and crying over a single red fire engine. One starts throwing blocks, and circle time is completely derailed."),
        text(`
          ## A calm adult is the best tool

          Young children cannot calm down on their own yet. They borrow **your** calm. This is called **co-regulation**.

          ## The 4 steps in the moment

          1. **Keep everyone safe** — move the blocks, step between the children.
          2. **Get down to their level** and lower your voice.
          3. **Name the feeling:** “You are very angry. You both really want the fire engine.”
          4. **Solve it together, once they are calm:** “What can we do? Take turns? Use the timer? Find another truck?”

          Reasoning only works **after** the child is calm.
        `),
        prompt(`I am a preschool teacher. Two 4-year-olds are fighting over toys and having a major crying meltdown. Give me: 1) A 2-sentence soothing script I can say out loud right now to help them calm down, 2) A 3-minute breathing game pretending to blow out birthday candles, and 3) A short 1-minute puppet-show script to teach toy sharing after they calm down.`),
        activity("Role-play the script", "With a colleague playing the upset child, practise the 4 steps and the AI calming script. Swap roles. How does it feel to hear a calm voice when you are “upset”?"),
        quiz("What should you do first when two children are melting down?", ["Keep them safe and help them calm down before solving the problem", "Explain the rules of sharing", "Give both a punishment", "Ask who started it"], "Safety and calm first; problem-solving comes after."),
      ]),
      lesson("kind-discipline", "Guiding behaviour without punishment", 15, [
        text(`
          ## Teach the behaviour you want

          - **Say what to do, not what not to do:** “Walking feet” instead of “Don’t run.”
          - **Give two good choices:** “Do you want to tidy the blocks or the books?”
          - **Notice the good:** “You waited for your turn. That was kind.”
          - **Use routines and songs** for transitions: a tidy-up song, a lining-up rhyme.
          - **Natural consequences:** if paint is spilled, we clean it together.
        `),
        warn("What the law says", "Under **Section 17 of the Right to Education Act, 2009**, physical punishment and mental harassment of children are prohibited. That includes hitting, pinching, making a child stand outside, and shaming. Kind, firm guidance is both the law and what works."),
        prompt(`Write a catchy 4-line clean-up chant set to the tune of "Twinkle Twinkle Little Star" that gets 4-year-olds excited to pick up toys.`),
        activity("Turn three “don’ts” into “dos”", "Write down three things you often say: “Don’t shout”, “Don’t run”, “Don’t snatch”. Rewrite each as a positive instruction and use them all day tomorrow."),
        reflect("Which transition in your day (lining up, tidying, after lunch) is the hardest? What routine or song could help?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 7 ───────────────────────────────
    mod("m7", "Inquiry and projects for Classes 1–5", [
      lesson("inquiry", "Learning through children’s questions", 18, [
        text(`
          ## Methodology spotlight: IB Primary Years Programme

          In an inquiry classroom, a unit starts with **the children’s questions**, not the textbook’s answers.

          ## A simple inquiry cycle

          1. **Tune in** — a hook: a mystery box, a real object, a short story.
          2. **Wonder** — children add questions to a **wonder wall**: “Why does it rain? Where does the water go?”
          3. **Find out** — experiments, observation, interviews, books.
          4. **Sort it out** — children organise what they learnt: drawings, charts, models.
          5. **Share** — they teach others: a mini-exhibition for parents or a younger class.
          6. **Reflect** — what do we know now? What do we still wonder?

          ## The KWL chart

          **K**now — **W**ant to know — **L**earned. A quick way to start and end any topic.
        `),
        prompt(`Act as an IB PYP coordinator. Plan a 2-week unit of inquiry on "Water" for Class 3 students in India. Include: a hook activity, 5 questions children might ask, 4 hands-on investigations using simple materials, and a final sharing event for parents.`),
        activity("Start a wonder wall", "Bring a mystery object (a seed pod, an old key, a feather) to class. Ask: “What do you wonder about this?” Write every question on a sticky note or chart paper and put it on the wall. Choose one to investigate together this week."),
        quiz("In an inquiry unit, what usually comes first?", ["The children’s own questions", "The chapter test", "Copying definitions", "The teacher’s final answer"], "Curiosity leads; answers are found together."),
        resource("IB Primary Years Programme", "https://www.ibo.org/programmes/primary-years-programme/", "How the PYP approaches learning for ages 3–12."),
      ]),
      lesson("projects-toys", "Projects and toy-based learning", 15, [
        text(`
          ## Project-based learning

          A project is an in-depth investigation of a real topic over several days or weeks. Good projects for young children are **close to their lives**: our school garden, the vegetable market, how a bus works, our neighbourhood.

          ## Toy-based pedagogy (NEP 2020 and NCF-FS)

          India’s education policy encourages learning with **toys and local games** — spinning tops, puppets, pebble games like gutte, rangoli patterns for symmetry. NCERT’s **Jaadui Pitara** (“magic box”) is a kit of play-based materials for ages 3–8: puppets, story cards, games and toys.

          Children can also **make** toys from waste material — a cardboard car teaches wheels and axles; a paper spinner teaches colour mixing.
        `),
        prompt(`I only have old newspaper, rubber bands and empty cardboard egg cartons. Give me 3 fun creative toys Class 1 children can make, and explain what each toy teaches them (science, maths or fine-motor skills).`),
        activity("Mini project: Our market", "Ask children to bring one empty packet from home. Together, set up a class shop: sort items, make price tags, and take turns as shopkeeper and customer. Over a week, add a bill book and real coins."),
        reflect("What is something in your school’s neighbourhood that children are curious about? Could it become a project?"),
      ]),
    ]),

    // ─────────────────────────────── MODULE 8 ───────────────────────────────
    mod("m8", "Every child included", [
      lesson("differentiation", "One activity, many ways in", 18, [
        scenario("The scissor problem", "You planned a scissor-cutting craft. Three children cut easily, four cannot hold scissors yet, and one child with high sensory sensitivity cries when their fingers touch sticky glue."),
        text(`
          ## Methodology spotlight: differentiated learning

          Every child works towards **the same goal**, in a way that suits them — without feeling left out.

          ## Three easy levers

          - **Materials:** tear paper instead of cutting; glue stick or double-sided tape instead of wet glue; chunky crayons for small hands.
          - **Support:** work alongside a friend; a picture card showing the steps; hand-over-hand help at the start.
          - **Challenge:** an extra step for children who finish fast — “Can you make a pattern? Can you tell me a story about it?”
        `),
        prompt(`I planned a paper-plate craft where children cut coloured paper strips and glue them to make a rainbow.
1. How do I adapt this for a child who cannot use scissors yet?
2. How do I adapt this for a child who hates the sticky feeling of wet glue?
3. How do I make it slightly more challenging for an advanced child who finishes in 2 minutes?
Give practical, immediate classroom solutions.`),
        activity("Set up a three-way art table", "Put out tearable tissue paper (no scissors needed), double-sided tape (no wet glue) and normal glue sticks side by side. Let children choose. Notice who picks what."),
        tip("When to ask for more help", "If a child consistently struggles with speech, movement, attention or social play compared with peers, note what you see and talk gently with the parents about seeing a specialist. Early support makes a big difference."),
        quiz("A child cannot use scissors yet. The best adaptation is…", ["Let them tear the paper so they still make the rainbow", "Skip the activity for them", "Do the cutting for them every time", "Give them a colouring sheet instead"], "Change the method, keep the goal and the joy."),
      ]),
      lesson("observation", "Assessing without tests", 15, [
        text(`
          ## Watch, note, plan

          Young children show what they know through **play, talk and making** — not through written tests. Good early-years teachers are expert observers.

          ## Simple tools

          - **Anecdotal notes:** one or two lines about what a child did and said, with the date.
          - **Photo portfolios:** a photo of a block tower or drawing, with the child’s own words.
          - **Learning stories (New Zealand):** a short, warm story written *to* the child: “Today, Aarav, you built a bridge for the cars…” — what happened, what it shows about their learning, and what could come next.
          - **Holistic progress cards (NEP 2020):** NCERT’s PARAKH centre has developed holistic progress cards that cover physical, social-emotional, language and thinking skills — not only marks.
        `),
        warn("Keep observations private", "Store notes and photos only on school-approved devices or files, and never put children’s names or photos into an AI tool."),
        prompt(`I observed a 4-year-old in my class (I will call them Child A) building a tall block tower, counting the blocks to 8, and helping a friend when the tower fell. Write a warm, 5-sentence "learning story" addressed to the child, explaining what they learned and one idea for what they could try next. Keep the language simple so parents can read it too.`),
        activity("Three observations a day", "Tomorrow, carry a small notebook. Write three short notes about three different children — what they did, what they said, the date. At the end of the week, read them back. What do you notice?"),
        quiz("What is the best way to assess a 4-year-old’s counting?", ["Watch them count real objects during play and note it", "Give a written test", "Ask them to recite to 100", "Rank them on a class chart"], "Observation in real activities shows true understanding."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 9 ───────────────────────────────
    mod("m9", "AI as your teaching assistant", [
      lesson("ai-safe-start", "Getting started with AI, safely", 15, [
        scenario("Will this replace me?", "A teacher wants to use AI to save time but worries: “Will this replace me? Will it leak my students’ names? How do I even open it?”"),
        text(`
          ## AI is a rough-draft machine

          Free tools like **ChatGPT, Claude and Google Gemini** work on your phone or laptop. You type a request in normal language, and they reply in seconds. They can’t hug a crying child, sing with your class or know that Ananya is scared of loud noises. **You** are the teacher. AI writes first drafts.

          ## The strict privacy rule

          **Never type** children’s names, parents’ names, photos, phone numbers, health details or your school’s address into an AI tool. Describe the situation, not the child: “a 4-year-old who bites when frustrated”.
        `),
        warn("Always check AI ideas", "AI can suggest things that are unsafe for young children (small beads, toxic plants, food allergies) or simply wrong. Read every idea with your teacher’s eye before using it."),
        prompt(`Create a printable checklist for a kindergarten picnic day for teachers. What safety items, emergency supplies and simple outdoor games do we need to pack? Keep it clean and bulleted.`),
        activity("Your first AI request", "Open ChatGPT, Claude or Gemini on your phone. Paste the picnic prompt above. Read the checklist it gives you and cross out anything that doesn’t suit your school."),
        quiz("Which is safe to type into an AI tool?", ["“A 4-year-old in my class bites when frustrated. Suggest gentle strategies.”", "“Kabir Sharma of Green Park School bites other children.”", "A class photo", "A parent’s phone number"], "Describe the situation, never the child."),
      ]),
      lesson("prompt-recipe", "The 4-piece prompt recipe", 12, [
        text(`
          ## Talk to AI like you would brief an assistant teacher

          **[Who AI is] + [Your class details] + [What you need] + [Rules/limits]**

          - **Who AI is:** “Act as a warm, creative kindergarten teacher.”
          - **Your class:** “For 4-year-olds with a 10-minute attention span.”
          - **What you need:** “Give me 3 circle-time games about fruits.”
          - **Rules/limits:** “Use zero tech, only materials found at home, and keep it silly.”

          Not happy with the answer? Just reply: “Make it shorter”, “Make it easier for 3-year-olds”, “Add a song”.
        `),
        prompt(`Act as a warm, creative kindergarten teacher. My class has 20 four-year-olds with a 10-minute attention span. Give me 3 circle-time games about fruits. Use zero technology, only materials found at home, and keep it silly.`),
        text(`
          ## Quick prompts for everyday situations

          - **Rainy day, stuck indoors:** “Give me 4 energetic indoor movement games for 15 kindergarteners in a small room with no equipment.”
          - **A tough question from a child:** “How do I explain ‘Why do leaves change colour and fall?’ to a 3-year-old in simple, magical language?”
          - **No art supplies left:** “I only have old newspaper, rubber bands and egg cartons. Give me 3 creative toys kids can make.”
          - **Messy clean-up:** “Write a 4-line clean-up chant to the tune of ‘Twinkle Twinkle Little Star’.”
        `),
        activity("Write your own 4-piece prompt", "Think of tomorrow’s lesson. Write a prompt with all four pieces, paste it into an AI tool, and then ask one follow-up to improve the answer."),
        quiz("Which piece is missing? “Give me 3 games about fruits.”", ["Who AI is, your class details and rules/limits", "Nothing — it is perfect", "Only a thank-you", "The children’s names"], "Adding role, class details and limits makes the answer fit your classroom."),
      ]),
      lesson("lesson-machine", "The 5-minute lesson plan machine", 15, [
        scenario("Sunday, 8:30 pm", "You need a complete, exciting 5-day theme on “Under the Sea” for tomorrow morning, but you are exhausted and have no ideas."),
        text(`
          ## Methodology spotlight: thematic teaching

          A good theme connects **science, songs, art, movement and stories** under one big idea. Children hear the same new words in many ways, so they remember them.
        `),
        prompt(`Act as an expert kindergarten curriculum coordinator. Create a 5-day weekly theme for 4-to-5-year-olds on "Under the Sea / Ocean Animals". For each day (Monday to Friday), give me:
1. A morning circle question of the day.
2. A 10-minute active movement game (for example, swimming like a shark or crawling like a crab).
3. One hands-on craft using recyclable items like cardboard or paper plates.
Keep instructions short, warm and zero-prep.`),
        activity("Test Day 1 before class", "Pick Day 1 from the AI plan and make the craft yourself with 3 paper plates. Is it really easy? How long did it take? Adjust the plan before Monday."),
        tip("Make it local", "Add “Use examples from India” or “Use animals found in the Bay of Bengal” to your prompt to make themes feel closer to your children’s world."),
        reflect("Which theme is coming up next in your school calendar? Write the first line of your prompt for it."),
      ]),
    ]),

    // ─────────────────────────────── MODULE 10 ──────────────────────────────
    mod("m10", "Parents, and your One-Hour Sunday", [
      lesson("parents", "Stress-free, polite parent messages", 15, [
        scenario("The biting incident", "Little Kabir bit a classmate during free play. You need to write to Kabir’s parents without making them defensive, and a reassuring note to the other child’s parents without causing panic."),
        text(`
          ## Methodology spotlight: home–school partnership

          - **Start warm:** something positive about the child.
          - **State the facts calmly:** what happened, without labels like “naughty” or “aggressive”.
          - **Explain development:** biting is common at ages 2–3, when children have big feelings and few words.
          - **Share what the school did** and **what you will do next**.
          - **Invite partnership:** “Let’s work together on…”
        `),
        prompt(`Act as an empathetic school principal. A 3-year-old child bit another child today during a dispute over a toy train. Draft two calm, reassuring and professional WhatsApp messages:
Note A: To the parents of the child who bit, explaining that it is common at this stage, what we did to guide them, and how we can work together gently at home.
Note B: To the parents of the child who was bitten, reassuring them that first aid was given immediately, the child is happy and playing, and how we are supervising.`),
        warn("Names go in last, by you", "Ask AI for the message without any names. Add the child’s name yourself, in WhatsApp, just before sending — and read it once more."),
        activity("Build your message bank", "Compare a message you wrote recently with an AI-polished version. Save the best one as a template in your phone’s notes: “Incident note”, “Absent follow-up”, “Great day today!”."),
        quiz("A good message to the biting child’s parents starts…", ["Calmly and without blame, explaining what happened and what the school did", "By calling the child aggressive", "With the other child’s full name", "By asking them to move schools"], "Partnership, not blame."),
      ]),
      lesson("one-hour-sunday", "Capstone: the One-Hour Sunday", 20, [
        scenario("Getting your weekends back", "Every Sunday evening you spend 4 hours cutting flashcards, searching for activities and feeling overwhelmed. You want your weekends back."),
        text(`
          ## Sustainable teaching

          Happy, well-rested teachers make calm, warm classrooms. The One-Hour Sunday puts together everything in this course:

          1. **10 minutes:** choose next week’s theme and check the school calendar.
          2. **10 minutes:** run the master prompt below.
          3. **25 minutes:** review, cut what doesn’t fit, add your own ideas, check for safety.
          4. **15 minutes:** gather materials and write your 1-page plan for the desk.
        `),
        prompt(`I am a kindergarten teacher for ages 4 to 5. Next week our theme is "Friendly Helpers: Doctors, Firefighters and Bakers". In one organised response, provide:
1. A 5-day daily outline (1 song, 1 movement game and 1 sensory activity per day).
2. A 3-minute read-aloud story starring a baker who forgot the flour.
3. A short, cheerful 3-sentence note to send parents on Monday morning about what we are exploring.
Keep all materials strictly ordinary (boxes, spoons, socks, paper).`, "The all-in-one master prompt"),
        activity("Your final portfolio", `1. Generate your complete weekly kit with the master prompt (change the theme to suit your class).
2. Print or handwrite a 1-page cheat sheet for your desk with your 4-piece recipe and favourite prompts.
3. Present one 5-minute story or circle-time activity to a colleague or your coordinator.`),
        points([
          "Children learn with hands, bodies and play — not screens",
          "Real objects before symbols, play before paper",
          "The room is a teacher: corners, displays and a calm space",
          "Pure sounds first, and stories as conversations",
          "Calm first, then solve — and never punish",
          "Same goal, many ways in, for every child",
          "Observe and document instead of testing",
          "AI is your assistant: you check, you decide, you protect privacy",
        ], "What you’ve learned"),
        tip("You’re ready!", "Finish this lesson to complete the course, then take the **25-question certification exam** (40 minutes, 70% to pass) to earn your certificate."),
        reflect("What will you do differently in your classroom next Monday?"),
      ]),
    ]),
  ],
};

export const JOYFUL_COURSE: Course = {
  id: JOYFUL_COURSE_ID,
  programId: JOYFUL_PROGRAM_ID,
  price: 450,
  title: "The Joyful Classroom: Modern Teaching for Playgroup to Class 5",
  category: "Early Years & Primary",
  hours: 7,
  level: "Beginner",
  blurb: "Play-based methods from Finland, Reggio Emilia, Montessori and Singapore for preschool and primary teachers — with AI as your free planning assistant.",
  ...content,
};
