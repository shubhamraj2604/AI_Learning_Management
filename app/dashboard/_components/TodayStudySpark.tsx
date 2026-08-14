"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowRight, Bookmark, RefreshCw, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type Spark = {
  id: number;
  courseId: string;
  chapterNumber: number;
  type: string;
  title: string;
  content: string;
  courseTitle?: string;
  isFavorite?: boolean;
};

function TodayStudySpark() {
  const [loading, setLoading] = useState(true);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savingFavoriteId, setSavingFavoriteId] = useState<number | null>(null);

  const activeSpark = useMemo(() => sparks[activeIndex] ?? null, [sparks, activeIndex]);

  const loadSparks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/study-spark");
      const nextSparks = res.data?.nuggets ?? [];
      setSparks(nextSparks);

      const selected = res.data?.selected;
      if (selected) {
        const selectedIndex = nextSparks.findIndex((item: Spark) => item.id === selected.id);
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      } else {
        setActiveIndex(0);
      }
    } catch {
      setSparks([]);
      toast.error("Could not load today’s learning spark");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSparks();
  }, []);

  const showAnother = () => {
    if (!sparks.length) return;
    setActiveIndex((current) => (current + 1) % sparks.length);
  };

  const toggleFavorite = async () => {
    if (!activeSpark) return;

    try {
      setSavingFavoriteId(activeSpark.id);
      const nextFavorite = !activeSpark.isFavorite;
      await axios.post("/api/study-spark", {
        nuggetId: activeSpark.id,
        isFavorite: nextFavorite,
      });

      setSparks((current) =>
        current.map((item) =>
          item.id === activeSpark.id ? { ...item, isFavorite: nextFavorite } : item
        )
      );
    } catch {
      toast.error("Could not update favorite");
    } finally {
      setSavingFavoriteId(null);
    }
  };

  if (loading) {
    return (
      <div className="mb-6 rounded-3xl border border-blue-200/80 bg-white px-5 py-5 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <Sparkles className="h-4 w-4 animate-pulse text-blue-600" />
          Loading your daily spark...
        </div>
      </div>
    );
  }

  if (!activeSpark) {
    return (
      <div className="mb-6 rounded-3xl border border-dashed border-blue-200 bg-linear-to-r from-blue-50 to-cyan-50 px-5 py-5">
        <div className="flex items-center gap-3 text-slate-700">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold">Study Spark</h3>
            <p className="text-sm text-slate-500">Your dashboard insight card will appear here after a course is generated.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-br from-slate-950 via-blue-950 to-cyan-900 p-px shadow-xl">
      <div className="relative overflow-hidden rounded-[23px] bg-slate-950 px-5 py-5 text-white md:px-6">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Study Spark
              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 normal-case tracking-normal text-white/80">
                {activeSpark.type}
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-1 normal-case tracking-normal text-white/80">
                Chapter {activeSpark.chapterNumber}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold leading-tight md:text-3xl">
                {activeSpark.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-200 md:text-[15px]">
                {activeSpark.content}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
              <span className="rounded-full bg-white/8 px-3 py-1">
                From {activeSpark.courseTitle || "your course"}
              </span>
              <span className="rounded-full bg-white/8 px-3 py-1">
                Under 30-second recall
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 md:flex-col md:items-end">
            <Button
              variant="outline"
              onClick={showAnother}
              className="border-white/15 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Show another
            </Button>

            <Button
              onClick={toggleFavorite}
              disabled={savingFavoriteId === activeSpark.id}
              className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            >
              <Star className={`h-4 w-4 ${activeSpark.isFavorite ? "fill-current" : ""}`} />
              {activeSpark.isFavorite ? "Saved" : "Save"}
            </Button>

            <Link href={`/course/${activeSpark.courseId}?chapter=${activeSpark.chapterNumber}`}>
              <Button className="bg-white text-slate-950 hover:bg-slate-100">
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mt-4 flex items-center gap-2 text-xs text-slate-400">
          <Bookmark className="h-3.5 w-3.5" />
          One card is selected daily. Repeats are intentional and useful.
        </div>
      </div>
    </div>
  );
}

export default TodayStudySpark;