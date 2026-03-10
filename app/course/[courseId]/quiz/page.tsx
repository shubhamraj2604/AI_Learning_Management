"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2Icon, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Feedback from "./_components/Feedback";


type WrongAnswer = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}


type Feedbackanswer = WrongAnswer & {
   explanation:string
}

function QuizSection() {
  const { courseId } = useParams();
  const [options, setquizoptions] = useState<any[]>([]);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [loading, setloading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadQuiz = useCallback(async () => {
    try {
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "quiz",
      });
      const content = result.data[0]?.content;
      if (Array.isArray(content) && content.length > 0) {
        setquizoptions(content);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [courseId]);

  const checkAndLoadQuiz = useCallback(async () => {
    if (!courseId) return;
    setloading(true);
    try {
      const hasQuiz = await loadQuiz();
      if (hasQuiz) {
        toast.success("Quiz loaded successfully");
      }
    } catch {
      toast.error("Error loading quiz");
    } finally {
      setloading(false);
      setInitialCheckDone(true);
    }
  }, [courseId, loadQuiz]);

  const handleGenerateQuiz = useCallback(async () => {
    if (!courseId || generating) return;
    setGenerating(true);
    try {
      const courseResp = await axios.get("/api/show-courses", {
        params: { courseId },
      });
      const course = courseResp.data?.result;
      const chapters = course?.courseLayout?.chapters;
      if (!chapters?.length) {
        toast.error("No chapters found");
        setGenerating(false);
        return;
      }
      const chapterContent = chapters
        .map(
          (c: any) => `
Chapter ${c.chapter_number}: ${c.chapter_title}
Summary: ${c.chapter_summary}
Topics:
${c.topics?.join(", ") ?? ""}
`
        )
        .join("\n\n");

      await axios.post("/api/generate-study-type-content", {
        courseId,
        type: "quiz",
        chapter: chapterContent.trim(),
      });

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await axios.get("/api/generate-study-type-content", {
            params: { courseId, studyType: "quiz" },
          });
          if (res.data?.status === "Ready") {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            const hasQuiz = await loadQuiz();
            if (hasQuiz) {
              toast.success("Quiz ready!");
            }
            setGenerating(false);
          }
        } catch {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          toast.error("Quiz generation failed");
          setGenerating(false);
        }
      }, 3000);
    } catch (error) {
      toast.error("Failed to generate quiz");
      setGenerating(false);
    }
  }, [courseId, generating, loadQuiz]);

  useEffect(() => {
    if (courseId) checkAndLoadQuiz();
  }, [courseId, checkAndLoadQuiz]);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  type SelectedAnswers = {
    [questionIndex: number]: number;
  };

  const stepCount = useRef(0);
  const [, forceRender] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const prev = () => {
    stepCount.current = Math.max(stepCount.current - 1, 0);
    forceRender((v) => v + 1);
  };

  const next = () => {
    stepCount.current = Math.min(stepCount.current + 1, options.length - 1);
    forceRender((v) => v + 1);
  };
  // Selected answers
  const selectAnswer = (answerIndex: number) => {
    const currentQuestion = stepCount.current;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }));
  };
  
  const [score, setscore] = useState(0);
  const totalScore = () => {
    let total = 0;

    options.forEach((question, index) => {
      const selected = selectedAnswers[index];

      if (selected == undefined) return;
      const correctIndex = ["A", "B", "C", "D"].indexOf(question.correctAnswer);

      if (correctIndex == selected) total++;
    });
    setscore(total);
    console.log(total);
  };
  
  // hAndle the submit button
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = async () => {
    setfeedbackloading(true)
    totalScore();

    const wrong = getWrongAnswers();
    setWrongAnswers(wrong)
    
    getFeedback(wrong)
  };

// Wrong answers
const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);  
const getWrongAnswers = () => {
  return options
    .map((question, index) => {
      const selected = selectedAnswers[index];
      if (selected === undefined) return null;

      const correctIndex = ["A", "B", "C", "D"].indexOf(
        question.correctAnswer
      );

      if (selected !== correctIndex) {
        return {
          question: question.question,
          userAnswer: question.options[selected],
          correctAnswer: question.options[correctIndex],
        };
      }
      return null;
    })
    .filter(Boolean) as WrongAnswer[];
};

