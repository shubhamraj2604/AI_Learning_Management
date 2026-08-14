import { Langfuse } from "langfuse";

// Singleton Langfuse client — reused across all AI calls
let _langfuse = null;

export function getLangfuse() {
  if (!_langfuse) {
    _langfuse = new Langfuse({
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL, // e.g. https://cloud.langfuse.com or https://us.cloud.langfuse.com
      flushAt: 1,       // flush after every event (good for serverless / edge)
      flushInterval: 0, // don't buffer in serverless
    });
  }
  return _langfuse;
}
