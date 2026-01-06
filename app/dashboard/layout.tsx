"use client";

import { useState } from "react";
import Sidebar from "./_components/Sidebar";
import MobileMenu from "./_components/MobileMenu";
import DashBoardHeader from "./_components/DashBoardHeader";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 fixed">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <DashBoardHeader onMenuClick={() => setMenuOpen(true)} />
        <div className="p-4 md:p-10">{children}</div>
        <Toaster />
      </div>
    </div>
  );
}
