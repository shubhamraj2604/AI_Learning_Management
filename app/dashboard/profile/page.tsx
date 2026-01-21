"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useCourseStore } from "@/store/useCourseStore";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const courses = useCourseStore((s) => s.courses);
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
      <img
  src={user.imageUrl}
  alt="Profile"
  className="w-20 h-20 rounded-full border"
/>


        <div>
          <h1 className="text-2xl font-bold">
            {user.fullName || "User"}
          </h1>
          <p className="text-gray-500 text-sm">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid gap-6">
        {/* Learning Goal */}
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold mb-1">🎯 Learning Goal</h2>
          <p className="text-gray-500 text-sm">
            Personalized AI-powered learning experience.
          </p>
        </div>

        {/* AI Activity (placeholder) */}
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold mb-1">🤖 AI Activity</h2>
          <p className="text-gray-500 text-sm">
            AI-generated notes, quizzes, and interactions will appear here.
          </p>
        </div>

        {/* Account */}
        <div className="rounded-xl border p-5">
          <h2 className="font-semibold mb-2">⚙️ Account</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Role: Student</li>
            <li>• Joined: {new Date(user.createdAt!).toDateString()}</li>
          </ul>
        </div>

        <div className="roundex-xl border p-5">
          <p><span className="font-semibold">Total courses : </span>
            {courses}</p>
        </div>
      </div>
    </div>
  );
}
