import { Progress } from "@/components/ui/progress";
import React from "react";
import { BookOpen } from "lucide-react";

function CourseIntroCard({ course }: { course: any }) {
  if (!course) return null;

  return (
    <div className="flex gap-5 items-center p-5 border-2 shadow-md rounded-xl">
      <div className="">
        <BookOpen className="w-10 h-10 md:w-20 md:h-20 text-blue-500"/>
      </div>
      <div className="flex flex-col gap-3 p-4 border shadow-md rounded-lg">
        {/* Course Title */}
        <h2 className="text-lg sm:text-lg md:text-xl font-extrabold">
          {course.courseLayout.course_title}
        </h2>

        {/* Course Summary */}
        <p className="text-sm sm:text-base md:text-sm font-semibold md:line-clamp-none sm:line-clamp-3">
          {course.courseLayout.course_summary}
        </p>

        {/* Progress Bar */}
        <div className="w-full mt-2">
          <Progress value={10} className="h-2 sm:h-3 rounded-full" />
        </div>

        {/* Total Chapters */}
        <h3 className="mt-3 text-blue-500 font-mono text-sm sm:text-base">
          Total Chapters: {course?.courseLayout?.chapters?.length || 0}
        </h3>
      </div>
    </div>
  );
}

export default CourseIntroCard;
