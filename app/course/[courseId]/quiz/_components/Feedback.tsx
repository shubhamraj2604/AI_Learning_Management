"use client"
import axios from 'axios'
import React, { useState } from 'react'

type feedbackcard = {
    score:number,
    totalscore:number,
    feedback : Feedbackanswer[]
}

type WrongAnswer = {
    question: string;
    userAnswer: string;
    correctAnswer: string;
}


type Feedbackanswer = WrongAnswer & {
   explanation:string
}


function Feedback({
  score,
  totalscore,
  feedback,
}: feedbackcard) {
  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Score: {score} / {totalscore}
      </h2>

      {feedback.length === 0  && score !==0? (
        <p className="text-green-600 text-center font-semibold">
          🎉 Perfect score! No wrong answers.
        </p>
      ) : (
        feedback.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-4 bg-red-50"
          >
            <p className="font-bold">
              Q{idx + 1}. {item.question}
            </p>
            <p className="text-red-600">
              Your answer: {item.userAnswer}
            </p>
            <p className="text-green-700">
              Correct answer: {item.correctAnswer}
            </p>
            <p className='sm:text-sm font-sans'>
                <span className='text-gray-950 font-bold'>Explantion: </span>
                    {item.explanation}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default Feedback