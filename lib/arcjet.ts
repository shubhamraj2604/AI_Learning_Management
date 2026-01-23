import arcjet, {
  detectBot,
  shield,
  tokenBucket,
} from "@arcjet/next";

export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Protect from common attacks
    shield({ mode: "LIVE" }),

    // Block unwanted bots
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    // Token Bucket rate limiter
    tokenBucket({
      mode: "LIVE",
      capacity: 10,    // burst
      refillRate: 5,   // tokens added
      interval: 10,    // seconds
    }),
  ],
});



export const ajStudyType = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      capacity: 5,
      refillRate: 2,
      interval: 60, // 2 per minute
    }),
  ],
});

