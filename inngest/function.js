import { inngest } from "./client";
import db from '@/configs/db'
import { eq, sql } from 'drizzle-orm';
import {USER_TABLE , Chapter_Notes_Table , Study_Material_Table , Study_Type_Content_Table, Learning_Spark_Table} from '@/configs/schema'
import { generateFlashcards, generateNotes, generateQuiz, generateLearningSparks } from "../configs/AiModel";
import { Resend } from 'resend';

// Add your Resend API Key here or in your .env.local file as RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_to_prevent_crash'); 

function stripHtml(input = "") {
  return input
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: { event: "test/hello.world" } },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// Runs on 1st of every month at midnight UTC — resets all user credits to 0
export const resetMonthlyCredits = inngest.createFunction(
  { id: "reset-monthly-credits", triggers: { cron: "0 0 1 * *" } },
  async ({ step }) => {
    await step.run("reset-all-user-credits", async () => {
      await db
        .update(USER_TABLE)
        .set({
          creditsUsed: 0,
          creditsResetAt: sql`now()`,
        });
    });
    return { success: true, message: "Monthly credits reset for all users" };
  }
);


export const CreateNewUser = inngest.createFunction(
  { id: "New-User", triggers: { event: "user.create" } },
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
        userName: user?.fullName || user?.primaryEmailAddress?.emailAddress || "New User",
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


// Used to generate notes
export const createNotes = inngest.createFunction(
  { id: "generate-course", triggers: { event: "notes.generate" } },
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
          courseId: course.id,
          notes: aiResp,
        });
      }
    });

    // ✅ Status update
    await step.run("Update course status", async () => {
      await db
        .update(Study_Material_Table)
        .set({ status: "Ready" })
        .where(eq(Study_Material_Table.id, course.id));
    });

    await inngest.send({
      name: "learning-spark.generate",
      data: {
        courseId: course.id,
      },
    });

    return { status: "completed" };
  }
);

