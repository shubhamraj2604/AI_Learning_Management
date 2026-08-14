import { NextResponse } from "next/server";
import db from "@/configs/db";
import { Study_Material_Table, USER_TABLE } from "@/configs/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const [{ count }] = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(Study_Material_Table)
    .where(eq(Study_Material_Table.createdBy, email));

  const userRecord = await db
    .select()
    .from(USER_TABLE)
    .where(eq(USER_TABLE.email, email))
    .limit(1);

  const plan = userRecord[0]?.plan || "Basic";
  const isMember = userRecord[0]?.isMember || false;
  const creditsUsed = userRecord[0]?.creditsUsed ?? 0;
  const creditsResetAt = userRecord[0]?.creditsResetAt ?? null;

  return NextResponse.json({ count, plan, isMember, creditsUsed, creditsResetAt });
}
