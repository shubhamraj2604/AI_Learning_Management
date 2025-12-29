import { NextResponse } from "next/server";
import { generateFeedback } from "../../../configs/AiModel";

export async function POST(req) {

  const { wrongAnswer } = await req.json();

//   console.log(wrongAnswer);

  const prompt = `
You are an expert tutor.

INPUT:
You will receive an array of wrong answers. Each item has:
- question
- userAnswer
- correctAnswer

TASK:
For EACH wrong answer, generate a clear, beginner-friendly explanation
that helps the student understand why their answer is wrong and what the
correct concept is.

OUTPUT RULES (VERY IMPORTANT):
- Return ONLY valid JSON
- NO markdown
- NO extra text
- NO explanations outside JSON
- Output MUST be an array

OUTPUT FORMAT:
[
  {
    "question": "",
    "userAnswer": "",
    "correctAnswer": "",
    "explanation": ""
  }
]

TONE:
- Helpful
- Encouraging
- Simple language (1–3 sentences per explanation)
Input Array
${JSON.stringify(wrongAnswer, null, 2)}
`;

// console.log(prompt)

const result = await generateFeedback(prompt)
console.log(result)
//   const cleanJson = result
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   const feedback = JSON.parse(cleanJson);
//  console.log(feedback)



  return NextResponse.json(result);
}
