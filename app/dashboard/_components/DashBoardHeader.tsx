import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashBoardHeader() {
  return (
    <div className=' p-5 shadow-md flex justify-end'>
      <UserButton />
    </div>
  )
}

export default DashBoardHeader