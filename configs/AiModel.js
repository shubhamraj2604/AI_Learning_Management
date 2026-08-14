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

// import Perplexity from "@perplexity-ai/perplexity_ai";


// const apiKey = process.env.PERPLEXITY_API_KEY;

// const client = new Perplexity({ apiKey });


// export const generateCourseOutline = async (prompt) => {
//   try {
//     const response = await client.chat.completions.create({
//       model: "sonar-pro",       
//       messages: [
//         { role: "user", content: prompt }
//       ],
//       // optional Perplexity parameters:
//       // temperature: 0.7,
//       // max_tokens: 1000,
//     });

//     return response.choices[0].message.content;
//   } catch (err) {
//     console.error("Perplexity API Error:", err);
//     throw err;
//   }
// };

// export const generateNotes = async (prompt) => {
//   try {
//     const response = await client.chat.completions.create({
//       model: "sonar-pro",
//       messages: [
//         { role: "user", content: prompt }
//       ],
//     });

//     if (!response?.choices?.[0]?.message?.content) {
//       throw new Error("Perplexity returned empty response");
//     }

//     return response.choices[0].message.content;
//   } catch (error) {
//     console.error("Perplexity API Error:", error);
//     throw error;
//   }
// };


// export const generateFlashcards = async (prompt) => {
//   try {
//     const flashcardPrompt = `
// You are an AI that generates study flashcards.
// RULES:
// - Generate MAXIMUM 15 flashcards
// - Each flashcard must contain:
//   - "front": short question or term
//   - "back": concise explanation (1–2 lines)
// - Beginner-friendly
// - No markdown
// - No extra text
// - Output ONLY valid JSON

// FORMAT:
// {
//   "flashcards": [
//     { "front": "", "back": "" }
//   ]
// }

// CONTENT:
// ${prompt}
// `;

//     const response = await client.chat.completions.create({
//       model: "sonar-pro",
//       messages: [
//         { role: "system", content: "You generate clean JSON study flashcards." },
//         { role: "user", content: flashcardPrompt }
//       ],
//       temperature: 0.3,
//     });

//     const aiText = response?.choices?.[0]?.message?.content;

//     if (!aiText) {
//       throw new Error("Perplexity returned empty flashcard response");
//     }

//     return JSON.parse(aiText);
//   } catch (error) {
//     console.error("Perplexity Flashcard Error:", error);
//     throw error;
//   }
// };


// function extractJSON(text) {
//   return text
//     .replace(/```json/gi, "")
//     .replace(/```/g, "")
//     .trim();
// }

// export const generateQuiz = async (prompt) => {
//   try {
//     const quizPrompt = `${prompt}`;

//     const response = await client.chat.completions.create({
//       model: "sonar-pro",
//       messages: [
//         {
//           role: "system",
//           content:
//             "Return ONLY valid raw JSON. No markdown. No explanations."
//         },
//         { role: "user", content: quizPrompt }
//       ],
//       temperature: 0.3,
//     });

//     const aiText = response?.choices?.[0]?.message?.content;

//     if (!aiText) {
//       throw new Error("Perplexity returned empty quiz response");
//     }

//     const cleanJSON = extractJSON(aiText);
//     const parsed = JSON.parse(cleanJSON);

//     // Optional safety check
//     if (!Array.isArray(parsed)) {
//       throw new Error("AI did not return a JSON array");
//     }

//     return parsed;
//   } catch (error) {
//     console.error("Perplexity Quiz Error:", error);
//     throw error;
//   }
// };


// export const generateFeedback = async (prompt) => {
//   try {
//     const response = await client.chat.completions.create({
//       model: "sonar-pro",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const content = response?.choices?.[0]?.message?.content;
//     if (!content) {
//       throw new Error("Perplexity returned empty feedback response");
//     }

//     // ✅ REMOVE markdown code fences if present
//     const cleaned = content
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     return JSON.parse(cleaned);
//   } catch (error) {
//     console.error("Perplexity Feedback API Error:", error);
//     throw error;
//   }
// };


import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLangfuse } from "@/lib/langfuse";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-3-flash-preview";

const model = genAI.getGenerativeModel({
  model: MODEL_NAME,
});

// Helper — wraps a Gemini call in a Langfuse generation span so you can
// see exactly what prompt went in, what came out, how long it took, and
// whether it errored — all visible in the Langfuse dashboard.
async function tracedGenerate({ name, input, generate }) {
  const langfuse = getLangfuse();

  const trace = langfuse.trace({ name });

  const generation = trace.generation({
    name,
    model: MODEL_NAME,
    input,
    startTime: new Date(),
  });

  try {
    const output = await generate();

    generation.end({
      output,
      endTime: new Date(),
    });

    await langfuse.flushAsync();
    return output;
  } catch (err) {
    generation.end({
      endTime: new Date(),
      level: "ERROR",
      statusMessage: err?.message ?? String(err),
    });

    await langfuse.flushAsync();
    throw err;
  }
}

/* -------------------------------------------------- */
/* COURSE OUTLINE */
/* -------------------------------------------------- */
export const generateCourseOutline = async (prompt) => {
  return tracedGenerate({
    name: "generate-course-outline",
    input: prompt,
    generate: async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error("Gemini returned empty response");
      return text;
    },
  });
};

/* -------------------------------------------------- */
/* NOTES */
/* -------------------------------------------------- */
export const generateNotes = async (prompt) => {
  return tracedGenerate({
    name: "generate-notes",
    input: prompt,
    generate: async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error("Gemini returned empty response");
      return text;
    },
  });
};

/* -------------------------------------------------- */
/* FLASHCARDS */
/* -------------------------------------------------- */
export const generateFlashcards = async (prompt) => {
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

  return tracedGenerate({
    name: "generate-flashcards",
    input: flashcardPrompt,
    generate: async () => {
      const result = await model.generateContent(flashcardPrompt);
      const text = result.response.text();
      if (!text) throw new Error("Gemini returned empty flashcard response");

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    },
  });
};

/* -------------------------------------------------- */
/* QUIZ */
/* -------------------------------------------------- */
export const generateQuiz = async (prompt) => {
  const quizPrompt = `
Return ONLY valid raw JSON array.
No markdown.
No explanations.

${prompt}
`;

  return tracedGenerate({
    name: "generate-quiz",
    input: quizPrompt,
    generate: async () => {
      const result = await model.generateContent(quizPrompt);
      const text = result.response.text();
      if (!text) throw new Error("Gemini returned empty quiz response");

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (!Array.isArray(parsed)) {
        throw new Error("AI did not return JSON array");
      }

      return parsed;
    },
  });
};

/* -------------------------------------------------- */
/* FEEDBACK */
/* -------------------------------------------------- */
export const generateFeedback = async (prompt) => {
  return tracedGenerate({
    name: "generate-feedback",
    input: prompt,
    generate: async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error("Gemini returned empty feedback");

      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleaned);
    },
  });
};

/* -------------------------------------------------- */
/* LEARNING SPARKS */
/* -------------------------------------------------- */
export const generateLearningSparks = async (prompt) => {
  return tracedGenerate({
    name: "generate-learning-sparks",
    input: prompt,
    generate: async () => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text) throw new Error("Gemini returned empty learning spark response");
      return text;
    },
  });
};