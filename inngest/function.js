import { inngest } from "./client";
import db from '@/configs/db'
import { eq } from 'drizzle-orm';
import {USER_TABLE , Chapter_Notes_Table , Study_Material_Table} from '@/configs/schema'
import { generateNotes } from "../configs/AiModel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);


export const CreateNewUser = inngest.createFunction(
  {id : "New-User"},
  {event: "user.create" },
  async({event , step}) => {
    const {user} = event.data
     const result = await step.run('Check User and create New User if not exist', async() => {
    const result = await db
    .select()
    .from(USER_TABLE)
    .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress));

  if (result?.length === 0) {
    const userResult = await db
      .insert(USER_TABLE)
      .values({
        userName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ id: USER_TABLE.id });
      return userResult
    }
    return result
     });
   return 'Sucess';  
  },

  // step 2 -> To send email notification 
)



export const createNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;
    const chapters = course?.courseLayout?.chapters;

    if (!chapters || chapters.length === 0) {
      throw new Error("No chapters found");
    }

    // ✅ SINGLE STEP FOR ALL CHAPTERS
    await step.run("Generate all chapter notes", async () => {
      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];
const prompt = `
You are generating high-quality exam-oriented study notes.

STRICT REQUIREMENTS:
- Cover ALL topics provided (do not skip any)
- Output ONLY valid HTML (no explanations, no markdown outside code blocks)
- Do NOT include html, head, body, or title tags
- Use ONLY these tags: div, h2, h3, h4, p, ul, li, strong, pre, code
- Wrap ALL content inside:
  <div class="exam-notes">

STYLING RULES (IMPORTANT):
- Use Tailwind CSS class attribute (NOT className)
- Headings must follow this hierarchy:
  - h2 → Chapter title (large & bold)
    class="text-3xl font-bold mt-8 mb-4 text-gray-900"
  - h3 → Major section
    class="text-2xl font-semibold mt-6 mb-3 text-gray-800"
  - h4 → Sub-section
    class="text-xl font-medium mt-4 mb-2 text-gray-700"

- Paragraphs:
  <p class="text-base leading-relaxed text-gray-700 mb-3">

- Bullet lists (use wherever points are appropriate):
  <ul class="list-disc pl-6 mb-4 space-y-2">
  <li class="text-base text-gray-700">

- Highlight key terms using:
  <strong class="font-semibold text-gray-900">

- For code or syntax (SQL, pseudocode, definitions):
  Wrap inside:
  <pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
    <code class="text-sm">

CONTENT RULES:
- Tone must be formal and exam-focused (BPSC / UPSC style)
- Explanations should be crisp and structured
- Use bullet points wherever possible
- Avoid long paragraphs
- No emojis, no casual language

Return ONLY the HTML output.

Chapters:
${JSON.stringify(chapter)}
`;



        const aiResp = await generateNotes(prompt);

        if (!aiResp || aiResp.trim().length === 0) {
          throw new Error(`Empty AI response for chapter ${index}`);
        }

        await db.insert(Chapter_Notes_Table).values({
          chapterId: index,
          courseId: course.courseId,
          notes: aiResp,
        });
      }
    });

    // ✅ Status update
    await step.run("Update course status", async () => {
      await db
        .update(Study_Material_Table)
        .set({ status: "Ready" })
        .where(eq(Study_Material_Table.courseId, course.courseId));
    });

    return { status: "completed" };
  }
);

