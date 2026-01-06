"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

type DashBoardHeaderProps = {
  onMenuClick?: () => void;
};

export default function DashBoardHeader({
  onMenuClick,
}: DashBoardHeaderProps) {
  return (
    <div className="p-5 shadow-md flex justify-between items-center">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        {onMenuClick && (
          <Menu
            className="cursor-pointer"
            onClick={onMenuClick}
          />
        )}
      </div>

      {/* Logo */}
      <Link href="/dashboard" className="hidden md:block">
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
      </Link>

      <UserButton />
    </div>
  );
}
