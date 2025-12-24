import { Chapter_Notes_Table } from "@/configs/schema";
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

    return NextResponse.json({
      notes,
      flashCard: null,
      quiz: null,
      qa: null,
    });
  }
  else if(studyType == 'notes')
  {
    const notes = await db
      .select()
      .from(Chapter_Notes_Table)
      .where(eq(Chapter_Notes_Table.courseId, courseId));
     return NextResponse.json(notes)
  }

  return NextResponse.json({ error: "Invalid study type" }, { status: 400 });
}
