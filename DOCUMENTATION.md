# EasyLearn – Project Documentation

**Version:** 0.1.0  
**Description:** AI-powered learning management system that generates courses, notes, flashcards, quizzes, and feedback using Google Gemini.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Database Schema](#database-schema)
7. [API Reference](#api-reference)
8. [Inngest Functions](#inngest-functions)
9. [Frontend Pages & Components](#frontend-pages--components)
10. [Data Flows](#data-flows)
11. [AI Model Configuration](#ai-model-configuration)

---

## Overview

EasyLearn is a full-stack LMS where users:

- **Create courses** by entering topic, study type, and difficulty
- **Get AI-generated outlines** via Gemini, stored in the database
- **Receive chapter notes** (HTML) via background Inngest jobs
- **Generate flashcards and quizzes** on demand from course content
- **Take quizzes** with immediate feedback on wrong answers

Key architectural choices:

- **Next.js 16** App Router with React 19
- **Clerk** for authentication
- **Neon (PostgreSQL)** via Drizzle ORM
- **Inngest** for background processing (notes, flashcards, quiz generation)
- **Google Gemini** for all AI generation
- **Arcjet** for rate limiting and bot protection

---

## Tech Stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Framework   | Next.js 16.0.7                       |
| UI          | React 19.2, Tailwind CSS 4, Radix UI |
| Auth        | Clerk                                |
| Database    | Neon (PostgreSQL)                    |
| ORM         | Drizzle ORM                          |
| AI          | Google Gemini (`@google/generative-ai`) |
| Background  | Inngest                              |
| Rate limit  | Arcjet                               |
| HTTP client | Axios                                |

---

## Project Structure

```
ai_lms/
├── app/
│   ├── api/                      # API routes
│   │   ├── generate-course-outline/
│   │   ├── generate-study-type-content/
│   │   ├── study-type/
│   │   ├── show-courses/
│   │   ├── get-feedback/
│   │   ├── Create-User/
│   │   └── inngest/
│   ├── course/[courseId]/        # Course detail & study materials
│   │   ├── notes/
│   │   ├── flashcard/
│   │   ├── quiz/
│   │   ├── qa/
│   │   └── _components/
│   ├── create/                   # Create new course
│   ├── dashboard/                # User dashboard
│   ├── layout.tsx
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/                   # Reusable UI
├── configs/
│   ├── AiModel.js               # Gemini wrappers
│   ├── db.js                     # Drizzle connection
│   └── schema.js                 # DB tables
├── inngest/
│   ├── client.js
│   └── function.js               # Background jobs
├── lib/
│   └── arcjet.ts                 # Rate limiting
├── drizzle.config.js
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Neon database
- Google Gemini API key
- Clerk account (for auth)
- Inngest account (optional, for dev)
- Arcjet account (optional, for rate limiting)

### Install & Run

```bash
# Install dependencies
npm install

# Set environment variables (see Environment Variables)
cp .env.example .env.local

# Run Next.js dev server
npm run dev

# In a separate terminal: run Inngest dev (for background jobs)
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

### Build & Start (production)

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable                          | Required | Description                                   |
|----------------------------------|----------|-----------------------------------------------|
| `NEXT_PUBLIC_DATABASE_CONNECTION_STRING` | Yes      | Neon PostgreSQL connection string             |
| `GEMINI_API_KEY`                 | Yes      | Google Gemini API key                         |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Clerk public key                              |
| `CLERK_SECRET_KEY`               | Yes      | Clerk secret key                              |
| `ARCJET_KEY`                     | No       | Arcjet key for rate limiting (skipped if unset) |
| `INNGEST_SIGNING_KEY`            | No       | Inngest signing key (production)              |

---

## Database Schema

### Tables

**users**

| Column    | Type    | Notes                      |
|-----------|---------|----------------------------|
| id        | serial  | Primary key                |
| userName  | varchar | NOT NULL                   |
| email     | varchar | NOT NULL                   |
| isMember  | boolean | Default false              |
| plan      | varchar | Default "Basic"            |

**studyMaterial**

| Column         | Type    | Notes                     |
|----------------|---------|---------------------------|
| id             | serial  | Primary key               |
| courseId       | varchar | NOT NULL                  |
| courseType     | varchar | (Exam, Coding, etc.)      |
| topic          | varchar | NOT NULL                  |
| difficultyLevel| varchar | Default "Easy"            |
| courseLayout   | json    | AI outline + chapters     |
| createdBy      | varchar | NOT NULL                  |
| status         | varchar | Default "Generating"      |

**chapterNotes**

| Column   | Type    | Notes     |
|----------|---------|-----------|
| id       | serial  | Primary key |
| courseId | varchar | NOT NULL |
| chapterId| integer | NOT NULL |
| notes    | text    | HTML content |

**studyTypeContent**

| Column   | Type    | Notes                              |
|----------|---------|------------------------------------|
| id       | serial  | Primary key                        |
| courseId | varchar | NOT NULL                           |
| content  | json    | Flashcards array or Quiz questions |
| type     | varchar | "flashcard" | "quiz" | "qa"     |
| status   | varchar | Default "Genearting" (typo in schema) |

---

## API Reference

### `POST /api/generate-course-outline`

Creates a new course with an AI-generated outline.

**Auth:** Clerk (optional)  
**Rate limit:** Arcjet (`aj`)  
**Body:**

```json
{
  "courseId": "uuid",
  "topic": "string",
  "studyType": "string",
  "difficulty": "string",
  "createdBy": "string"
}
```

**Flow:**  
1. Validates input → 2. Calls Gemini → 3. Parses JSON → 4. Saves to `studyMaterial` → 5. Triggers Inngest event `notes.generate`

---

### `POST /api/generate-study-type-content`

Starts generation of flashcards or quiz.

**Auth:** Clerk (optional)  
**Rate limit:** Arcjet (`ajStudyType`)  
**Body:**

```json
{
  "courseId": "string",
  "type": "flashcard" | "quiz",
  "chapter": "string (chapter summaries concatenated)"
}
```

**Returns:** `{ id: number }` (record ID)  
**Flow:** Inserts a row in `studyTypeContent`, triggers Inngest `studyType.content`.  
**Note:** `type === "quiz"` only is supported; flashcards use same flow but different prompt. `qa` is not yet implemented.

---

### `GET /api/generate-study-type-content`

Polls status of flashcards/quiz generation.

**Query:** `courseId`, `studyType`  
**Returns:** `{ status: "Generating" | "Ready" }`

---

### `POST /api/study-type`

Fetches study content (notes, quiz, or ALL).

**Body:**

```json
{
  "courseId": "string",
  "studyType": "notes" | "quiz" | "ALL"
}
```

**Returns:**
- `notes` → array of chapter notes
- `quiz` → array of quiz records
- `ALL` → `{ notes, flashCard, quiz, qa }`

---

### `GET /api/show-courses`

Lists courses for the current user or fetches one course.

**Auth:** Clerk required  
**Query:** `courseId` (optional – if present returns single course)  
**Returns:** Array of courses or `{ result: course }`

---

### `POST /api/get-feedback`

Generates AI feedback for wrong quiz answers.

**Body:**

```json
{
  "wrongAnswer": [
    { "question": "", "userAnswer": "", "correctAnswer": "" }
  ]
}
```

**Returns:** Array of `{ question, userAnswer, correctAnswer, explanation }`

---

### `POST /api/Create-User`

Sends Inngest event to sync Clerk user into `users` table.

**Body:** `{ user: ClerkUser }`

---

### `GET|POST|PUT /api/inngest`

Inngest webhook for background jobs.

---

## Inngest Functions

| Function                | Event             | Purpose                                |
|-------------------------|-------------------|----------------------------------------|
| `helloWorld`            | `test/hello.world`| Example function                       |
| `CreateNewUser`         | `user.create`     | Insert/update user in `users`          |
| `createNotes`           | `notes.generate`  | Generate HTML notes per chapter        |
| `GenerateStudyTypeContent` | `studyType.content` | Generate flashcards/quiz via Gemini |

### createNotes

1. Reads `course.courseLayout.chapters` from event
2. Calls `generateNotes()` (Gemini) per chapter
3. Inserts rows into `chapterNotes`
4. Updates `studyMaterial.status` to `"Ready"`

### GenerateStudyTypeContent

1. Reads `studyType`, `prompt`, `courseId`, `recordId` from event
2. Calls `generateQuiz()` (Gemini) with `prompt`
3. Updates `studyTypeContent` with `content` and `status: "Ready"`

**Note:** Both flashcards and quiz use `generateQuiz()` in the current implementation; prompts differ per `studyType`.

---

## Frontend Pages & Components

| Route                     | Component           | Description                                      |
|---------------------------|---------------------|--------------------------------------------------|
| `/`                       | `page.tsx`          | Landing page with hero and feature cards         |
| `/dashboard`              | `Main`, `WelcomeBanner` | Course list and create course CTA             |
| `/create`                 | `Selectoptions`, `Topicinput` | Multi-step course creation form          |
| `/course/[courseId]`      | `Course`, `CourseIntroCard`, `StudyMaterial`, `ChapterList` | Course detail and materials |
| `/course/[courseId]/notes`| `ViewNotes`         | Chapter notes viewer (prev/next)                  |
| `/course/[courseId]/quiz` | `QuizSection`       | Quiz with scoring and feedback                   |
| `/course/[courseId]/flashcard` | (if exists)    | Flashcard viewer                                 |
| `/course/[courseId]/qa`   | (if exists)         | Q&A interface                                    |

### StudyMaterial

- Fetches `studyType: "ALL"` to detect existing notes/quiz
- Shows **Generate** or **View** per type
- On **Generate**: POSTs to `/api/generate-study-type-content` and polls GET until `status === "Ready"`

### QuizSection

- Loads quiz via `POST /api/study-type` with `studyType: "quiz"`
- Uses `result.data[0]?.content` as questions array
- On submit, sends wrong answers to `/api/get-feedback` and shows `Feedback` component

---

## Data Flows

### Course Creation

```
User (Create page) → POST /api/generate-course-outline
  → Gemini (course outline)
  → Insert studyMaterial
  → Inngest notes.generate
  → createNotes: per chapter → Gemini → chapterNotes
  → Update studyMaterial.status
```

### Quiz / Flashcard Generation

```
User (StudyMaterial) → POST /api/generate-study-type-content
  → Insert studyTypeContent (status: Generating)
  → Inngest studyType.content
  → GenerateStudyTypeContent: Gemini generateQuiz(prompt)
  → Update studyTypeContent (content, status: Ready)

Frontend polls GET /api/generate-study-type-content
  → status === Ready → GetStudyType() → Show "View"
```

### Quiz Taking & Feedback

```
User (QuizSection) → POST /api/study-type (quiz)
  → Fetch studyTypeContent where type=quiz
  → Display questions

User submits → getWrongAnswers()
  → POST /api/get-feedback { wrongAnswer }
  → Gemini generateFeedback()
  → Display Feedback component
```

---

## AI Model Configuration

**File:** `configs/AiModel.js`

**Model:** `gemini-3-flash-preview`

**Exports:**

- `generateCourseOutline(prompt)` – JSON course outline
- `generateNotes(prompt)` – HTML notes
- `generateFlashcards(prompt)` – JSON `{ flashcards: [{ front, back }] }`
- `generateQuiz(prompt)` – JSON array of `{ question, options, correctAnswer }`
- `generateFeedback(prompt)` – JSON array of `{ question, userAnswer, correctAnswer, explanation }`

Prompts are built in each API route; AiModel focuses on calling Gemini and parsing responses.

---

## Known Limitations

- `qa` (Question/Answer) study type is listed in UI but not implemented in backend
- `generate-study-type-content` only builds prompts for `flashcard` and `quiz`; other types would need prompt logic
- Schema typo: `studyTypeContent.status` default is `"Genearting"`
- `study-type` route with `studyType: "ALL"` queries quiz with `type = "ALL"` (no quiz has that type), so `quiz` in ALL response may be empty

---

## License & Contact

Private project. For questions or contributions, contact the repository owner.
