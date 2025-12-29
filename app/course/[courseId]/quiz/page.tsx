"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader, Loader2Icon, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
  `Format that we received from backend
  options = [
     'questions':
     'options':[],
     'correctAnswer'  
  
  ]`;

  const [options, setquizoptions] = useState<any[]>([]);

  const [loading, setloading] = useState(false);
  const generatequiz = async () => {
    try {
      setloading(true);
      const result = await axios.post("/api/study-type", {
        courseId,
        studyType: "quiz",
      });
      console.log(result.data[0]?.content);
      toast.success("Quiz loaded successfully");
      setquizoptions(result.data[0]?.content || []);
    } catch (error) {
      toast("Error loading quiz");
      console.log(error);
    } finally {
      setloading(false);
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

  useEffect(() => {
    if (courseId) generatequiz();
  }, [courseId]);

  if (loading || feedbackloading) {
    return (
      <div className="flex items-center justify-center mt-20 gap-2">
        {/* <RefreshCw className="w-5 h-5 animate-spin" /> */}
        <Loader2Icon className="animate-spin" />
        <span className="font-bold">Loading...</span>
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
