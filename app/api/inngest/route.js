import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { CreateNewUser, helloWorld ,createNotes , createFlashcards, GenerateStudyTypeContent} from "../../../inngest/function";

export const { GET, POST, PUT } = serve({
  client: inngest,
  servePath: "/api/inngest",
  functions: [
    helloWorld,
    CreateNewUser, // <-- This is where you'll always add all your functions
    createNotes,
    createFlashcards,
    GenerateStudyTypeContent
  ],
});