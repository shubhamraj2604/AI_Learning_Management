"use client";
import React, { useEffect, useRef, useState } from "react";
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

const SUPPORTED_GENERATE_TYPES = ["flashcard", "quiz"];

function StudyMaterial({ courseId, course }: StudyMaterialProps) {
  const [StudyType, setStudyType] = useState<any>();
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({});
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Generate Content  */
  const GenerateContent = async (studytype: string) => {
    // Block unsupported types (e.g. Q&A) to prevent unnecessary requests
    if (!SUPPORTED_GENERATE_TYPES.includes(studytype)) {
      toast.error("This feature is not available yet");
      return;
    }
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
    // Clear any existing poll to prevent multiple intervals
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await axios.get("/api/generate-study-type-content", {
          params: { courseId, studyType: studytype },
        });

        if (res.data.status === "Ready") {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setStatusMap((prev) => ({ ...prev, [studytype]: "Ready" }));
          GetStudyType(); // refresh generated content
        }
      } catch {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
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

  // Poll for notes when course is still generating chapters
  useEffect(() => {
    if (!courseId || course?.status !== "Generating") return;
    const notesInterval = setInterval(() => {
      GetStudyType();
    }, 5000);
    return () => clearInterval(notesInterval);
  }, [courseId, course?.status]);

  // Cleanup poll interval on unmount to prevent unnecessary requests
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

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
      disabled: true,
    },
  ];

  return (
    <div className="mt-10">
      <h2 className="font-medium text-xl">Study Material</h2>

      <div className="grid grid-col-2 md:grid-cols-4 gap-5 my-5">
        {MaterialList.map((item) => {
          const Icon = item.icon;
          const isDisabled = "disabled" in item && item.disabled;

          // For notes: only show View when ALL chapters are generated
          const expectedChapterCount = course?.courseLayout?.chapters?.length ?? 0;
          const notesReady =
            item.type === "notes" &&
            StudyType?.notes?.length === expectedChapterCount &&
            expectedChapterCount > 0;

          // For notes: also show "Generating" when course is still generating notes
          const notesGenerating =
            item.type === "notes" &&
            course?.status === "Generating" &&
            !notesReady;

          const isEmpty =
            item.type === "notes"
              ? !notesReady
              : !StudyType?.[item.type] || StudyType[item.type].length === 0;

          const isGenerating =
            notesGenerating || statusMap[item.type] === "Generating";

          return (
            <div
              key={item.name}
              className={`flex flex-col items-center p-5 border shadow-md rounded-lg
              ${(isEmpty || isDisabled) && "grayscale"}`}
            >
              {Icon && <Icon className="w-12 h-12 text-red-700 mb-3" />}
              <h2 className="font-medium mt-2">{item.name}</h2>
              <p className="text-gray-500 text-sm text-center">
                {item.desc}
              </p>

              {isDisabled ? (
                <Button
                  className="mt-3 bg-amber-400 w-full"
                  variant="outline"
                  disabled
                >
                  Coming Soon
                </Button>
              ) : isEmpty ? (
                isGenerating ? (
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
                    disabled={isGenerating}
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
