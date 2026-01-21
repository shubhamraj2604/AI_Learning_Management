"use client";
import React, { useEffect, useState } from "react";
import {
  NotebookText,
  FileText,
  CreditCard,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";

type StudyMaterialProps = {
  courseId: any;
  course: any;
};

type Status = "Generating" | "Ready";

function StudyMaterial({ courseId, course }: StudyMaterialProps) {
  const [StudyType, setStudyType] = useState<any>();
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({});

  /* Generate Content  */
  const GenerateContent = async (studytype: string) => {
    // prevent duplicate request
    if (statusMap[studytype] === "Generating") return;

    if (!course?.courseLayout?.chapters?.length) {
      toast.error("No chapters found");
      return;
    }

    const chapterContent =
      course.courseLayout.chapters
        .map(
          (c: any) => `
Chapter ${c.chapter_number}: ${c.chapter_title}
Summary: ${c.chapter_summary}
Topics:
${c.topics.join(", ")}
`
        )
        .join("\n\n") || "";

    try {
      // optimistic UI
      setStatusMap((prev) => ({ ...prev, [studytype]: "Generating" }));

      await axios.post("/api/generate-study-type-content", {
        courseId,
        type: studytype,
        chapter: chapterContent.trim(),
      });

      pollStatus(studytype);
    } catch (error) {
      toast.error("Failed to generate");
      setStatusMap((prev) => ({ ...prev, [studytype]: "Ready" }));
    }
  };

const pollStatus = (studytype: string) => {
  const interval = setInterval(async () => {
    try {
      const res = await axios.get("/api/generate-study-type-content", {
        params: { courseId, studyType: studytype },
      });

      if (res.data.status === "Ready") {
        setStatusMap((prev) => ({ ...prev, [studytype]: "Ready" }));
        clearInterval(interval);
        GetStudyType(); // refresh generated content
      }
    } catch {
      clearInterval(interval);
      toast.error("Polling failed");
    }
  }, 3000);
};


  const GetStudyType = async () => {
    const result = await axios.post("/api/study-type", {
      courseId,
      studyType: "ALL",
    });

    setStudyType(result.data);

    // initialize statusMap from backend data
    Object.keys(result.data).forEach((key) => {
      if (result.data[key]?.[0]?.status) {
        setStatusMap((prev) => ({
          ...prev,
          [key]: result.data[key][0].status,
        }));
      }
    });
  };

  useEffect(() => {
    if (courseId) GetStudyType();
  }, [courseId]);

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

  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl">Study Material</h2>

      <div className="grid grid-col-2 md:grid-cols-4 gap-5 my-5">
        {MaterialList.map((item) => {
          const Icon = item.icon;
          const isEmpty =
            !StudyType?.[item.type] ||
            StudyType[item.type].length === 0;

          return (
            <div
              key={item.name}
              className={`flex flex-col items-center p-5 border shadow-md rounded-lg
              ${isEmpty && "grayscale"}`}
            >
              {Icon && <Icon className="w-12 h-12 text-red-700 mb-3" />}
              <h2 className="font-medium mt-2">{item.name}</h2>
              <p className="text-gray-500 text-sm text-center">
                {item.desc}
              </p>

              {isEmpty ? (
                statusMap[item.type] === "Generating" ? (
                  <Button
                    className="mt-3 bg-amber-400 w-full flex items-center gap-2"
                    variant="outline"
                    disabled
                  >
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating
                  </Button>
                ) : (
                  <Button
                    className="mt-3 bg-amber-400 w-full"
                    variant="outline"
                    onClick={() => GenerateContent(item.type)}
                  >
                    Generate
                  </Button>
                )
              ) : (
                <Link href={`/course/${courseId}${item.path}`}>
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
