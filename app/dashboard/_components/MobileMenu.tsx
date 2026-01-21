"use client";

import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Shield, UserCircle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCourseStore } from "@/store/useCourseStore";

const MenuList = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Upgrade", icon: Shield, path: "/dashboard/upgrade" },
  { name: "Profile", icon: UserCircle, path: "/dashboard/profile" },
];


export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const path = usePathname();
  const courses = useCourseStore((s) => s.courses);
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="
          fixed top-0 left-0 z-50
          h-screen w-64 bg-white p-5 shadow
          md:hidden
        "
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <Image src="/logo.svg" alt="logo" width={36} height={36} />
            <h2 className="font-bold text-xl">Easy Study</h2>
          </div>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="space-y-4">
          <div>
           <Link href={'/create'}>
            <Button className='w-full mt-10 bg-blue-700'>
               Create New
            </Button>
            </Link>
          </div>
          {MenuList.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={onClose}
              className={`flex gap-4 items-center p-3 rounded-lg hover:bg-slate-200 ${path == item.path && 'bg-slate-200'}`}
            >
              <item.icon />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
         <div className='border bg-slate-100 rounded-lg p-3 absolute bottom-10 w-[85%]'>
        <h2 className='text-lg'>Available Credits : {courses}</h2>
        <Progress value={30}/>
        <h2 className='text-sm'>1 out of {courses} credits used</h2>
        <Link href = {'/dashboard/upgrade'} className='text-blue-800 text-xs mt-3'>Upgrade to create more</Link>        
    </div>
      </div>
    </>
  );
}
