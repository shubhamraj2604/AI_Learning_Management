"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify';

type Notes = {
 courseId:string,
 ChapterId:number,
 notes:string
}

function ViewNotes() {
    
    const {courseId} = useParams();
    const [notes, setNotes] = useState<Notes[]>([]);
    const runone = useRef(false);
  const stepCount = useRef(0);
const [, forceRender] = useState(0);

const prev = () => {
  stepCount.current = Math.max(stepCount.current - 1, 0);
  forceRender(v => v + 1);
};

const next = () => {
  stepCount.current = Math.min(stepCount.current + 1, notes.length-1);
  forceRender(v => v + 1);
};

    const GetNotes = async()=>{
        const result = await axios.post('/api/study-type' , {
            courseId:courseId,
            studyType:'notes'
        })
        console.log(result.data);
        setNotes(result.data);
    }

    const rawHTML =
  notes[stepCount.current]?.notes
    ?.replace(/```html/g, '')
    ?.replace(/```/g, '')
    ?.trim() || '';

const safeHTML = DOMPurify.sanitize(rawHTML);

    useEffect(() => {
        // it runs the useEffect only one , no more useless api calls
       if(runone.current)return;
       runone.current = true;
       if(courseId)GetNotes()
    },[courseId])
  return notes && (
    <div>
        <div className='flex gap-5 items-center'>
            {stepCount.current!=0 && <Button variant={'outline'} size={'sm'} onClick={prev}>Prev</Button>}
            {notes?.map((items:Notes , index:number) => (
                <div key ={index} className={`w-full h-2 rounded-full
                ${index <= stepCount.current ?'bg-blue-600' : 'bg-gray-300'}`}>
                
               </div>
            ))}
            {stepCount.current!=notes.length-1 && <Button variant={'outline'} size={'sm'} onClick={next}>Next</Button>}
        </div>
        <div className='text-lg'>
            <div dangerouslySetInnerHTML={{ __html: safeHTML }}/>
        </div>
    </div>
  )
}

export default ViewNotes