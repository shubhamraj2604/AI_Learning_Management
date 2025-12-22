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

    console.log(courseId , topic , studyType , difficulty , createdBy)

    if (!courseId || !topic || !studyType || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

     const prompt = `Generate a study material for "${topic}" for "${studyType}" and level of difficulty will be "${difficulty}" with the summary of course, List of Chapters along with summary for each chapter, and a Topic list in each chapter. All results must be in JSON format following this structure:
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
    }`;
   

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

      // To generate Chapter Notes

      const result = await inngest.send({
        name:"notes.generate",
        data:{
          course:dbResult[0].resp
        }
      })

      console.log(result)

    return NextResponse.json({sucess:true , data : dbResult[0]});
  }



