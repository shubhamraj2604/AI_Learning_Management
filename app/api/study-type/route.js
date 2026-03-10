import { Chapter_Notes_Table , Study_Type_Content_Table } from "@/configs/schema";
import { NextResponse } from "next/server";
import  db  from "@/configs/db";
import { and, eq } from "drizzle-orm";



export async function POST(req) {
  const { courseId, studyType } = await req.json();

  if (studyType === "ALL") {
    const notes = await db
      .select()
      .from(Chapter_Notes_Table)
      .where(eq(Chapter_Notes_Table.courseId, courseId));

    const [quizResult, flashCardResult] = await Promise.all([
      db
        .select()
        .from(Study_Type_Content_Table)
        .where(
          and(
            eq(Study_Type_Content_Table.courseId, courseId),
            eq(Study_Type_Content_Table.type, "quiz")
          )
        ),
      db
        .select()
        .from(Study_Type_Content_Table)
        .where(
          and(
            eq(Study_Type_Content_Table.courseId, courseId),
            eq(Study_Type_Content_Table.type, "flashcard")
          )
        ),
    ]);

    return NextResponse.json({
      notes,
      flashCard: flashCardResult,
      quiz: quizResult,
      qa: null,
    });
  }
  else if(studyType === 'notes')
  {
    const notes = await db
      .select()
      .from(Chapter_Notes_Table)
      .where(eq(Chapter_Notes_Table.courseId, courseId));
     return NextResponse.json(notes)
  }else if(studyType === 'quiz'){
    const quiz = await db
    .select()
    .from(Study_Type_Content_Table)
    .where(eq(Study_Type_Content_Table.type , studyType))
    .where(eq(Study_Type_Content_Table.courseId , courseId))
    return NextResponse.json(quiz)
  }

  return NextResponse.json({ error: "Invalid study type" }, { status: 400 });
}
