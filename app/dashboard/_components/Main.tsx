"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader, RefreshCw } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Main() {
  const { user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // SHOW COURSES:
  const showCourses = async () => {
    const toastId = toast.loading("Your data is generating, please wait");

    try {
      setLoading(true);

      const res = await axios.get("/api/show-courses");
      setCourses(res.data);
      console.log(res.data);
      toast.success("Courses loaded successfully", {
        id: toastId,
        className: "bg-blue-600",
      });
    } catch (error) {
      toast.error("Failed to load courses", {
        id: toastId,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // To load the courses whenever user visits this page
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
            className="bg-white dark:bg-zinc-900 border  rounded-2xl shadow-md p-5
                  hover:shadow-lg transition-all duration-300"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {course.courseLayout.course_title}
            </h3>
            <p className="text-xs line-clamp-2">
              {course.courseLayout.course_summary}
            </p>
            {/* 
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 mt-5">
        {course.courseType}
      </p> */}
            <div className="mt-5">
              <Progress value={10} />
            </div>
            <div className="flex justify-between items-center mt-5">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                {course.difficultyLevel}
              </span>

              {course.status === "Generating" ? (
                <Button
                  disabled
                  className="text-sm  flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </Button>
              ) : (
                <Link href={`/course/${course.courseId}`}>
                  <Button className="text-sm hover:underline">
                    View →
                  </Button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
