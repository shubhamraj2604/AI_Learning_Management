import React from "react";
import { NotebookText, FileText, CreditCard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

function StudyMaterial() {
  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read Notes to prepare it",
      icon: NotebookText,
      path: "/notes",
    },
    {
      name: "Flashcards",
      desc: "Use flashcards to revise concepts",
      icon: FileText,
      path: "/flashcard",
    },
    {
      name: "Quiz",
      desc: "Test your knowledge with quizzes",
      icon: CreditCard,
      path: "/quiz",
    },
    {
      name: "Question/Answer",
      desc: "Ask or answer questions",
      icon: MessageSquare,
      path: "/qa",
    },
  ];

  return (
    <div className="mt-10">
        <h2 className="font-medium text-xl">Study Material</h2>
        <div className="grid grid-col-2 md:grid-cols-4 gap-5 my-5">
      {MaterialList.map((item) => {
          const Icon = item.icon;
          return (
              <div
              key={item.name}
              className="flex flex-col items-center p-5 border shadow-md rounded-lg"
              >
                <h2 className="p-1 px-2 bg-green-500 text-white rounded-xl text-[10px] mb-2">Ready</h2>
            {Icon && <Icon className="w-12 h-12 text-red-700 mb-3" />}
            <h2 className="font-medium mt-2">{item.name}</h2>
            <p className="text-gray-500 text-sm text-center">{item.desc}</p>
            <Button className="mt-3 bg-amber-400 w-full" variant='outline'>
                View
            </Button>
          </div>
        );
    })}
    </div>
    </div>
  );
}

export default StudyMaterial;
