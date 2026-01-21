import { NextResponse } from "next/server";
import { generateCourseOutline } from "@/configs/AiModel";
import db from "@/configs/db";
import { Study_Material_Table } from "@/configs/schema";
import { inngest } from "../../../inngest/client";

export async function POST(req) {
    // console.log()
    const body = await req.json()
    const {
      courseId,
      topic,
      studyType,
      difficulty,
      createdBy,
    } =  body;

    // console.log(courseId , topic , studyType , difficulty , createdBy)

    if (!courseId || !topic || !studyType || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

   const prompt = `
You are an expert curriculum designer and educator.

TASK:
Generate structured study material for the given topic.
The content MUST adapt based on the study type:
- Exam: theory-focused, definitions, explanations
- Coding: practical concepts, implementation-oriented topics
- Job Interview: conceptual clarity, commonly asked questions, real-world usage
- Practice: hands-on tasks, applied concepts, problem-solving focus

GENERAL RULES:
- Adjust chapter titles, summaries, and topics according to the study type
- Maintain logical learning progression (basic → advanced)
- Keep content appropriate to the given difficulty level
- Do NOT include unnecessary information for the study type
- Do NOT ask questions or request clarification

OUTPUT FORMAT (STRICT):
Return ONLY valid JSON.
Do NOT include markdown, comments, or extra text.
The JSON MUST follow this exact structure:

{
  "course_title": "...",
  "course_summary": "...",
  "chapters": [
    {
      "chapter_number": 1,
      "chapter_title": "...",
      "chapter_summary": "...",
      "topics": ["topic 1", "topic 2"]
    }
  ]
}

INPUT PARAMETERS:
Topic: "${topic}"
Study Type: "${studyType}"
Difficulty Level: "${difficulty}"

Generate the complete response in one output and stop.
`;


    const aiText = await generateCourseOutline(prompt);

    let aiResult;
    try {
      aiResult = JSON.parse(aiText);
    } catch (err) {
      console.error("Invalid AI JSON:", aiText);
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw: aiText },
        { status: 500 }
      );
    }
    
    console.log(aiResult)
    const dbResult = await db
      .insert(Study_Material_Table)
      .values({
        courseId,
        courseType : studyType,
        topic,
        difficultyLevel:difficulty,
        courseLayout: aiResult,
        createdBy,
        status: "Completed",
      })
      .returning();
      // console.log(dbResult)
      // To generate Chapter Notes

      const result = await inngest.send({
        name:"notes.generate",
        data:{
          course:dbResult[0]
        }
      })

      console.log(result)

    return NextResponse.json({sucess:true , data : dbResult[0]});
  }



