"use client";
import DashBoardHeader from "@/app/dashboard/_components/DashBoardHeader";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CourseIntroCard from "./_components/CourseIntroCard";
import StudyMaterial from "./_components/StudyMateriaL";
import ChapterList from "./_components/ChapterList";
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
  const getCourseDetails = async () => {
    try {
      const resp = await axios.get("/api/show-courses", {
        params: {
          courseId: courseId,
        },
      });
      setcourse(resp.data.result);
      console.log(resp.data.result)
    } catch (error) {
        console.log(error)
        toast('error');
    }
  };

  useEffect(() => {
      if (courseId) getCourseDetails();
  },[courseId]); 

  return (
    <div>
      <DashBoardHeader />
      <div className="mx-10 md:mx-36 lg:px-60 mt-10 mb-10">

      {/* CourseIntro */}
      <CourseIntroCard course = {course}/>
      {/* Study Material */}
      <StudyMaterial/>
      {/* Chapter List */}
      <ChapterList course = {course} />
      </div>
    </div>
  );
}

export default Course;
