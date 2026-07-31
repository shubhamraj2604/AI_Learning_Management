import db from "@/configs/db";
import { Study_Type_Content_Table } from "@/configs/schema";
import { inngest } from "../../../inngest/client";
import { NextResponse } from "next/server";
import { ajStudyType } from "@/lib/arcjet";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";

export async function POST(req) {
  let clerkUserId;

  try {
    clerkUserId = auth().userId ?? undefined;
  } catch {
    clerkUserId = undefined;
  }

  if (process.env.ARCJET_KEY) {
    const decision = await ajStudyType.protect(req, {
      requested: 1,
      userId: clerkUserId ? `clerk:${clerkUserId}` : undefined,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  const { chapter, courseId, type } = await req.json();
  console.log(type);

  // Block unsupported types (e.g. Q&A) to prevent unnecessary requests
  if (type !== "flashcard" && type !== "quiz") {
    return NextResponse.json(
      { error: "Unsupported study type. Only flashcard and quiz are supported." },
      { status: 400 }
    );
  }

  const [existingRecord] = await db
    .select({
      id: Study_Type_Content_Table.id,
      status: Study_Type_Content_Table.status,
    })
    .from(Study_Type_Content_Table)
    .where(
      and(
        eq(Study_Type_Content_Table.courseId, courseId),
        eq(Study_Type_Content_Table.type, type)
      )
    )
    .orderBy(desc(Study_Type_Content_Table.id))
    .limit(1);

  if (existingRecord) {
    return NextResponse.json({
      id: existingRecord.id,
      status: existingRecord.status,
      skipped: true,
    });
  }

  let prompt;
  if (type === "flashcard") {
    prompt = `
Generate study flashcards from the chapter content below.

STRICT RULES:
- Create at most 15 flashcards
- Each card must have only front and back fields
- Keep the front short and focused
- Keep the back concise, accurate, and easy to revise
- Output ONLY valid JSON
- Do not add markdown or explanation text

OUTPUT FORMAT:
{
  "flashcards": [
    { "front": "", "back": "" }
  ]
}

CHAPTER CONTENT:
${JSON.stringify(chapter).slice(1, -1)}
`;
  } else if (type === "quiz") {
    prompt = `You are generating quiz questions for an AI learning platform.

STRICT RULES:
- Create EXACTLY 10 multiple-choice questions
- Questions must be ONLY from the given chapter content
- Each question must have EXACTLY 4 options
- Only ONE option must be correct
- Do NOT add explanations
- Do NOT add extra text

OUTPUT FORMAT (JSON ONLY):
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A" {generate jumbled options for each questions , not predictable}
  }
]

I need answers

CHAPTER CONTENT:
${JSON.stringify(chapter).slice(1, -1)}
`;
  }

  const result = await db
    .insert(Study_Type_Content_Table)
    .values({
      courseId: courseId,
      type: type,
    })
    .returning({
      id: Study_Type_Content_Table.id,
    });

  // trigger
  console.log(result[0].id);
  const eventName = type === "flashcard" ? "flashcard.generate" : "studyType.content";
  inngest.send({
    name: eventName,
    data: {
      studyType: type,
      prompt: prompt,
      courseId: courseId,
      recordId: result[0].id,
    },
  });

  return NextResponse.json({ id: result[0].id });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const courseId = searchParams.get("courseId");
  const studyType = searchParams.get("studyType");

  if (!courseId || !studyType) {
    return NextResponse.json(
      { error: "Missing courseId or studyType" },
      { status: 400 }
    );
  }

  const [row] = await db
    .select({ status: Study_Type_Content_Table.status })
    .from(Study_Type_Content_Table)
    .where(
      and(
        eq(Study_Type_Content_Table.courseId, courseId),
        eq(Study_Type_Content_Table.type, studyType)
      )
    )
    .orderBy(desc(Study_Type_Content_Table.id))
    .limit(1);

  return NextResponse.json(row ?? { status: "Generating" });
}