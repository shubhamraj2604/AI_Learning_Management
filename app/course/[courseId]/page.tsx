"use client";
import DashBoardHeader from "@/app/dashboard/_components/DashBoardHeader";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterial from "./_components/StudyMateriaL";
import ChapterList from "./_components/ChapterList";
import { Loader, RefreshCw } from "lucide-react";

interface Course {
  id: number;
  courseId: string;
  courseLayout: any; // or CourseLayout
  difficultyLevel: string;
  status: string;
}


function Course() {
  const { courseId } = useParams();
  const [course, setcourse] = useState<Course | null>(null);
  const [loading , setLoading ] = useState<any>(false);
  const getCourseDetails = async () => {
    try {
      setLoading(true);
      const resp = await axios.get("/api/show-courses", {
        params: {
          courseId: courseId,
        },
      });
      setcourse(resp.data.result);
      // console.log(resp.data.result)
    } catch (error) {
        // console.log(error)
        toast('error');
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
      if (courseId) getCourseDetails();
  },[courseId]); 

 if (loading) {
  return (
    <div className="flex items-center justify-center mt-20 gap-2">
      {/* <RefreshCw className="w-5 h-5 animate-spin" /> */}
      <Loader className="animate-spin"/>
      <span className="font-bold">Loading...</span>
    </div>
  );
}


  return (
    <div>
      <div className="">

      {/* CourseIntro */}
      <CourseIntroCard course = {course}/>
      {/* Study Material */}
      <StudyMaterial courseId = {courseId} course = {course}/>
      {/* Chapter List */}
      <ChapterList course = {course} />
      </div>
    </div>
  );
}

export default Course;
