"use client";

import { useUser } from "@clerk/nextjs";
import { useCourseStore } from "@/store/useCourseStore";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const courses = useCourseStore((s) => s.courses);
  const plan = useCourseStore((s) => s.plan);
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-6 md:p-10 shadow-sm">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-100 blur-2xl" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-indigo-200 shadow-sm"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {user.fullName || "User"}
              </h1>
              <p className="text-muted-foreground text-sm">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <div className="mt-2 inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">
                Plan: {plan}
              </div>
            </div>
          </div>

          <div className="md:ml-auto grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="rounded-xl border bg-background px-4 py-3">
              <p className="text-xs text-muted-foreground">Total courses</p>
              <p className="text-lg font-semibold">{courses}</p>
            </div>
            <div className="rounded-xl border bg-background px-4 py-3">
              <p className="text-xs text-muted-foreground">Learning streak</p>
              <p className="text-lg font-semibold">7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-semibold mb-2">Learning focus</h2>
          <p className="text-muted-foreground text-sm">
            Personalized AI guidance tuned to your study goals.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">AI summaries</span>
            <span className="rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">Quizzes</span>
            <span className="rounded-full border bg-muted/60 px-3 py-1 text-xs text-muted-foreground">Flashcards</span>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-semibold mb-2">AI activity</h2>
          <p className="text-muted-foreground text-sm">
            Your latest AI-generated assets and interactions.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center justify-between">
              <span>Notes generated</span>
              <span className="font-semibold text-foreground">12</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Quizzes created</span>
              <span className="font-semibold text-foreground">5</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Flashcards built</span>
              <span className="font-semibold text-foreground">28</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="font-semibold mb-2">Account</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center justify-between">
              <span>Role</span>
              <span className="font-semibold text-foreground">Student</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Joined</span>
              <span className="font-semibold text-foreground">
                {new Date(user.createdAt!).toDateString()}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Timezone</span>
              <span className="font-semibold text-foreground">Local</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Recent activity</h3>
            <p className="text-sm text-muted-foreground">
              A quick look at your latest learning sessions.
            </p>
          </div>
          <button className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-indigo-300">
            View all activity
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-background px-4 py-3">
            <p className="text-xs text-muted-foreground">Course outline</p>
            <p className="font-semibold">Intro to Data Science</p>
          </div>
          <div className="rounded-xl border bg-background px-4 py-3">
            <p className="text-xs text-muted-foreground">Quiz created</p>
            <p className="font-semibold">Neural Networks Basics</p>
          </div>
          <div className="rounded-xl border bg-background px-4 py-3">
            <p className="text-xs text-muted-foreground">Notes generated</p>
            <p className="font-semibold">Linear Algebra Summary</p>
          </div>
        </div>
      </div>
    </div>
  );
}
