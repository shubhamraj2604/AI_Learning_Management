"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function DashBoardHeader({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <div className="p-5 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-3 md:hidden">
        <Menu className="cursor-pointer" onClick={onMenuClick} />
      </div>
         
        <Link href="/dashboard" className="hidden md:block">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
        </Link>
      <UserButton />
    </div>
  );
}
