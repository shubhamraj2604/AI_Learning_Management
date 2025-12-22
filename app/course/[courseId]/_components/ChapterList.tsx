import React from 'react'

function ChapterList({course}: {course :any}) {
    const chapters = course?.courseLayout?.chapters || []
   return (
    <div className='mt-3'>
        <h2 className='font-medium text-xl'>Chapter List</h2>
        <div className='flex flex-col gap-4 justify-between mt-3'> 
            {chapters?.map((item : any) => {
                return (
                    <div key = {item.chapter_number}
                    className='flex gap-5 items-center p-4 border shadow-md'
                    >
                        <h2>{item.chapter_number}</h2>
                     <div>
                     <h2 className='font-semibold'>{item.chapter_title}</h2>
                     <p className='text-gray-500 text-sm'>{item.chapter_summary}</p>
                     </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default ChapterList