import db from '@/configs/db'
import {Study_Type_Content_Table} from '@/configs/schema'
import { inngest } from '../../../inngest/client';
import { NextResponse } from 'next/server';
import {ajStudyType} from "@/lib/arcjet";
import {auth} from '@clerk/nextjs/server'

export async function POST(req) {

let clerkUserId;

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
    const {chapter , courseId , type} = await req.json()
    console.log(type)
    
    let prompt;
    if (type === "flashcard"){
        prompt = `Generate the flashcard on +${chapter}  in json format with front back content, maximum 15`;
    }else if(type === "quiz"){
        prompt = `You are generating quiz questions for an AI learning platform.

STRICT RULES:
- Create EXACTLY 10 multiple-choice questions
- Questions must be ONLY from the given chapter content
- Each question must have EXACTLY 4 options
- Only ONE option must be correct
- Do NOT add explanations
- Do NOT add extra text

OUTPUT FORMAT (JSON ONLY):
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A" {generate jumbled options for each questions , not predictable}
  }
]

I need answers 

CHAPTER CONTENT:
${JSON.stringify(chapter).slice(1, -1)}
`
}

    const result = await db.insert(Study_Type_Content_Table).values({
        courseId:courseId,
        type:type
    }).returning({
        id:Study_Type_Content_Table.id});
    
              
   // trigger
   console.log(result[0].id)
   inngest.send({
    name:'studyType.content',
    data : {
       studyType:type,
       prompt:prompt,
       courseId:courseId,
       recordId:result[0].id
    }
   })
 
   return NextResponse.json({id : result[0].id})
}



export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const courseId = searchParams.get("courseId");
  const studyType = searchParams.get("studyType");

  if (!courseId || !studyType) {
    return NextResponse.json(
      { error: "Missing courseId or studyType" },
      { status: 400 }
    );
  }

  const [row] = await db
    .select({ status: Study_Type_Content_Table.status })
    .from(Study_Type_Content_Table)
    .where(
      and(
        eq(Study_Type_Content_Table.courseId, courseId),
        eq(Study_Type_Content_Table.type, studyType)
      )
    );

  return NextResponse.json(row ?? { status: "Generating" });
}