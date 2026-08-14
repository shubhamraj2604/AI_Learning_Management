"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useCourseStore } from "@/store/useCourseStore";

function Main() {
  const { user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const setCreditsUsed = useCourseStore((s) => s.setCreditsUsed);
  const creditsUsed = useCourseStore((s) => s.creditsUsed);

  // SHOW COURSES:
  const showCourses = async () => {
    const toastId = toast.loading("Your data is generating, please wait");
    try {
      setLoading(true);
      const res = await axios.get("/api/show-courses");
      setCourses(res.data);
      toast.success("Courses loaded successfully", {
        id: toastId,
        className: "bg-blue-600",
      });
    } catch (error) {
      toast.error("Failed to load courses", { id: toastId });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE COURSE:
  const deleteCourse = async (courseId: string) => {
    setDeletingId(courseId);
    setConfirmId(null);
    try {
      await axios.delete("/api/Delete-course", { data: { courseId } });
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      toast.success("Course deleted successfully");
      // Credits are NOT refunded — but update the store count if needed
    } catch (error) {
      toast.error("Failed to delete course");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (user) showCourses();
  }, [user]);

  if (loading)
    return (
      <div className="flex items-center justify-center mt-20">
        <Loader className="animate-spin" />
        Loading..
      </div>
    );

  return (
    <div>
      {/* Confirm Delete Modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone. The course and all its content (notes, flashcards, quizzes) will be permanently deleted.
              <span className="block mt-2 font-medium text-amber-600">⚠️ Your credit will not be refunded.</span>
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setConfirmId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteCourse(confirmId)}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <h2 className="px-10 font-bold text-xl md:text-2xl mt-10 flex justify-between items-center">
        Your Course List
        <Button
          variant="outline"
          className="border-blue-600"
          onClick={showCourses}
        >
          <RefreshCw />
          Refresh
        </Button>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5 w-full">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-zinc-900 border rounded-2xl shadow-md p-5
                  hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {course.courseLayout.course_title}
            </h3>
            <p className="text-xs line-clamp-2">
              {course.courseLayout.course_summary}
            </p>
            <div className="mt-5">
              <Progress value={10} />
            </div>
            <div className="flex justify-between items-center mt-5">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                {course.difficultyLevel}
              </span>

              <div className="flex gap-2 items-center">
                {/* Delete Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-400"
                  onClick={() => setConfirmId(course.id)}
                  disabled={deletingId === course.id}
                >
                  {deletingId === course.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>

                {/* View / Generating Button */}
                {course.status === "Generating" ? (
                  <Button disabled className="text-sm flex items-center gap-1">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating...
                  </Button>
                ) : (
                  <Link href={`/course/${course.id}`}>
                    <Button className="text-sm hover:underline">View →</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