// FEEBACK
const [feedbackloading , setfeedbackloading] = useState(false)
const [feedback , setfeedback] = useState<Feedbackanswer[]>([]) 
const getFeedback = async (wrong: WrongAnswer[]) => {
         if (wrong.length === 0) {
         setSubmitted(true);
         return;
        }
     try {
        const result = await axios.post('/api/get-feedback' , {
            wrongAnswer : wrong
        });
        setfeedback(result.data);
     } catch (error) {
        toast('Error Genearing Feedback')
        console.log(error)
     }finally{
         setfeedbackloading(false);
         setSubmitted(true);
     }
}

  if (!initialCheckDone || loading || feedbackloading) {
    return (
      <div className="flex items-center justify-center mt-20 gap-2">
        <Loader2Icon className="animate-spin" />
        <span className="font-bold">Loading...</span>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Quiz Section</h2>
        <p className="text-gray-500 text-center">
          No quiz available yet. Generate one to get started.
        </p>
        {generating ? (
          <Button
            className="bg-amber-400"
            variant="outline"
            disabled
          >
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Generating Quiz...
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button
              className="bg-amber-400"
              variant="outline"
              onClick={handleGenerateQuiz}
              disabled={generating}
            >
              Generate Quiz
            </Button>
            <Link href={`/course/${courseId}`}>
              <Button variant="outline">Back to Course</Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-5 items-center">
        {stepCount.current != 0 && (
          <Button variant={"outline"} size={"sm"} onClick={prev}>
            Prev
          </Button>
        )}
        {options?.map((items: any, index: number) => (
          <div
            key={index}
            className={`w-full h-2 rounded-full
                ${index <= stepCount.current ? "bg-blue-600" : "bg-gray-300"}`}
          ></div>
        ))}
        {stepCount.current != options?.length - 1 && (
          <Button variant={"outline"} size={"sm"} onClick={next}>
            Next
          </Button>
        )}
      </div>
      <div className="flex justify-center mt-4 p-3">
        <h2 className="text-3xl text-blue-700 font-bold ">Quiz Section</h2>
      </div>
      {/* Options */}
      <div className="">
        {options?.map(
          (item: any, index: number) =>
            index === stepCount.current && (
              <div key={index}>
                {/* Question */}
                <h2 className="font-semibold text-lg m-4">{item.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-1 gap-1">
                  {/* Options */}
                  {item.options?.map((choice: string, choiceIndex: number) => {
                    const correctIndex = ["A", "B", "C", "D"].indexOf(
                      item.correctAnswer
                    );
                    return (
                      <Button
                        key={choiceIndex}
                        variant="outline"
                        onClick={() => {
                          selectAnswer(choiceIndex);
                        }}
                        className={`p-4 border-2 rounded-2xl transition-all duration-200 text-left
                ${
                  selectedAnswers[stepCount.current] === choiceIndex
                    ? choiceIndex === correctIndex
                      ? "bg-green-100 border-green-400 text-green-800 shadow-md"
                      : "bg-red-100 border-red-400 text-red-800 shadow-md"
                    : "border-gray-300 hover:border-blue-400 bg-white hover:bg-gray-50"
                }`}
                      >
                        {choice}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )
        )}
      </div>
      {!submitted ? (
        <>
          {/* quiz UI */}
          {stepCount.current === options.length - 1 && (
            !feedbackloading && <Button onClick={() => {handleSubmit()}}>Submit Quiz</Button>
          )}
        </>
      ) : (
        // <p className="text-2xl font-bold text-center">
        //   Final Score: {score} / {options.length}
        // </p>
         <Feedback 
      score={score}
      totalscore={options.length}
      feedback={feedback}
      />
      )}


     
    </div>
  );
}

// I have to design quiz
// I have to pass a prompt to ai
// which says give me quiz question based on the notes generated and the quiz should be random around 25 questions
// i want four options , and if the user selects correct option he will get a marks

export default QuizSection;
