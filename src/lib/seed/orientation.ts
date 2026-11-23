import type { Course, ExamQuestion, Program } from "../catalog";
import { kit, md } from "./kit";

/**
 * “Start Here: AI Made Simple & Your NextGen Journey” — the mandatory orientation every learner takes first.
 * Very basic AI for non-technical teachers, plus how NextGen Educator works and how to use the website.
 * No certificate: passing its 10-question quiz (60%) unlocks every certification exam.
 */
import { ORIENTATION_COURSE_ID, ORIENTATION_PROGRAM_ID, ORIENTATION_TITLE } from "../orientation";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, quiz, prompt, activity } = kit();

let examIndex = 0;
/** `options[0]` is correct; it is rotated so answers spread evenly across A–D. */
const q = (id: string, prompt: string, options: string[], explanation: string): ExamQuestion => {
  const target = [2, 0, 3, 1][examIndex++ % 4] % options.length;
  const wrong = options.slice(1);
  return { id, prompt, options: [...wrong.slice(0, target), options[0], ...wrong.slice(target)], answer: target, explanation };
};

export const ORIENTATION_PROGRAM: Program = {
  id: ORIENTATION_PROGRAM_ID,
  title: "NextGen Orientation",
  category: "AI Tools for Teachers",
  level: "Beginner",
  price: 0,
  orientation: true,
  description: "The short, mandatory starting point for every learner: AI in plain words, how to use it safely, and how to get the most from NextGen Educator.",
  exam: {
    minutes: 15,
    passPercent: 60,
    questions: [
      q("or01", "What must you finish before you can take any certification exam on NextGen Educator?", [
        "This orientation course and its final quiz",
        "A paid course",
        "A phone call with our team",
        "Nothing — every exam is open from day one",
      ], "The orientation is mandatory for everyone. Passing its quiz unlocks every certification exam."),
      q("or02", "Which of these is an everyday example of AI?", [
        "Google Maps suggesting a faster route because of traffic",
        "A calculator adding two numbers",
        "A light switch turning on a bulb",
        "A printed timetable on the staff-room wall",
      ], "Maps learn from traffic patterns to predict the fastest route — that is AI at work in daily life."),
      q("or03", "An AI assistant tells you a ‘fact’ very confidently, but it is wrong. What is this called?", [
        "A hallucination",
        "A virus",
        "A password error",
        "A software update",
      ], "AI can sound sure and still be wrong. Always check facts, names, dates and numbers before you use them."),
      q("or04", "Which of these is the best prompt to give an AI assistant?", [
        "“I teach Class 6 science in India. Explain photosynthesis to 11-year-olds in 5 simple sentences with one example from an Indian home.”",
        "“Photosynthesis.”",
        "“Tell me everything.”",
        "“Make it good.”",
      ], "Good prompts say who you are, what you need, who it is for and the format you want."),
      q("or05", "Which information should you never type into an AI tool?", [
        "Students’ names together with their marks, phone numbers or Aadhaar details",
        "The topic of tomorrow’s lesson",
        "The class you teach",
        "A request to make a worksheet easier",
      ], "Protect your students’ privacy: never share personal details. Describe the class in general terms instead."),
      q("or06", "You used AI to draft a worksheet. Who is responsible for checking it before it reaches students?", [
        "You, the teacher — AI drafts, you check and decide",
        "The AI company",
        "The students",
        "Nobody — AI is always correct",
      ], "AI is your assistant, not your replacement. You review every piece for accuracy, level and suitability."),
      q("or07", "Where do you see your courses, progress, certificates and payments on the website?", [
        "My Learning",
        "The Verify page",
        "The home page footer",
        "The Practice Tests section",
      ], "My Learning is your personal dashboard, with “Your next step” at the top."),
      q("or08", "You are not sure which course to choose. What is the quickest way to decide?", [
        "Use “Find my course” and answer three short questions",
        "Enroll in every course",
        "Wait for a certificate to arrive",
        "Skip the courses and take an exam",
      ], "The course finder recommends the best courses for your role, goal and experience in about 30 seconds."),
      q("or09", "When does a certification exam unlock for you?", [
        "After you finish every lesson in that programme and your ID is verified",
        "As soon as you register",
        "Only after you pay for a different course",
        "Only on weekends",
      ], "Exams open once the coursework is done and our team has verified your identity, so every certificate is genuine."),
      q("or10", "How can a school check that your NextGen certificate is genuine?", [
        "By scanning its QR code or entering the credential ID on the Verify page",
        "By calling the AI company",
        "By looking at the colour of the certificate",
        "They cannot check it",
      ], "Every certificate has a unique credential ID and QR code that opens a live verification page."),
    ],
  },
};

