"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {LayoutDashboard, Shield, UserCircle} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { useCourseStore } from "@/store/useCourseStore";


function Sidebar() {
    const MenuList = [
        {
            name:'Dashboard',
            icon:LayoutDashboard,
            path:'/dashboard'
        },
         {
            name:'Upgrade',
            icon:Shield,
            path:'/dashboard/upgrade'
        },
         {
            name:'Profile',
            icon:UserCircle,
            path:'/dashboard/profile'
        },
    ]

    const { user, isLoaded } = useUser()
    const path = usePathname()

    const courses = useCourseStore((s) => s.courses);

  return (
    <div className='h-screen shadow-md  p-5'>
        <div className='flex gap-2 items-center'>
            <Image src={'/logo.svg'} alt='logo' width={40} height={40}/>
            <h2 className='font-bold text-2xl'>Easy Study</h2>
        </div>

        <div>
            <Link href={'/create'}>
            <Button className='w-full mt-10 bg-blue-700'>
               Create New
            </Button>
            </Link>
        <div className='mt-5'>
            {MenuList.map((menu , index) =>(
                <Link href={menu.path}>
                <div key = {index} className={`flex gap-5 items-center p-3 hover:bg-slate-300 rounded-lg mt-3 ${path == menu.path && 'bg-slate-200'}`}>
                    <menu.icon/>
                    <h2>{menu.name}</h2>
                </div>
                </Link>
            ))}
        </div>
    </div>

    <div className='border bg-slate-100 rounded-lg p-3 absolute bottom-10 w-[85%]'>
        <h2 className='text-lg'>Available Credits : {courses}</h2>
        <Progress value={30}/>
        <h2 className='tex-sm'>1 out of {courses} credits used</h2>
        <Link href = {'/dashboard/upgrade'} className='text-blue-800 text-xs mt-3'>Upgrade to create more</Link>        
    </div>
    </div>
  )
}

export default Sidebar