import { create } from "zustand";

type CourseStore = {
  courses: number;
  setCourses: (count: number) => void;
  plan: string;
  setPlan: (plan: string) => void;
  isMember: boolean;
  setIsMember: (isMember: boolean) => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  courses: 0,
  setCourses: (count) => set({ courses: count }),
  plan: "Basic",
  setPlan: (plan) => set({ plan }),
  isMember: false,
  setIsMember: (isMember) => set({ isMember }),
}));
