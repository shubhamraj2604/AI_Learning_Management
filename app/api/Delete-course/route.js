import { NextResponse } from "next/server";
import db from "@/configs/db";
import { Study_Material_Table } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(req) {
  try {
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    // Get the authenticated user's email
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Security: only delete if this course belongs to the requesting user
    const deleted = await db
      .delete(Study_Material_Table)
      .where(
        and(
          eq(Study_Material_Table.id, courseId),
          eq(Study_Material_Table.createdBy, userEmail)
        )
      )
      .returning({ id: Study_Material_Table.id });

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Course not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Note: credits are NOT refunded on delete (by design)
    return NextResponse.json({ success: true, deleted: deleted[0] });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}