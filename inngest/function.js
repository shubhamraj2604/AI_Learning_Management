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
You are generating concise study notes for a learning platform.

STRICT RULES:
- Cover EVERY topic provided (do not skip anything)
- Keep notes SHORT, crisp, and exam/revision friendly
- Use bullet points only (no long paragraphs)
- Explain concepts simply (1–3 bullets per subtopic max)
- DO NOT add extra topics
- DO NOT repeat content
- DO NOT regenerate if content already exists
- Generate notes in ONE response only

FORMAT RULES:
- Output ONLY valid HTML
- Use <h3> for chapter title
- Use <h4> for main topics
- Use <ul><li> for points
- No <html>, <head>, or <body> tags
- No markdown, no explanations outside HTML

GOAL:
Notes should be:
- Easy to understand
- Fast to revise before exams/interviews
- Balanced for theory + practical understanding

INPUT CHAPTER DATA:
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

