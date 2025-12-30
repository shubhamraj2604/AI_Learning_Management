import db from '@/configs/db'
import {Study_Type_Content_Table} from '@/configs/schema'
import { inngest } from '../../../inngest/client';
import { NextResponse } from 'next/server';

export async function POST(req) {
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