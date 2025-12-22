"use client"
import React, { useState ,useEffect} from 'react'
import Selectoptions from './_components/Selectoptions';
import { Button } from '@/components/ui/button';
import Topicinput from './_components/Topicinput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { useRouter } from "next/navigation";
  type FormData = {
    studyType: string;
    topic: string;
    difficulty: "Easy" | "Medium" | "Hard" | "";
  };


function CreatePage() {
    const [step , setStep] = useState(0);
    const [loading , setloading] = useState(false);
    const {user} = useUser()
   const [formdata , setFormData] = useState<FormData>({
     studyType: "",
     topic: "",
     difficulty: ""
   });
const router = useRouter();
  const handleUserInput = <K extends keyof FormData>(
  fieldName: K,
  fieldValue: FormData[K]
) => {
  setFormData(prev => ({
    ...prev,
    [fieldName]: fieldValue,
  }));
};
useEffect(() => {
  console.log("formdata changed:", formdata);
  console.log(user?.primaryEmailAddress?.emailAddress);
}, [formdata]);

// Used to save input and generate  course layout using ai
const GenerateCourseOutline = async() => {
  setloading(true)
  const courseId = uuidv4();
  const result = await axios.post('/api/generate-course-outline' , {
    courseId:courseId,
    ...formdata,
    createdBy:user?.primaryEmailAddress?.emailAddress
  });

  setloading(false)
   if (result.status === 200) {
      router.push("/dashboard"); // or `/dashboard/${courseId}`
    }
 
  console.log(result)
}

  return (
    <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'>
        <h2 className='font-bold text-4xl text-blue-600'>Start Building Your Personal Study Material</h2>
        <p className='text-gray-500 texr-lg'> Fill All the details in order to gernerate study material for next project</p>
        <div className='mt-10'>
            {step == 0 ? <Selectoptions selectedStudyType={(value) => handleUserInput('studyType' , value)}/> : 
              <Topicinput 
              setTopic={(value) => handleUserInput('topic' , value)}
              setDifficultyLevel={(value) =>handleUserInput('difficulty' , value)}
              difficulty={formdata.difficulty} 
              />}
             
        </div>
        <div className='flex justify-between w-full mt-10 px-20'>
          {step!=0 ? <Button variant={'outline'} onClick={() => setStep(step - 1)}>Prev</Button> : '-'}
          {step == 0 ?<Button className='bg-blue-600' onClick={() =>setStep(step+1)}>Next</Button>: 
          !loading ? (<Button onClick={GenerateCourseOutline} disabled={loading} >Generate</Button> ): 
          <Loader className='animate-spin '/>}
        </div>
    </div>
  )
}

export default CreatePage