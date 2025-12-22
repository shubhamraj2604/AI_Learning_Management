"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { eq } from 'drizzle-orm';
import {USER_TABLE} from '@/configs/schema'
import db from '@/configs/db'
import axios from 'axios'

function Provider({children}) {
  const {user} = useUser();
  // console.log(user?.fullName)
  // console.log(user?.primaryEmailAddress?.emailAddress)
  
  useEffect(() =>{
        user&&ChecKiSNewUser();
  } , [user])

 const ChecKiSNewUser = async () => {

  const resp = await axios.post('/api/Create-User', {user:user})
  console.log(resp)
  console.log(resp.data)
};
  return (
    <div>{children}</div>
  )
}

export default Provider