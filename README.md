# AI Learning Management System (Easy Learn)

An AI-powered Learning Management System that enables **course creation, quizzes, notes, and intelligent feedback** using modern web technologies and scalable background AI workflows.

🔗 **Live Demo:** https://easy-learn-mg.vercel.app/  
📦 **Repository:** https://github.com/shubhamraj2604/AI_Learning_Management

---

## 🚀 Features

### 📚 AI Course Creation
- Create courses based on structured user inputs
- Automatically generate learning content using AI

### 🧠 Quiz Generation
- AI-generated quizzes for each course
- Supports multiple questions per topic

### 📝 Notes Generation
- Automatically generated study notes for better understanding
- Clean and readable format for learners

### 🧩 Flashcards & Q/A *(In Progress)*
- Flashcards for quick revision
- Question & Answer mode for active recall

### 📊 Intelligent Quiz Feedback
- After quiz submission, AI analyzes **wrong answers**
- Provides **personalized feedback**
- Feedback is generated only after user submission

---

## 🔐 Authentication
- Secure authentication using **Clerk**
- User-specific courses, quizzes, and progress

---

## ⚙️ Background AI Processing
- **Inngest** is used for background AI workflows
- Ensures non-blocking UI while AI tasks run asynchronously

---

## 🏗️ System Design & Performance Optimizations

### 🪣 Rate Limiting & AI Cost Control
- Implemented **token bucket rate limiting** using **Arcjet**
- Rate limiting is applied **per authenticated user**
- Different limits based on operation cost:
  - Course generation (strict limits)
  - Quiz & flashcard generation (moderate limits)
  - Read-only endpoints (light limits)
- Prevents abuse, ensures fair usage, and controls AI API costs

---

### 🔄 Asynchronous Processing & Polling
- Long-running AI tasks are handled using **Inngest background jobs**
- API responds immediately while AI generation runs asynchronously
- Frontend uses **polling** to check task status (`Generating → Ready`)
- Ensures smooth UX without blocking the UI

---

### ⏳ Debouncing & Duplicate Request Prevention
- Frontend actions (e.g. "Generate Course") are **debounced**
- Prevents accidental multiple AI requests from rapid user clicks
- Reduces redundant background jobs and unnecessary AI costs

---

### 🔐 Secure Request Handling
- All sensitive endpoints are protected via authentication
- Rate limiting and access control rely on **trusted auth context**
- Client-supplied identifiers are never trusted for security decisions

---

## 🧠 AI & Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **shadcn/ui**
- **React Hot Toast** for notifications

### Backend & Database
- **Drizzle ORM** (Type-safe database access)
- **PostgreSQL**

### AI & Automation
- **Perplexity AI** for content generation
- **Inngest** for background AI jobs
- **Arcjet** for rate limiting and security

### Authentication
- **Clerk**

---

## 🛠️ Key Highlights
- Fully **type-safe backend** using Drizzle ORM
- Token-based rate limiting for AI cost control
- Asynchronous background AI processing
- Modular and scalable architecture
- Clean and modern UI with shadcn components

---

## 🧪 Current Status
- ✅ Course Creation
- ✅ Quiz Generation
- ✅ Notes Generation
- ✅ AI Feedback for Wrong Answers
- 🚧 Flashcards & Q/A (In Progress)
- 🚧 Profile Section (In Progress)
- 🚧 User Analytics for study performance (In Progress)

---

## 📌 Future Improvements
- Course-specific **AI Chatbots** for interactive learning
- Progress tracking & analytics dashboard
- Flashcard spaced repetition system
- Course sharing & collaboration
- **Docker & AWS deployment** for scalable production

---

## 🧑‍💻 Author

**Shubham Raj**  
Computer Science & Engineering Student  
BIT Mesra  

- GitHub: https://github.com/shubhamraj2604
- Portfolio: https://shubhamraj26.netlify.app/

---

## ⭐ If you like this project
Give it a ⭐ on GitHub — it really helps!
