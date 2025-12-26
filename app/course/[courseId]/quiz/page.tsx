"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader, Loader2Icon, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

function QuizSection() {
  const { courseId } = useParams();
  `Format that we received from backend
  options = [
     'questions':
     'options':[],
     'correctAnswer'  
  
  ]`

const [options, setquizoptions] = useState<any[]>([]);

const [loading , setloading] = useState(false)
  const generatequiz = async () => {
    try {
      setloading(true)
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "quiz",
      });
      console.log(result.data)
      toast.success('Quiz loaded successfully')
      setquizoptions(result.data[0]?.content || []);
    } catch (error) {
      toast("Error loading quiz");
      console.log(error)
    }finally{
      setloading(false)
    }
  };

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

  const selectAnswer = (answerIndex: number) => {
    const currentQuestion = stepCount.current;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answerIndex,
    }));
  };

  useEffect(() => {
    if (courseId) generatequiz();
  }, [courseId]);

  if(loading){
    return (
      <div className="flex items-center justify-center mt-20 gap-2">
      {/* <RefreshCw className="w-5 h-5 animate-spin" /> */}
      <Loader2Icon className="animate-spin"/>
      <span className="font-bold">Loading...</span>
    </div>
    )
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
      <h2 className="flex items-center justify-center text-3xl text-blue-700 font-bold mt-4 p-3">Quiz Section</h2>
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
                        onClick={() => selectAnswer(choiceIndex)}
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
    </div>
  );
}

// I have to design quiz
// I have to pass a prompt to ai
// which says give me quiz question based on the notes generated and the quiz should be random around 25 questions
// i want four options , and if the user selects correct option he will get a marks

export default QuizSection;
