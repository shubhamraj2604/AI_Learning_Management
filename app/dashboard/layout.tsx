"use client";

import { useEffect, useState } from "react";
import Sidebar from "./_components/Sidebar";
import MobileMenu from "./_components/MobileMenu";
import DashBoardHeader from "./_components/DashBoardHeader";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useCourseStore } from "@/store/useCourseStore";
import axios from "axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);


   const { user, isLoaded } = useUser();
  const setCourses = useCourseStore((s) => s.setCourses);

  useEffect(() => {
    if (!isLoaded) return;

    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    axios.post("/api/get-courseno", { email })
      .then(res => setCourses(res.data.count ?? 0));
  }, [isLoaded]);


  return (
    <div className="flex">
      {/* Desktop Sidebar */}
      <div className="block md:block w-64 fixed">
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
