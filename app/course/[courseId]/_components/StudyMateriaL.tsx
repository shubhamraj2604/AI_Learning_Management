"use client";
import React, { useEffect, useState } from "react";
import {
  NotebookText,
  FileText,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";

type StudyMaterialProps = {
  courseId: any;
  course: any;
};

function StudyMaterial({ courseId, course }: StudyMaterialProps) {
  const [StudyType, setStudyType] = useState<any>();
  const GenerateContent = async (studytype: string) => {
      if (!course?.courseLayout?.chapters?.length) {
    console.error("No chapters found");
    return;
  }
    const chapterContent = course?.courseLayout?.chapters
      ?.map(
        (c: any) => `
Chapter ${c.chapter_number}: ${c.chapter_title}
Summary: ${c.chapter_summary}
Topics:
${c.topics.join(", ")}
`
      )
      .join("\n\n");

    try {
      const result = await axios.post("/api/generate-study-type-content", {
        courseId,
        type: studytype,
        chapter: chapterContent, 
      });

      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read Notes to prepare it",
      icon: NotebookText,
      path: "/notes",
      type: "notes",
    },
    {
      name: "Flashcards",
      desc: "Use flashcards to revise concepts",
      icon: FileText,
      path: "/flashcard",
      type: "flashcard",
    },
    {
      name: "Quiz",
      desc: "Test your knowledge with quizzes",
      icon: CreditCard,
      path: "/quiz",
      type: "quiz",
    },
    {
      name: "Question/Answer",
      desc: "Ask or answer questions",
      icon: MessageSquare,
      path: "/qa",
      type: "qa",
    },
  ];

  const GetStudyType = async () => {
    const result = await axios.post("/api/study-type", {
      courseId: courseId,
      studyType: "ALL",
    });

    setStudyType(result.data);
    console.log(result.data?.quiz[0].status);
  };

  useEffect(() => {
    if (courseId) GetStudyType();
  }, [courseId]);
  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl">Study Material</h2>
      <div className="grid grid-col-2 md:grid-cols-4 gap-5 my-5">
        {MaterialList.map((item) => {
          const Icon = item.icon;
          return (
           
              <div
                key={item.name}
                className={`flex flex-col items-center p-5 border shadow-md rounded-lg
                ${(StudyType?.[item.type]?.length == 0 || StudyType?.[item.type]?.length == null)  && "grayscale"} 
                `}
              >
                <h2 className="p-1 px-2 bg-green-500 text-white rounded-xl text-[10px] mb-2">
                  Ready
                </h2>
                {Icon && <Icon className="w-12 h-12 text-red-700 mb-3" />}
                <h2 className="font-medium mt-2">{item.name}</h2>
                <p className="text-gray-500 text-sm text-center">{item.desc}</p>
                {StudyType?.[item.type]?.length == 0 || StudyType?.[item.type]?.length == null  ? (
                  <Button
                    className="mt-3 bg-amber-400 w-full"
                    variant="outline"
                    onClick={() => GenerateContent(item.type)}
                  >
                    Generate
                  </Button>
                ) : (
                   <Link key={item.name} href={"/course/" + courseId + item.path}>
                  <Button
                    className="mt-3 bg-amber-400 w-full"
                    variant="outline"
                    >
                    View
                  </Button>
                    </Link>
                )}
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudyMaterial;
