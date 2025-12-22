import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/configs/db";
import { Study_Material_Table } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req) {
  const user = await currentUser();

  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  // 👉 If courseId exists → fetch single course
  if (courseId) {
    const course = await db
      .select()
      .from(Study_Material_Table)
      .where(eq(Study_Material_Table.courseId, courseId));

    return NextResponse.json({ result: course[0] });
  }
  
  const courses = await db
    .select()
    .from(Study_Material_Table)
    .where(
      eq(
        Study_Material_Table.createdBy,
        user.primaryEmailAddress.emailAddress
      )
    )
    .orderBy(desc(Study_Material_Table.id));

  return NextResponse.json(courses);
}
