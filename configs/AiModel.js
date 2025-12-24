// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// export const generateCourseOutline = async (prompt) => {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash-001",
//       generationConfig: {
//         responseMimeType: "application/json",
//       },
//     });

//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     throw error;
//   }
// };

// export const generateNotes = async (prompt) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash-001",
//   });

//   const result = await model.generateContent(prompt);
//   const text = result?.response?.text();

//   if (!text) {
//     throw new Error("Gemini returned empty response");
//   }

//   return text;
// };

// backend/perplexity.js

import Perplexity from "@perplexity-ai/perplexity_ai";


const apiKey = process.env.PERPLEXITY_API_KEY;

const client = new Perplexity({ apiKey });


export const generateCourseOutline = async (prompt) => {
  try {
    const response = await client.chat.completions.create({
      model: "sonar-pro",       
      messages: [
        { role: "user", content: prompt }
      ],
      // optional Perplexity parameters:
      // temperature: 0.7,
      // max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("Perplexity API Error:", err);
    throw err;
  }
};

export const generateNotes = async (prompt) => {
  try {
    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [
        { role: "user", content: prompt }
      ],
    });

    if (!response?.choices?.[0]?.message?.content) {
      throw new Error("Perplexity returned empty response");
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Perplexity API Error:", error);
    throw error;
  }
};
