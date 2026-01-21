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


export const generateFlashcards = async (prompt) => {
  try {
    const flashcardPrompt = `
You are an AI that generates study flashcards.
RULES:
- Generate MAXIMUM 15 flashcards
- Each flashcard must contain:
  - "front": short question or term
  - "back": concise explanation (1–2 lines)
- Beginner-friendly
- No markdown
- No extra text
- Output ONLY valid JSON

FORMAT:
{
  "flashcards": [
    { "front": "", "back": "" }
  ]
}

CONTENT:
${prompt}
`;

    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [
        { role: "system", content: "You generate clean JSON study flashcards." },
        { role: "user", content: flashcardPrompt }
      ],
      temperature: 0.3,
    });

    const aiText = response?.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error("Perplexity returned empty flashcard response");
    }

    return JSON.parse(aiText);
  } catch (error) {
    console.error("Perplexity Flashcard Error:", error);
    throw error;
  }
};


function extractJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

export const generateQuiz = async (prompt) => {
  try {
    const quizPrompt = `${prompt}`;

    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content:
            "Return ONLY valid raw JSON. No markdown. No explanations."
        },
        { role: "user", content: quizPrompt }
      ],
      temperature: 0.3,
    });

    const aiText = response?.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error("Perplexity returned empty quiz response");
    }

    const cleanJSON = extractJSON(aiText);
    const parsed = JSON.parse(cleanJSON);

    // Optional safety check
    if (!Array.isArray(parsed)) {
      throw new Error("AI did not return a JSON array");
    }

    return parsed;
  } catch (error) {
    console.error("Perplexity Quiz Error:", error);
    throw error;
  }
};


export const generateFeedback = async (prompt) => {
  try {
    const response = await client.chat.completions.create({
      model: "sonar-pro",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Perplexity returned empty feedback response");
    }

    // ✅ REMOVE markdown code fences if present
    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Perplexity Feedback API Error:", error);
    throw error;
  }
};
