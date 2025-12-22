"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

function Main() {
  const {user} = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const showCourses = async () => {
    try {
      const res = await axios.get("/api/show-courses");
      setCourses(res.data);
      console.log(res.data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) showCourses();
  }, [user]);

  if (loading) return <div><Loader className="animate-spin"/>Loading..</div>;

  return (
    <div>
        <h2 className="font-bold text-2xl mt-10">Your Course List</h2>
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
        <Progress value= {10}/> 
        </div>
      <div className="flex justify-between items-center mt-5">
        <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">
          {course.difficultyLevel}
        </span>
      

        <Button className="text-sm -blue-600 hover:underline">
          View →
        </Button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}

export default Main;
