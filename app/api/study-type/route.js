import { Chapter_Notes_Table , Study_Type_Content_Table } from "@/configs/schema";
import { NextResponse } from "next/server";
import  db  from "@/configs/db";
import { eq } from "drizzle-orm";



export async function POST(req) {
  const { courseId, studyType } = await req.json();

  if (studyType === "ALL") {
    const notes = await db
      .select()
      .from(Chapter_Notes_Table)
      .where(eq(Chapter_Notes_Table.courseId, courseId));


    const quiz = await db
    .select()
    .from(Study_Type_Content_Table)
    .where(eq(Study_Type_Content_Table.type , studyType))
    .where(eq(Study_Type_Content_Table.courseId , courseId))

    return NextResponse.json({
      notes,
      flashCard: null,
      quiz: quiz,
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
