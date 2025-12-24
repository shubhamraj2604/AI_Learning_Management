import React , {useEffect, useState} from "react";
import { NotebookText, FileText, CreditCard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";

function StudyMaterial({courseId} :{courseId:any}) {
  const MaterialList = [
    {
      name: "Notes/Chapters",
      desc: "Read Notes to prepare it",
      icon: NotebookText,
      path: "/notes",
      type:"notes"
    },
    {
      name: "Flashcards",
      desc: "Use flashcards to revise concepts",
      icon: FileText,
      path: "/flashcard",
      type:"flashcard"
    },
    {
      name: "Quiz",
      desc: "Test your knowledge with quizzes",
      icon: CreditCard,
      path: "/quiz",
      type:"quiz"
    },
    {
      name: "Question/Answer",
      desc: "Ask or answer questions",
      icon: MessageSquare,
      path: "/qa",
      type:"qa"
    },
  ];

  const [StudyType , setStudyType] = useState<any>()

  const GetStudyType = async() => {
    const result = await axios.post('/api/study-type' , {
      courseId:courseId,
      studyType:'ALL'
    })

    setStudyType(result.data)
    console.log(result.data)
  }

  useEffect(() => {
    if(courseId)GetStudyType()
  } , [courseId])
  return (
    <div className="mt-10">
        <h2 className="font-medium text-xl">Study Material</h2>
        <div className="grid grid-col-2 md:grid-cols-4 gap-5 my-5">
      {MaterialList.map((item) => {
          const Icon = item.icon;
          return (
            <Link key = {item.name} href={'/course/'+courseId+item.path}>
              <div
              key={item.name}
              className={`flex flex-col items-center p-5 border shadow-md rounded-lg
                ${StudyType?.[item.type]?.length == null && 'grayscale' } 
                `}
                >
                <h2 className="p-1 px-2 bg-green-500 text-white rounded-xl text-[10px] mb-2">Ready</h2>
            {Icon && <Icon className="w-12 h-12 text-red-700 mb-3" />}
            <h2 className="font-medium mt-2">{item.name}</h2>
            <p className="text-gray-500 text-sm text-center">{item.desc}</p>
            <Button className="mt-3 bg-amber-400 w-full" variant='outline'>
               {StudyType?.[item.type]?.length == null ? 'Generate' : 'View'}
            </Button>
          </div>
          </Link>
        );
    })}
    </div>
    </div>
  );
}

export default StudyMaterial;
