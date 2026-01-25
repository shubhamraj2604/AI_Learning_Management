import { NextResponse } from "next/server";
import { generateCourseOutline } from "@/configs/AiModel";
import db from "@/configs/db";
import { Study_Material_Table } from "@/configs/schema";
import { inngest } from "../../../inngest/client";
import {aj} from "@/lib/arcjet";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {


 let clerkUserId;

// Get userId WITHOUT mutating request
try {
  clerkUserId = auth().userId ?? undefined;
} catch {
  clerkUserId = undefined;
}

if (process.env.ARCJET_KEY) {
  const decision = await aj.protect(req, {
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



    const body = await req.json();
    const {
      courseId,
      topic,
      studyType,
      difficulty,
      createdBy,
    } = body;

    if (!courseId || !topic || !studyType || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }


    const prompt = `
You are a JSON generator.

TASK:
Generate structured study material for the given topic.

STUDY TYPE BEHAVIOR:
- Exam: theory, definitions, explanations
- Coding: practical concepts, implementation focus
- Job Interview: concepts, FAQs, real-world usage
- Practice: tasks, exercises, applied learning

STRICT RULES:
- Maintain logical progression (basic → advanced)
- Match the difficulty level
- Do NOT ask questions
- Do NOT explain limitations
- Do NOT include markdown or extra text

CRITICAL FAILURE RULE:
If content cannot be generated for ANY reason,
return EXACTLY this JSON and nothing else:
{
  "course_title": "",
  "course_summary": "",
  "chapters": []
}

OUTPUT FORMAT (JSON ONLY):
{
  "course_title": "string",
  "course_summary": "string",
  "chapters": [
    {
      "chapter_number": number,
      "chapter_title": "string",
      "chapter_summary": "string",
      "topics": ["string"]
    }
  ]
}

INPUT:
Topic: "${topic}"
Study Type: "${studyType}"
Difficulty Level: "${difficulty}"

Generate the full response in ONE output and stop.
`;

    // 3️⃣ Call AI
    const aiText = await generateCourseOutline(prompt);

    // 4️⃣ Extract JSON safely
    let aiResult;
    try {
      const match = aiText.match(/\{[\s\S]*\}$/);
      if (!match) throw new Error("No JSON found");
      aiResult = JSON.parse(match[0]);
    } catch (err) {
      console.error("❌ Invalid AI JSON:", aiText);
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    // 5️⃣ Validate AI output
    if (
      !aiResult.course_title ||
      !Array.isArray(aiResult.chapters) ||
      aiResult.chapters.length === 0
    ) {
      return NextResponse.json(
        { error: "AI could not generate course outline" },
        { status: 422 }
      );
    }

    // 6️⃣ Save to DB
    const [dbResult] = await db
      .insert(Study_Material_Table)
      .values({
        courseId,
        courseType: studyType,
        topic,
        difficultyLevel: difficulty,
        courseLayout: aiResult,
        createdBy,
        status: "Completed",
      })
      .returning();

    // 7️⃣ Trigger Inngest for chapter notes
    await inngest.send({
      name: "notes.generate",
      data: {
        course: dbResult,
      },
    });

    // 8️⃣ Success response
    return NextResponse.json({
      success: true,
      data: dbResult,
    });
  } catch (error) {
    console.error("🔥 Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
