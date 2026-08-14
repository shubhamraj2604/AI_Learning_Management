import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/configs/db";
import { Learning_Spark_Table, Study_Material_Table, User_Learning_Spark_Table } from "@/configs/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

function hashString(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDateKey() {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const user = await currentUser();

  if (!user?.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.primaryEmailAddress.emailAddress;
  const userId = user.id;

  const courses = await db
    .select({
      id: Study_Material_Table.id,
      title: Study_Material_Table.topic,
      courseLayout: Study_Material_Table.courseLayout,
    })
    .from(Study_Material_Table)
    .where(eq(Study_Material_Table.createdBy, email))
    .orderBy(desc(Study_Material_Table.id));

  if (!courses.length) {
    return NextResponse.json({ nuggets: [], selected: null });
  }

  const nuggets = await db
    .select()
    .from(Learning_Spark_Table)
    .where(inArray(Learning_Spark_Table.courseId, courses.map((course) => course.id)))
    .orderBy(desc(Learning_Spark_Table.id));

  const interactions = await db
    .select()
    .from(User_Learning_Spark_Table)
    .where(eq(User_Learning_Spark_Table.userId, userId));

  const favoriteMap = new Map(
    interactions.filter((row) => row.isFavorite).map((row) => [row.nuggetId, true])
  );

  const courseMap = new Map(
    courses.map((course) => [course.id, course.courseLayout?.course_title || course.title || "Untitled course"])
  );

  const enriched = nuggets.map((nugget) => ({
    ...nugget,
    isFavorite: favoriteMap.has(nugget.id),
    courseTitle: courseMap.get(nugget.courseId) || "Untitled course",
  }));

  if (!enriched.length) {
    return NextResponse.json({
      nuggets: [],
      selected: null,
      dateKey: getDateKey(),
    });
  }

  const dateKey = getDateKey();
  const selectionIndex = hashString(`${userId}:${dateKey}`) % enriched.length;
  const selected = enriched[selectionIndex] || null;

  return NextResponse.json({
    nuggets: enriched,
    selected,
    dateKey,
  });
}

export async function POST(req) {
  const user = await currentUser();

  if (!user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { nuggetId, isFavorite } = await req.json();

  if (!nuggetId || typeof isFavorite !== "boolean") {
    return NextResponse.json({ error: "Missing nuggetId or isFavorite" }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(User_Learning_Spark_Table)
    .where(
      and(
        eq(User_Learning_Spark_Table.userId, user.id),
        eq(User_Learning_Spark_Table.nuggetId, nuggetId)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(User_Learning_Spark_Table)
      .set({ isFavorite, updatedAt: new Date() })
      .where(eq(User_Learning_Spark_Table.id, existing.id));
  } else {
    await db.insert(User_Learning_Spark_Table).values({
      userId: user.id,
      nuggetId,
      isFavorite,
      seenAt: new Date(),
      updatedAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}