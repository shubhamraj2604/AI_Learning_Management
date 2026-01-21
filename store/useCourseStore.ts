import { create } from "zustand";

type CourseStore = {
  courses: number;
  setCourses: (count: number) => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  courses: 0,
  setCourses: (count) => set({ courses: count }),
}));
