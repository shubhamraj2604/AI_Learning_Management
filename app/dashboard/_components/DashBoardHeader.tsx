import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function DashBoardHeader() {
  return (
    <div className=' p-5 shadow-md flex justify-between'>
      <Link href="/dashboard"><Image src ="/logo.svg" alt='Logo'  width={40} height={40}/></Link>
      <UserButton />
    </div>
  )
}

export default DashBoardHeader