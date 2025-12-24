import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function DashBoardHeader() {
  return (
    <div className=' p-5 shadow-md flex justify-between'>
      <Image src ="/logo.svg" alt=''  width={40} height={40}/>
      <UserButton />
    </div>
  )
}

export default DashBoardHeader