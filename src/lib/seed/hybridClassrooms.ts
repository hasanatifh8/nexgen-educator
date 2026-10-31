import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Premium · Advanced · 6 hours — teaching across rooms and screens. */
export const HYBRID_CLASSROOMS: Content = {
  instructor: { name: "Jonah Weiss", title: "Digital Citizenship Lead" },
  overview: `Hybrid and blended teaching is here to stay: students learning from home during illness, floods or heatwaves; flipped lessons; coaching and tuition online; and schools using platforms like DIKSHA alongside the classroom.

This course helps you keep remote and in-person learners **equally engaged and accountable**. You’ll learn the main blended and hybrid models, design lessons that work across screens and rooms, set up simple, low-bandwidth technology, run inclusive discussions, assess fairly online, and plan for the digital divide and student wellbeing.`,
  outcomes: [
    "Choose a blended or hybrid model that fits your context",
    "Design lessons that work for remote and in-room students at the same time",
    "Balance synchronous and asynchronous learning",
    "Use roles and shared workspaces to keep every student active",
    "Run inclusive hybrid discussions",
    "Assess fairly and maintain integrity in online and hybrid settings",
    "Plan for low bandwidth, limited devices and student wellbeing",
  ],
  modules: [
    mod("m1", "Models and principles", [
      lesson("models", "Blended, hybrid and flipped: what’s the difference?", 20, [
        text(`
          ## Key models

          - **Blended learning:** a mix of face-to-face and online learning for the same students (for example, classroom teaching plus DIKSHA practice at home)
          - **Flipped classroom:** students meet new content at home (video, reading), and class time is for practice, discussion and problem-solving
          - **Station rotation:** groups rotate through stations in the room, one of which is online
          - **Hybrid (simultaneous):** some students in the room, others joining live online, at the same time
          - **HyFlex:** students choose each session whether to attend in person, live online or asynchronously

          ## Choose by purpose and constraints

          The best model depends on your students’ devices and connectivity, your goals and your school’s capacity, not on what is fashionable.
        `),
        quiz(
          "In a flipped classroom, what usually happens during class time?",
          ["Practice, discussion and problem-solving with teacher support", "Watching the lecture video", "Nothing; class is cancelled", "Only tests"],
          "Flipping moves first exposure to home, freeing class time for active learning.",
        ),
      ]),
      lesson("community-inquiry", "Presence: the Community of Inquiry", 20, [
        text(`
          ## Three kinds of presence

          The **Community of Inquiry** framework (Garrison, Anderson and Archer) explains what makes online and blended learning work:

          - **Teaching presence:** clear design, organisation and active facilitation
          - **Social presence:** students feel they belong and can communicate openly
          - **Cognitive presence:** students build understanding through inquiry and reflection

          When remote students feel “forgotten”, one of these presences is usually missing.
        `),
        tip("Quick wins", "Greet remote students by name first, ask them the first question, and give them a visible role. It builds social and teaching presence in minutes."),
        reflect("Think of a time online learning felt disconnected. Which type of presence was missing?"),
      ]),
      lesson("design-for-both", "Designing for both audiences", 25, [
        text(`
          ## Remote-first planning

          If an activity works for remote students, it almost always works in the room. Plan **shared digital or shareable workspaces** first, then add in-room touches.

          ## Checklist for each activity

          - Can remote students **see and hear** everything?
          - Can they **contribute** in the same way, or an equivalent way?
          - Is there a **backup** if their connection drops (instructions in writing, a task they can do offline)?
          - How will you **see** their work?
        `),
        tip("Assign a remote buddy", "Pair each remote learner with an in-room partner who keeps them in the loop and raises their hand for them if needed."),
        quiz(
          "Why plan hybrid activities ‘remote-first’?",
          ["Activities that work for remote students usually work in the room too", "Remote students are more important", "It avoids using the classroom", "It means you never need to teach live"],
          "Designing for the harder setting first ensures everyone can participate.",
        ),
      ]),
    ]),

    mod("m2", "Technology that works", [
      lesson("setup", "A simple, reliable setup", 25, [
        text(`
          ## Audio first

          Remote students forgive poor video but not poor audio. A **phone or laptop placed close to the teacher**, or a cheap clip-on or USB microphone, makes a huge difference. Repeat in-room students’ questions aloud.

          ## Video and board

          - Point the camera at **the board and you**, not the ceiling
          - Use larger writing; check readability from the remote view
          - Share slides or a document directly instead of filming a projector

          ## Before class

          Test the link, audio and screen-share 5 minutes early. Keep a **written plan B**: if the connection fails, students know which task to do and where to submit it.
        `),
        warn("Data and privacy", "Use school-approved platforms. Don’t record students without following your school’s consent policy, and never share class links publicly."),
      ]),
      lesson("low-bandwidth", "Low bandwidth and limited devices", 25, [
        text(`
          ## Design for the student with the weakest connection

          Many students share one phone with siblings, have limited data or patchy coverage.

          - Keep videos **short** (under 8 minutes) and offer them for **download**
          - Send **PDFs or images of worksheets** over WhatsApp rather than heavy platforms
          - Allow **asynchronous** submission (photo of notebook work)
          - Use **audio-only** calls or radio/TV lessons where video isn’t possible
          - Schedule live sessions when shared devices are free (often evenings)

          ## National resources

          **DIKSHA** offers free, curriculum-linked content (including QR-coded textbooks) in many Indian languages. **PM eVidya** brings together DIKSHA, TV channels, radio and podcasts. **SWAYAM** offers online courses, including for teachers.
        `),
        resource("DIKSHA", "https://diksha.gov.in", "National platform for school education: textbook-linked content in many languages"),
        resource("PM eVidya", "https://pmevidya.education.gov.in", "Multi-mode access to digital education: TV, radio, online"),
        resource("SWAYAM", "https://swayam.gov.in", "Free online courses, including teacher professional development"),
        quiz(
          "A student has one shared phone with limited data. Which approach helps most?",
          ["Short downloadable resources and flexible asynchronous submission", "Mandatory 3-hour live video sessions", "High-definition video lectures only", "Penalties for missing live classes"],
          "Low-bandwidth, flexible design keeps disadvantaged students included.",
        ),
      ]),
      lesson("tools", "Choosing digital tools", 20, [
        text(`
          ## Fewer tools, used well

          Pick **one platform** for each job and stick with it:

          - **Home base:** Google Classroom, Microsoft Teams or your school LMS for assignments and announcements
          - **Live sessions:** Google Meet, Zoom or Teams
          - **Collaboration:** shared Google Docs/Slides, Padlet
          - **Quick checks:** Google Forms, Mentimeter

          Every new tool costs learning time for students and parents.
        `),
        tip("A one-page guide", "Give families a one-page guide (in their language) explaining which tool is used for what, and how to log in."),
        resource("Google Classroom", "https://classroom.google.com", "Free class home base for assignments and announcements"),
        resource("Padlet", "https://padlet.com", "Shared boards for collaborative work"),
      ]),
    ]),

    mod("m3", "Engagement across screens and rooms", [
      lesson("sync-async", "Balancing synchronous and asynchronous", 20, [
        text(`
          ## Use live time for what needs live time

          **Synchronous** (live) time is best for: discussion, questions, collaborative problem-solving, feedback, building relationships.

          **Asynchronous** (anytime) learning is best for: watching explanations, reading, practice, reflection, longer assignments.

          ## A typical week

          - Short live session: check-in, discussion, live problem-solving
          - Asynchronous: 2–3 short videos or readings with practice tasks
          - A clear weekly checklist so students know exactly what to do
        `),
        quiz(
          "What is the best use of limited live (synchronous) time?",
          ["Discussion, questions and collaborative problem-solving", "Reading the textbook aloud for an hour", "Silent individual worksheets", "Taking attendance only"],
          "Live time is precious, so use it for interaction that can’t happen asynchronously.",
        ),
      ]),
      lesson("roles-workspaces", "Roles and shared workspaces", 25, [
        text(`
          ## Give everyone a job

          - **Facilitator:** keeps the group on task
          - **Recorder:** writes in the shared document
          - **Reporter:** shares the group’s answer
          - **Chat monitor:** watches the chat and raises remote questions
          - **Timekeeper**

          Rotate roles so every student, remote or in-room, leads sometimes.

          ## Shared workspaces

          A **shared document or slide per group** lets you see every group’s thinking in real time, and lets remote and in-room students build the same product.
        `),
        tip("Mixed groups", "Put remote and in-room students in the same groups, with an in-room laptop or phone as the group’s connection."),
        reflect("Design a 15-minute group activity with roles for a hybrid class. Who does what?"),
      ]),
      lesson("hybrid-discussion", "Inclusive hybrid discussions", 25, [
        scenario("The silent screen", "Remote students go quiet during discussions while in-room students dominate."),
        text(`
          ## Structures that include everyone

          - **Remote-first questioning:** ask remote students first
          - **Think time + chat:** everyone types an answer in the chat before anyone speaks
          - **Structured turns:** go round the room and the screen alternately
          - **Polls** to surface everyone’s view at once
          - **Breakout groups** with clear tasks and roles, then share back

          ## Norms

          Agree on norms: cameras optional but participation expected; use “raise hand”; in-room students speak towards the microphone.
        `),
        quiz(
          "What best brings remote students into the discussion?",
          ["Structured turns, chat-first answers and assigned roles", "Speaking only to the room", "Asking remote students to stay muted", "Giving remote students separate content"],
          "Roles and structured participation keep remote learners active and accountable.",
        ),
      ]),
    ]),

    mod("m4", "Assessment, wellbeing and equity", [
      lesson("assessment-online", "Fair assessment online", 25, [
        text(`
          ## Shift what you assess

          Closed-book recall tests are hard to secure online. Favour assessments where **understanding is visible**:

          - Open-book, application-based questions
          - Short **oral checks** (2–3 minutes per student)
          - **Process evidence:** photos of rough work, drafts, version history
          - Projects with local, personal elements
          - Frequent low-stakes quizzes for practice, not high-stakes marks

          ## Integrity without surveillance

          Set clear rules (including AI-use levels), design tasks that require explanation, and talk to students about honesty. Intrusive proctoring raises privacy and equity concerns.
        `),
        quiz(
          "Which online assessment best shows genuine understanding?",
          ["An application question followed by a short oral explanation", "A closed-book recall test at home", "A copied worksheet", "A test that only checks submission time"],
          "Requiring students to explain their reasoning makes learning visible and reduces misuse.",
        ),
      ]),
      lesson("wellbeing", "Wellbeing, screen time and safety", 20, [
        text(`
          ## Protect attention and health

          - Keep live sessions short with **breaks** every 20–30 minutes
          - Use **offline tasks** (notebook work, reading, hands-on activities) to cut screen time
          - Watch for students who disappear; a short personal call often helps
          - Be realistic about workload: online tasks often take longer than planned

          ## Online safety

          - Use waiting rooms or controlled links
          - Teach students not to share personal details or meeting links
          - Make reporting routes for harassment clear
        `),
        resource("National Cyber Crime Reporting Portal", "https://www.cybercrime.gov.in", "Report online harassment and cybercrime"),
        reflect("How much daily screen time does your plan require of a Class 6 student? How could you reduce it?"),
      ]),
      lesson("families", "Equity and working with families", 20, [
        text(`
          ## Close the digital divide where you can

          - Survey students about **devices, connectivity and quiet space** at the start
          - Offer **printed packs** and phone check-ins for students without access
          - Coordinate with school leaders on device lending or community learning spaces
          - Never grade students on access they don’t have

          ## Communicate clearly with families

          Short, regular updates in the family’s language: what’s due, how to help, who to contact. A weekly WhatsApp message with the checklist works well for many schools.
        `),
        note("Girls and shared devices", "In homes with one device, girls often get less access. Flexible timing and offline options help keep everyone learning."),
      ]),
      lesson("playbook", "Your hybrid teaching playbook", 30, [
        text(`
          ## Build a one-page playbook

          - **Model:** which blended/hybrid model you use and why
          - **Setup:** devices, audio and plan B
          - **Weekly rhythm:** live and asynchronous components, and the checklist format
          - **Engagement:** roles, discussion structures, remote buddy system
          - **Assessment:** how you’ll see learning and maintain integrity
          - **Equity:** offline options and family communication
          - **Wellbeing:** breaks, screen-time limits, safety
        `),
        points([
          "Choose the model that fits your students’ access and your goals",
          "Plan remote-first and prioritise audio",
          "Use live time for interaction; asynchronous time for content and practice",
          "Give every student a role and a voice",
          "Assess understanding through explanation and process",
          "Design for the student with the least access",
        ], "Course summary"),
        reflect("Write your hybrid teaching playbook. What will you test first next week?"),
      ]),
    ]),
  ],
};