export const generateLearningSparksForCourse = inngest.createFunction(
  { id: "generate-learning-sparks", triggers: { event: "learning-spark.generate" } },
  async ({ event, step }) => {
    const { courseId } = event.data;

    const [course] = await step.run("Load course data", async () => {
      return await db
        .select()
        .from(Study_Material_Table)
        .where(eq(Study_Material_Table.id, courseId));
    });

    if (!course?.courseLayout?.chapters?.length) {
      throw new Error("No course chapters found for learning sparks");
    }

    const chapterNotes = await step.run("Load chapter notes", async () => {
      return await db
        .select()
        .from(Chapter_Notes_Table)
        .where(eq(Chapter_Notes_Table.courseId, courseId));
    });

    const notesByChapter = new Map(
      chapterNotes.map((note) => [note.chapterId, stripHtml(note.notes || "")])
    );

    const chapterContext = course.courseLayout.chapters.map((chapter, index) => {
      const chapterNumber = chapter.chapter_number ?? index + 1;
      return {
        chapter_number: chapterNumber,
        chapter_title: chapter.chapter_title,
        chapter_summary: chapter.chapter_summary,
        notes: notesByChapter.get(index) || "",
      };
    });

    const prompt = `
You are generating short dashboard learning cards for an AI LMS.

TASK:
Read the chapter material carefully and extract the most valuable facts a student should remember after studying it.

OUTPUT RULES:
- Return EXACTLY 10 cards.
- Return ONLY valid JSON.
- Do not include markdown, code fences, commentary, or extra keys.
- Every card must be between 25 and 45 words.
- One concept per card.
- Do not duplicate ideas.
- Do not invent facts that are not supported by the chapter material.

CARD CATEGORIES:
- Important Point
- Interview Tip
- Exam Favorite
- Common Mistake
- Quick Recall
- Best Practice
- Definition
- Performance Insight
- Real World Example
- Memory Trick

CONTENT RULES:
- Prefer concepts students often forget.
- Highlight interview traps when relevant.
- Include practical insights instead of textbook definitions alone.
- Use a category only if it fits; otherwise choose the closest one.

OUTPUT FORMAT:
{
  "knowledge_cards": [
    {
      "chapter_number": 1,
      "type": "Important Point",
      "title": "Short dashboard title",
      "content": "25 to 45 word insight"
    }
  ]
}

COURSE TITLE:
${course.courseLayout?.course_title || course.topic}

CHAPTER MATERIAL:
${JSON.stringify(chapterContext, null, 2)}
`;

    const aiText = await step.run("Generate learning sparks", async () => {
      return await generateLearningSparks(prompt);
    });

    let aiResult;
    try {
      const cleaned = aiText.replace(/```json/gi, "").replace(/```/g, "").trim();
      aiResult = JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Invalid learning spark JSON: ${aiText}`);
    }

    const cards = Array.isArray(aiResult?.knowledge_cards) ? aiResult.knowledge_cards : [];
    if (cards.length !== 10) {
      throw new Error(`Expected 10 learning sparks, received ${cards.length}`);
    }

    await step.run("Save learning sparks", async () => {
      await db.insert(Learning_Spark_Table).values(
        cards.map((card, index) => ({
          courseId,
          chapterNumber: card.chapter_number || index + 1,
          type: card.type,
          title: card.title,
          content: card.content,
        }))
      );
    });

    return { status: "completed", count: cards.length };
  }
);

// Used to generate flashcards
export const createFlashcards = inngest.createFunction(
   { id: 'Generate Flashcards', triggers: { event: 'flashcard.generate' } },
   async({event , step}) => {
    const {prompt , courseId , recordId}  = event.data;

    const flashcardResult = await step.run('Generate Flashcards Using AI',async() => {
         return await generateFlashcards(prompt);
    });

    await step.run('Save Flashcards to DB' , async () => {
        await db.update(Study_Type_Content_Table).set({
          content:flashcardResult?.flashcards ?? flashcardResult,
          status:'Ready'
        }).where(eq(Study_Type_Content_Table.id , recordId));

        return 'data inserted';
    });

    return { success: true };
   }
);

export const handleFunctionFailure = inngest.createFunction(
  { id: "handle-function-failure", triggers: { event: "inngest/function.failed" } },
  async ({ event, step }) => {
    const error = event.data.error;
    const failedFunctionId = event.data.function_id;
    const originalEvent = event.data.event; // The event that triggered the failed run

    await step.run('send-failure-email', async () => {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: process.env.RESEND_ALERT_EMAIL || 'thorp452@gmail.com',
        subject: `[Alert] Inngest Function Failed: ${failedFunctionId}`,
        html: `
          <h2>Inngest Function Failed</h2>
          <p><strong>Function ID:</strong> ${failedFunctionId}</p>
          <p><strong>Error Message:</strong> ${error?.message || 'Unknown error'}</p>
          <p><strong>Original Event:</strong> ${originalEvent?.name}</p>
          <pre>${JSON.stringify(originalEvent?.data, null, 2)}</pre>
        `
      });
    });

    return { success: true };
  }
);

// Used to generate quiz content
export const GenerateStudyTypeContent = inngest.createFunction(
   { id: 'Generate Study Content', triggers: { event: 'studyType.content' } },
   async({event , step}) => {
    const {studyType , prompt , courseId , recordId}  = event.data;
    
    const Flashcardairesult = await step.run('Generate Content Using AI',async() => {
         const aiResult = await generateQuiz(prompt);
         return aiResult; 
    })

    // Sve to Db

    const DBResult = await step.run('Save to DB' , async () => {
        const result = await db.update(Study_Type_Content_Table).set({
          content:Flashcardairesult,
          status:'Ready'
        }).where(eq(Study_Type_Content_Table.id , recordId))

        return 'data inserted'
    })
    return { success: true };
   }
);