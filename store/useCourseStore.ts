import { create } from "zustand";

type CourseStore = {
  courses: number;
  setCourses: (count: number) => void;
  plan: string;
  setPlan: (plan: string) => void;
  isMember: boolean;
  setIsMember: (isMember: boolean) => void;
  creditsUsed: number;
  setCreditsUsed: (credits: number) => void;
  creditsResetAt: string | null;
  setCreditsResetAt: (date: string | null) => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  courses: 0,
  setCourses: (count) => set({ courses: count }),
  plan: "Basic",
  setPlan: (plan) => set({ plan }),
  isMember: false,
  setIsMember: (isMember) => set({ isMember }),
  creditsUsed: 0,
  setCreditsUsed: (credits) => set({ creditsUsed: credits }),
  creditsResetAt: null,
  setCreditsResetAt: (date) => set({ creditsResetAt: date }),
}));