export const ORIENTATION_COURSE: Course = {
  id: ORIENTATION_COURSE_ID,
  programId: ORIENTATION_PROGRAM_ID,
  price: 0,
  title: ORIENTATION_TITLE,
  category: "AI Tools for Teachers",
  subject: "all",
  hours: 1,
  level: "Beginner",
  blurb: "A short, friendly orientation for every learner: what AI really is, how to use it safely, and how NextGen Educator works — step by step.",
  overview: md(`
    Welcome! Before you begin any course, take this short orientation. It needs no technical knowledge at all.

    In about 40 minutes you will understand what AI is (you already use it every day), write your very first prompt, learn three golden rules for using AI safely, and find your way around the NextGen Educator website with confidence.

    **It is mandatory and has no certificate.** Finish the lessons and pass a 10-question quiz (60% to pass). That unlocks every certification exam on the site.
  `),
  outcomes: [
    "Explain what AI is in simple words, with everyday examples",
    "Write a clear prompt and get a useful answer from a free AI assistant",
    "Follow three golden rules for using AI safely and honestly",
    "Find courses, learn lessons and track progress in My Learning",
    "Understand how exams, certificates and verification work",
    "Know where to get help when you need it",
  ],
  modules: [
    mod("or-m1", "Welcome to NextGen Educator", [
      lesson("or-l1", "Why we exist — and why you are here", 4, [
        text(`
          ## Teaching is changing. You don’t have to face it alone.

          Smart classes, AI tools and NEP 2020 are changing what schools expect from teachers. Many experienced teachers tell us they feel left behind by technology — not because they can’t learn, but because nobody explained it simply.

          **That is why NextGen Educator exists:** to help teachers in India learn modern teaching skills step by step, in simple language, on their own phone, and to prove those skills with a certificate any school can check.
        `),
        scenario("Meet Meena ma’am", `
          Meena has taught Class 5 for 15 years. Her students love her. But in a recent interview, the panel asked: “How do you use AI in your teaching?” — and she had no answer.

          Six weeks later, after short lessons in her free periods, she plans lessons faster with AI, knows how to keep student data safe, and has a QR-verified certificate on her CV. **Your story can start the same way — today.**
        `),
        points([
          "Short lessons (most take 10–15 minutes) that work on any smartphone",
          "Practical skills you can use in class the very next day",
          "A fair online exam for each certification programme",
          "A certificate with a QR code that any school can verify",
          "A real team to help you when you get stuck",
        ], "What NextGen Educator gives you"),
        quiz("What is the main goal of NextGen Educator?", [
          "To help teachers learn modern skills simply and prove them with a trusted certificate",
          "To replace teachers with AI",
          "To sell computers to schools",
          "To teach students directly",
        ], "We exist for teachers: simple, practical learning and a certificate that schools can trust."),
        reflect("What is one thing you hope to be able to do after your first course?"),
      ]),
      lesson("or-l2", "How your NextGen journey works", 4, [
        text(`
          ## Six simple steps

          1. **Orientation** — this short course. It is the same for everyone and it is mandatory.
          2. **Complete your profile** — add your details, a masked Aadhaar or PAN, and your CV, once. This is how we make sure every certificate belongs to the right person.
          3. **Choose your courses** — use *Find my course* or browse the catalogue. Free courses: tap *Request access*. Paid courses: tap *Enroll now*.
          4. **Learn** — short lessons with examples, activities and quick checks. Your progress is saved automatically.
          5. **Take the exam** — when you finish a programme’s lessons, its timed online exam unlocks.
          6. **Get certified** — pass the exam and download your certificate the same day, with a QR code and a credential ID.
        `),
        note("Why is this orientation mandatory?", "Because everyone should start with the same strong foundation: what AI is, how to use it safely, and how the website works. You only do it once. Passing its quiz unlocks every certification exam."),
        quiz("After this orientation, what is the next step on your journey?", [
          "Complete your profile with your details, ID and CV",
          "Take every certification exam at once",
          "Pay for all courses",
          "Wait for a certificate in the post",
        ], "Your profile comes next. It is a one-time step that lets our team verify you and unlock your courses."),
      ]),
    ]),
    mod("or-m2", "AI made simple", [
      lesson("or-l3", "What is AI? You already use it every day", 5, [
        text(`
          ## AI in one sentence

          **Artificial Intelligence (AI)** is technology that learns patterns from a huge number of examples and uses them to make predictions or create something new.

          You don’t need to know how it works inside — just as you don’t need to know how a car engine works to drive.

          ### You already use AI
          - **Google Maps** suggests a faster route because it has learned traffic patterns.
          - **Your phone keyboard** guesses the next word you will type.
          - **YouTube** recommends videos based on what you have watched.
          - **Your bank** flags a suspicious transaction as possible fraud.

          ### The new kind: AI that writes and explains
          Tools like **ChatGPT, Gemini, Claude and Copilot** are AI *assistants*. You type a request in plain language — English or Hindi — and they reply with text: an explanation, a lesson idea, a worksheet, a letter to parents.
        `),
        tip("A simple way to think about it", "Imagine a very well-read assistant who has read millions of books. It is quick and helpful — but it has never been inside your classroom, and sometimes it makes things up. You stay in charge."),
        quiz("Which of these is an example of AI you may already use?", [
          "Your phone suggesting the next word while you type a message",
          "A wall clock showing the time",
          "A chalkboard",
          "A paper register",
        ], "Predictive text learns from patterns in how people write — that is AI."),
        quiz("What can AI assistants like ChatGPT or Gemini do for a teacher?", [
          "Draft explanations, lesson ideas and worksheets from a plain-language request",
          "Teach the class while the teacher is away",
          "Know every student personally",
          "Guarantee every answer is correct",
        ], "They are drafting assistants. They save time, and you check and adapt what they produce."),
      ]),
      lesson("or-l4", "Talking to AI: your very first prompt", 6, [
        text(`
          ## What is a prompt?

          A **prompt** is simply the message you type to an AI assistant. The clearer your prompt, the better the answer.

          ### A simple recipe
          - **Who you are** — “I am a Class 6 science teacher in India.”
          - **What you need** — “Explain photosynthesis…”
          - **Who it is for** — “…to 11-year-olds…”
          - **The format** — “…in 5 simple sentences with one everyday example.”
        `),
        prompt(`
          I am a Class 6 science teacher in India. Explain photosynthesis to 11-year-old students in 5 simple sentences. Include one everyday example from an Indian home.
        `),
        activity("Try it now (2 minutes)", `
          1. Open any free AI assistant: ChatGPT, Gemini, Claude or Copilot (in your phone’s browser — no app needed).
          2. Copy the prompt above, paste it, and send.
          3. Now change one thing — your class, your subject or the topic — and send it again.

          Notice how a clear request gets a clear answer. You can also type in Hindi.
        `),
        quiz("Which prompt will give the most useful answer?", [
          "“I teach Class 4 maths. Give me 5 word problems on fractions using Indian rupees, with answers.”",
          "“Maths.”",
          "“Help.”",
          "“Make questions.”",
        ], "It says who you are, what you need, for whom, and the format — the four parts of a good prompt."),
        reflect("What is one task in your week that a good prompt could make faster?"),
      ]),
      lesson("or-l5", "Use AI safely: three golden rules", 5, [
        text(`
          ## Rule 1 — Check the facts
          AI can be **confidently wrong**. This is called a *hallucination*. Always check names, dates, numbers and facts before you use them in class.

          ## Rule 2 — Protect privacy
          Never type students’ names with their marks, phone numbers, addresses, photos or Aadhaar details into an AI tool. Describe the class in general words instead: “a mixed-ability Class 7”.

          ## Rule 3 — You are the teacher
          AI drafts; **you decide**. Check every worksheet, question and explanation for accuracy, level and suitability before it reaches students — and be honest about when you used AI.
        `),
        warn("Never share", "Student names with marks · phone numbers · addresses · photos · Aadhaar or other ID numbers · anything you would not put on a public notice board."),
        scenario("What would you do?", `
          You ask an AI assistant for the year India’s first satellite was launched. It answers confidently, but you are not sure. What do you do?

          **Best choice:** check it in your textbook or a trusted source before teaching it. (Aryabhata was launched in 1975.)
        `),
        quiz("You want AI help writing progress comments for your class. What is the safe way?", [
          "Describe each student’s progress in general terms, without names or marks, then personalise the comments yourself",
          "Paste the full mark sheet with every student’s name",
          "Share students’ phone numbers so the AI can contact parents",
          "Let the AI send the comments directly",
        ], "Keep personal data out of AI tools. Use general descriptions, then add names and details yourself."),
        quiz("An AI answer sounds very confident. What should you do before using it in class?", [
          "Check the facts in a trusted source",
          "Use it immediately — confident answers are always right",
          "Ask students to check it during the exam",
          "Print it without reading",
        ], "Confidence is not proof. Rule 1: always check the facts."),
      ]),
    ]),
    mod("or-m3", "Using the NextGen website", [
      lesson("or-l6", "Finding your way around", 5, [
        text(`
          ## The top menu
          - **Find my course** — answer three quick questions and get personal recommendations.
          - **Courses** — every course, with its full syllabus, level, hours and fee.
          - **How it works** and **Practice Tests** — learn more and try a free sample quiz.

          ## My Learning — your personal dashboard
          Tap your name (or **My Learning**) at the top. You will find:
          - **Overview** — your *next step*, your progress and your learning journey
          - **My courses** — every course you have joined, and your certification programmes
          - **My notes** — PDF notes our team shares with you
          - **Certificates** — download, share and add to LinkedIn
          - **Resume upgrade** — your professionally improved CV, after you complete a course
          - **Payments** — fees, receipts and payment status
          - **My profile** — your details and documents
        `),
        tip("Lost? Look for “Your next step”", "The big card at the top of My Learning always tells you the single most useful thing to do next."),
        activity("Explore (2 minutes)", `
          Open **My Learning** in a new tab. Find the **Your next step** card, then tap **My courses** and **Payments** to see what is there. Come back here when you’re done.
        `),
        quiz("Where do you find your certificates to download or add to LinkedIn?", [
          "My Learning → Certificates",
          "The home page",
          "The Practice Tests section",
          "The course finder",
        ], "All your certificates live in My Learning → Certificates."),
      ]),
      lesson("or-l7", "Lessons, exams and certificates", 5, [
        text(`
          ## How a lesson works
          Read or watch, try the quick checks and activities, then tap **Mark complete & continue**. Your progress saves automatically, so you can stop and continue later, on your phone or a computer.

          ## Getting into a course
          - **Free courses:** tap *Request access* and our team unlocks the course for you.
          - **Paid courses:** tap *Enroll now*. You can pay securely online where available, or ask our representative to call you first.

          ## Certification exams
          - The exam unlocks when you finish **every lesson** in a programme and your **ID is verified**.
          - It is **timed**, the questions are **shuffled**, and the pass mark is shown before you begin.
          - You get up to **3 attempts in any 24 hours**. If you need more, revise the lessons and try the next day.

          ## Your certificate
          Pass, and your certificate is ready instantly — with a **QR code** and a **credential ID**. Download the PDF, add it to LinkedIn, and share it with schools. Anyone can check it on our **Verify** page.
        `),
        quiz("You haven’t finished all the lessons in a programme yet. Can you take its exam?", [
          "No — the exam unlocks only after every lesson is complete and your ID is verified",
          "Yes, any time",
          "Yes, if you pay extra",
          "Only on your birthday",
        ], "Finishing the lessons first means every certificate stands for real learning."),
        quiz("A principal wants to check that your certificate is real. What should they do?", [
          "Scan the QR code or enter your credential ID on the Verify page",
          "Email the AI company",
          "Look at the paper quality",
          "Nothing can be checked",
        ], "Every certificate links to a live verification page — no account needed."),
      ]),
      lesson("or-l8", "Getting help — and your next step", 3, [
        text(`
          ## You are never on your own
          - Tap **Talk to an advisor** on any course page, or **Request a call back**, and our team will call you.
          - Call us on **+91 91296 04415**.
          - Stuck on a lesson? Go back to *Your next step* in My Learning.

          ## What happens now
          Take the **final quiz**: 10 questions, about 15 minutes, **60% to pass**. There is no certificate for this orientation — passing it unlocks every certification exam on NextGen Educator. If you don’t pass the first time, review the lessons and try again.
        `),
        points([
          "AI learns patterns from examples — you already use it every day",
          "Good prompts say who you are, what you need, for whom and in what format",
          "Three golden rules: check facts, protect privacy, you are the teacher",
          "My Learning is your dashboard; “Your next step” shows what to do",
          "Exams unlock after the lessons; certificates are QR-verifiable",
        ], "Remember"),
        reflect("Which course will you start after this orientation, and why?"),
      ]),
    ]),
  ],
};
