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
  const setPlan = useCourseStore((s) => s.setPlan);
  const setIsMember = useCourseStore((s) => s.setIsMember);
  const setCreditsUsed = useCourseStore((s) => s.setCreditsUsed);
  const setCreditsResetAt = useCourseStore((s) => s.setCreditsResetAt);

  useEffect(() => {
    if (!isLoaded) return;

    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return;

    axios.post("/api/get-courseno", { email })
      .then(res => {
        setCourses(res.data.count ?? 0);
        setPlan(res.data.plan ?? "Basic");
        setIsMember(res.data.isMember ?? false);
        setCreditsUsed(res.data.creditsUsed ?? 0);
        setCreditsResetAt(res.data.creditsResetAt ?? null);
      });
  }, [isLoaded]);


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
