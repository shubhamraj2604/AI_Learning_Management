import React from 'react'
import DashBoardHeader from '../dashboard/_components/DashBoardHeader'
import { Toaster } from 'react-hot-toast'



function CourseViewLayout({children} : {children : React.ReactNode} ) {
  return (
    <div>
        <DashBoardHeader />
        <div className='mx-10 md:mx-36 lg:px-60 mt-10 mb-10'>
            {children}
        </div>
        <Toaster />
    </div>
  )
}

export default CourseViewLayout