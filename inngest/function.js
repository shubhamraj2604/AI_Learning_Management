import { inngest } from "./client";
import db from '@/configs/db'
import { eq } from 'drizzle-orm';
import {USER_TABLE , Chapter_Notes_Table} from '@/configs/schema'
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

    // ✅ ONE STEP PER CHAPTER
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index];

      await step.run(`Generate notes chapter ${index}`, async () => {
        const prompt = `
Generate exam material detailed content for each chapter.
- Include all topics
- Output ONLY HTML (no html, head, body tags)

Chapter:
${JSON.stringify(chapter)}
        `;

        const aiResp = await generateNotes(prompt);

        await db.insert(Chapter_Notes_Table).values({
          chapterId: index,
          courseId: course.courseId,
          notes: aiResp,
        });
      });
    }

    // ✅ Status update AFTER all chapters
    await step.run("Update course status", async () => {
      await db
        .update(Study_Material_Table)
        .set({ status: "Ready" })
        .where(eq(Study_Material_Table.courseId, course.courseId));
    });

    return { status: "completed" };
  }
);
