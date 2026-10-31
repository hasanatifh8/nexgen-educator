import { kit, type Content } from "./kit";

const { lesson, mod, text, tip, note, warn, points, scenario, reflect, resource, quiz } = kit();

/** Premium · Advanced · 3 hours — integrity, fairness and policy in the AI era. */
export const AI_ETHICS: Content = {
  instructor: { name: "Jonah Weiss", title: "Digital Citizenship Lead" },
  overview: `Students can now produce a polished essay in seconds. Banning AI doesn’t work, and AI detectors are unreliable. This course helps you build **clear, fair AI-use policies** and redesign assignments so they **reward authentic thinking**, without turning your classroom into a detection arms race.

We cover task-level AI-use levels, responding fairly to suspected misuse, process-based assessment, bias and fairness in AI systems, student data privacy under India’s DPDP Act, and teaching students to be responsible AI users and critical consumers of deepfakes and misinformation.`,
  outcomes: [
    "Write a clear, task-level AI-use policy using a levelled scale",
    "Explain why AI detectors must never be used as sole evidence",
    "Respond to suspected misuse through a fair, process-based conversation",
    "Redesign assignments so the thinking process is visible",
    "Identify bias, privacy and safety risks in AI tools used in school",
    "Plan lessons that teach students ethical, critical AI use",
  ],
  modules: [
    mod("m1", "Integrity in the AI era", [
      lesson("landscape", "What has changed, and what hasn’t", 15, [
        text(`
          ## What changed

          - Essays, summaries, code and even handwritten-style answers can be generated instantly
          - Homework done at home can no longer be assumed to be the student’s own work
          - Students may use AI without knowing whether it’s allowed

          ## What hasn’t changed

          - The purpose of assessment: **evidence of what a student can do**
          - The value of **thinking, practice and struggle** for learning
          - Your knowledge of your students’ voice and ability

          The question isn’t “How do I catch AI use?” but “**How do I design tasks where I see real learning?**”
        `),
        reflect("Which of your current assignments could a student complete entirely with AI in under five minutes?"),
      ]),
      lesson("policy", "Writing a clear AI-use policy", 25, [
        text(`
          ## Use levels, not a single rule

          A blanket “no AI” rule is unenforceable; “anything goes” undermines learning. Label **each task** with a level. A simple traffic-light version:

          - **Red: no AI.** The task assesses your own unaided skill (e.g. in-class writing, oral viva).
          - **Amber: AI for ideas only.** Brainstorming or explaining a concept is fine; the final work is yours. Disclose how you used it.
          - **Green: AI allowed with acknowledgement.** You may use AI for drafting or feedback; include your prompts and explain what you changed.

          Researchers have proposed more detailed versions, such as the five-level **AI Assessment Scale (AIAS)**, which many schools and universities adapt.

          ## Make it visible

          Print the level on every task sheet and explain **why** that level fits the task’s purpose.
        `),
        tip("Disclosure template", "“I used [tool] to [purpose]. My prompts were: … I changed / rejected: …” Short, honest disclosures teach students to reflect on their use."),
        resource("AI Assessment Scale (AIAS)", "https://aiassessmentscale.com", "A five-level framework for setting AI use in assessments"),
        quiz(
          "A teacher wants students to brainstorm with AI but write the essay themselves. Which level fits?",
          ["Amber: AI for ideas only, with disclosure", "Red: no AI", "Green: AI drafting allowed", "No level; just trust students"],
          "Amber allows idea generation while keeping the final writing the student’s own.",
        ),
      ]),
      lesson("detectors", "Why AI detectors fail", 15, [
        text(`
          ## Detectors are unreliable

          AI-detection tools estimate how “predictable” text is. They produce **false positives** (human writing flagged as AI), especially for:

          - **Second-language English writers**, whose simpler phrasing looks predictable
          - Students who write in a formal, formulaic style taught for exams
          - Short texts

          They also produce **false negatives**: lightly edited AI text often passes. Several detector developers have themselves warned against using scores as proof.
        `),
        warn("Never sole evidence", "Never use a detector score as the sole evidence for an integrity decision. A false accusation can seriously harm a student and their trust in school."),
        quiz(
          "Which group of students is most at risk of false positives from AI detectors?",
          ["Students writing in a second language", "Students who write very long essays", "Students who use handwriting", "Students in science subjects only"],
          "Simpler, more predictable phrasing by second-language writers is more likely to be wrongly flagged.",
        ),
      ]),
      lesson("suspected-misuse", "Responding fairly to suspected misuse", 20, [
        scenario("The suspicious essay", `An essay from Ananya is far more polished than her usual work and uses phrases she has never used before. A colleague suggests giving her zero.

Instead, her teacher asks Ananya to talk through how she wrote it: her outline, sources and drafts, and to explain two paragraphs in her own words.`),
        text(`
          ## A fair process

          1. **Check the task level.** Was AI use clearly prohibited for this task?
          2. **Look for real evidence**: drafts, notes, version history, comparison with in-class work.
          3. **Have a conversation**, not an interrogation: “Talk me through how you wrote this.”
          4. **Ask the student to explain or extend** a section in their own words.
          5. **Follow school policy**: document what you found, and focus on learning, not only punishment.

          ## When students misuse AI

          Often it’s confusion about the rules, time pressure or low confidence. The best outcome is usually **redoing the task** with support, plus a clear understanding of the rule.
        `),
        quiz(
          "What’s the most sound first step with a suspected AI-written essay?",
          ["Have a conversation about the student’s process and drafts", "Run a detector and assign zero", "Ban all devices for the whole class", "Ignore it"],
          "A process conversation gathers real evidence and is fair to the student.",
        ),
      ]),
    ]),

    mod("m2", "Designing for authentic learning", [
      lesson("process-tasks", "Designing for process", 25, [
        text(`
          ## Make thinking visible

          - **Staged submissions:** proposal → outline → draft → final, with brief feedback at each stage
          - **In-class components:** start or finish the writing in class
          - **Oral defence or viva:** 3 minutes per student to explain key choices
          - **Reflection logs:** what was hard, what changed, what I learned
          - **Version history:** for typed work, ask for the document’s history

          ## Make the task personal and local

          Tasks that draw on **students’ own experiences, local data or class discussions** are harder to outsource and more meaningful:

          - “Interview a family member about how farming in your area has changed.”
          - “Use the rainfall data our class collected to…”
        `),
        tip("AI as a visible tool", "Sometimes, ask students to **critique** an AI answer: find its errors, missing perspectives and weak arguments. It builds exactly the skills AI can’t replace."),
        quiz(
          "Which task design makes AI misuse least likely and learning most visible?",
          ["A staged project with an in-class draft and a short oral explanation", "A take-home essay on a general topic due in two weeks", "A worksheet copied from the textbook", "A multiple-choice quiz taken at home"],
          "Staging, in-class work and oral explanation reveal the student’s thinking.",
        ),
      ]),
      lesson("redesign-workshop", "Workshop: redesign one assignment", 25, [
        text(`
          ## Take one existing assignment and redesign it

          1. Write the **learning outcome** it is meant to show.
          2. Decide the **AI-use level** that fits that outcome, and why.
          3. Add **at least two process checkpoints** (plan, draft, conference, reflection).
          4. Add a **personal or local** element.
          5. Update the **rubric** so the process and reasoning earn credit, not just the polished product.
        `),
        reflect("Describe your assignment before and after the redesign. What will now show you that learning really happened?"),
      ]),
    ]),

    mod("m3", "Fairness, privacy and digital citizenship", [
      lesson("bias-fairness", "Bias and fairness in AI tools", 15, [
        text(`
          ## Where bias comes from

          AI learns from human-written data, including its stereotypes. It may:

          - Associate certain jobs with one gender
          - Under-represent Indian languages, regions and communities
          - Produce lower-quality output in regional languages
          - Assume Western contexts as the default

          ## What teachers can do

          - Review content with an **equity lens** before using it
          - Ask for diverse, inclusive examples explicitly
          - Teach students to **spot and question** bias in AI output
        `),
        scenario("Classroom activity", "Students ask an image generator for “a scientist”, “a nurse” and “a farmer” and analyse the results: who is shown, and who is missing? They then discuss how this could shape beliefs."),
        reflect("Where could AI bias most affect your students’ learning or self-image?"),
      ]),
      lesson("privacy-safety", "Privacy, safety and the law", 20, [
        text(`
          ## Student data in India

          The **Digital Personal Data Protection Act, 2023** and the **DPDP Rules, 2025** treat anyone under 18 as a child. Organisations generally need **verifiable parental consent** to process children’s data and must not track or target them with ads. Schools have limited exemptions for their own educational activities and student safety, but these don’t cover sending student data to unapproved third-party AI tools.

          ## Practical rules

          - Use only **school-approved** tools with students
          - **Never** enter identifiable student information into public AI tools
          - Check age requirements in each tool’s terms
          - Tell parents how AI is used in class
        `),
        note("Not legal advice", "This is a summary for teachers. Your school’s data protection policy and legal advisers have the final word."),
        resource("MeitY: Data protection framework", "https://www.meity.gov.in/data-protection-framework", "Official DPDP Act and Rules"),
        quiz(
          "A free AI app offers to mark essays if you upload them with student names. What should you do?",
          ["Don’t upload identifiable work unless the school has approved the tool and the data use", "Upload them, since it saves time", "Upload them but delete the app later", "Ask students to upload their own essays to their personal accounts"],
          "Children’s personal data needs a lawful basis and an approved, safe tool.",
        ),
      ]),
      lesson("deepfakes", "Deepfakes, misinformation and digital citizenship", 20, [
        text(`
          ## A new media-literacy challenge

          AI can create realistic fake images, voices and videos. Students need habits to check before they believe or share:

          1. **Pause:** strong emotion is a warning sign
          2. **Check the source:** who posted it first?
          3. **Look for corroboration:** do reliable outlets report it?
          4. **Inspect details:** odd hands, text, lighting or lip-sync
          5. **Don’t forward** what you can’t verify

          ## Harmful uses

          Fake or altered images of classmates are a serious form of harassment and can be a crime. Make your school’s reporting route clear. India’s national cybercrime portal accepts complaints, including on behalf of children.
        `),
        resource("National Cyber Crime Reporting Portal", "https://www.cybercrime.gov.in", "Report online harassment, including deepfakes"),
        resource("Common Sense Education: Digital citizenship", "https://www.commonsense.org/education/digital-citizenship", "Free lessons on media literacy and online safety"),
      ]),
      lesson("teach-students", "Teaching students to use AI well", 20, [
        text(`
          ## Four habits to teach explicitly

          - **Question it:** AI can be wrong, biased or out of date
          - **Verify it:** check important facts in a reliable source
          - **Own it:** your name means you stand behind the work
          - **Disclose it:** say how you used AI when it’s allowed

          UNESCO’s AI competency frameworks for students and teachers put a **human-centred mindset** and **ethics** at the core, alongside technical skills.
        `),
        points([
          "Set AI-use levels per task and explain why",
          "Detectors are not evidence; conversations and process are",
          "Design tasks with visible process and personal, local elements",
          "Review AI content for bias; teach students to spot it",
          "Protect student data and use approved tools",
        ], "Course summary"),
        resource("UNESCO: AI competency framework for teachers", "https://www.unesco.org/en/articles/ai-competency-framework-teachers", "Global reference for teacher AI competencies"),
        reflect("Draft the AI-use statement you will share with your students and their parents this term."),
      ]),
    ]),
  ],
};
