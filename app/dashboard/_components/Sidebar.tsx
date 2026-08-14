"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Shield, UserCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useCourseStore } from "@/store/useCourseStore";

function Sidebar() {
    const MenuList = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Upgrade', icon: Shield, path: '/dashboard/upgrade' },
        { name: 'Profile', icon: UserCircle, path: '/dashboard/profile' },
    ]

    const path = usePathname()
    const plan = useCourseStore((s) => s.plan);
    const creditsUsed = useCourseStore((s) => s.creditsUsed);
    const creditsResetAt = useCourseStore((s) => s.creditsResetAt);

    const maxCredits = plan === "Gold" ? 100 : plan === "Student" ? 15 : 5;
    const progressValue = maxCredits > 0 ? (creditsUsed / maxCredits) * 100 : 0;
    const remainingCredits = Math.max(0, maxCredits - creditsUsed);

    // Calculate next reset date (1st of next month)
    const nextResetDate = (() => {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return next.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    })();

    return (
        <div className='h-screen shadow-md p-5'>
            <div className='flex gap-2 items-center'>
                <Image src={'/logo.svg'} alt='logo' width={40} height={40} />
                <h2 className='font-bold text-2xl'>Easy Study</h2>
            </div>

            <div>
                <Link href={'/create'}>
                    <Button className='w-full mt-10 bg-blue-700'>
                        Create New
                    </Button>
                </Link>
                <div className='mt-5'>
                    {MenuList.map((menu, index) => (
                        <Link href={menu.path} key={index}>
                            <div className={`flex gap-5 items-center p-3 hover:bg-slate-300 rounded-lg mt-3 ${path == menu.path && 'bg-slate-200'}`}>
                                <menu.icon />
                                <h2>{menu.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className='border bg-slate-100 rounded-lg p-3 absolute bottom-10 w-[85%]'>
                <div className='flex justify-between items-center mb-1'>
                    <h2 className='text-sm font-semibold'>Credits Used</h2>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        remainingCredits === 0 ? 'bg-red-100 text-red-600' :
                        remainingCredits <= 2 ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                    }`}>
                        {remainingCredits} left
                    </span>
                </div>
                <Progress value={progressValue} />
                <h2 className='text-xs text-gray-500 mt-1'>{creditsUsed} of {maxCredits} credits used this month</h2>
                <p className='text-xs text-gray-400 mt-0.5'>Resets on {nextResetDate}</p>
                <Link href={'/dashboard/upgrade'} className='text-blue-800 text-xs mt-2 block'>
                    Upgrade to create more →
                </Link>
            </div>
        </div>
    )
}

export default Sidebar