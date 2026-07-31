"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Flashcard = {
  front: string;
  back: string;
};

type StudyRecord = {
  content?: Flashcard[] | { flashcards?: Flashcard[] } | null;
  status?: string;
};

function normalizeFlashcards(content: StudyRecord["content"]) {
  if (Array.isArray(content)) return content;
  if (content && typeof content === "object" && Array.isArray(content.flashcards)) {
    return content.flashcards;
  }
  return [];
}

export default function FlashcardsPage() {
  const { courseId } = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadFlashcards = useCallback(async () => {
    if (!courseId) return false;

    const result = await axios.post("/api/study-type", {
      courseId,
      studyType: "flashcard",
    });

    const cards = normalizeFlashcards(result.data?.[0]?.content);
    setFlashcards(cards);
    return cards.length > 0;
  }, [courseId]);

  const checkAndLoadFlashcards = useCallback(async () => {
    if (!courseId) return;

    setLoading(true);
    try {
      const hasFlashcards = await loadFlashcards();
      if (hasFlashcards) {
        toast.success("Flashcards loaded successfully");
      }
    } catch {
      toast.error("Error loading flashcards");
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  }, [courseId, loadFlashcards]);

  const pollFlashcardStatus = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await axios.get("/api/generate-study-type-content", {
          params: { courseId, studyType: "flashcard" },
        });

        if (res.data?.status === "Ready") {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }

          const hasFlashcards = await loadFlashcards();
          if (hasFlashcards) {
            toast.success("Flashcards ready!");
          }
          setGenerating(false);
        }
      } catch {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        toast.error("Flashcard generation failed");
        setGenerating(false);
      }
    }, 3000);
  }, [courseId, loadFlashcards]);

  const handleGenerateFlashcards = useCallback(async () => {
    if (!courseId || generating) return;

    setGenerating(true);
    setActiveIndex(0);
    setFlipped(false);

    try {
      const courseResp = await axios.get("/api/show-courses", {
        params: { courseId },
      });

      const course = courseResp.data?.result;
      const chapters = course?.courseLayout?.chapters;

      if (!chapters?.length) {
        toast.error("No chapters found");
        setGenerating(false);
        return;
      }

      const chapterContent = chapters
        .map(
          (chapter: any) => `
Chapter ${chapter.chapter_number}: ${chapter.chapter_title}
Summary: ${chapter.chapter_summary}
Topics:
${chapter.topics?.join(", ") ?? ""}
`
        )
        .join("\n\n");

      await axios.post("/api/generate-study-type-content", {
        courseId,
        type: "flashcard",
        chapter: chapterContent.trim(),
      });

      pollFlashcardStatus();
    } catch {
      toast.error("Failed to generate flashcards");
      setGenerating(false);
    }
  }, [courseId, generating, pollFlashcardStatus]);

  useEffect(() => {
    if (courseId) checkAndLoadFlashcards();
  }, [courseId, checkAndLoadFlashcards]);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const currentCard = flashcards[activeIndex];

  const nextCard = () => {
    if (!flashcards.length) return;
    setFlipped(false);
    setActiveIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    if (!flashcards.length) return;
    setFlipped(false);
    setActiveIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  if (!initialCheckDone || loading) {
    return (
      <div className="mt-20 flex items-center justify-center gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="font-semibold">Loading flashcards...</span>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_24px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_35%)]" />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            <Sparkles className="h-4 w-4" />
            Flashcard review
          </div>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Generate and revise with AI flashcards</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Create quick recall cards from the course chapters, then flip through them to reinforce the most important ideas.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
          <span>{flashcards.length ? `${activeIndex + 1}/${flashcards.length} cards` : "No cards yet"}</span>
          <Button size="sm" variant="outline" onClick={handleGenerateFlashcards} disabled={generating}>
            {generating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {generating ? "Generating" : "Generate"}
          </Button>
        </div>
      </div>

      {flashcards.length === 0 ? (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <div className="flex h-full min-h-[320px] flex-col justify-between rounded-[1.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.95),rgba(168,85,247,0.9),rgba(20,184,166,0.88))] p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/70">Ready to generate</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">Turn course chapters into bite-sized recall cards.</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/12 p-4 text-sm text-white/90 backdrop-blur">
                  Focused prompts
                </div>
                <div className="rounded-2xl bg-white/12 p-4 text-sm text-white/90 backdrop-blur">
                  Short front, clear back
                </div>
                <div className="rounded-2xl bg-white/12 p-4 text-sm text-white/90 backdrop-blur">
                  Stored in your course
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">How it works</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>• Pulls chapter titles, summaries, and topics from the course.</li>
                <li>• Sends them to the flashcard Inngest worker.</li>
                <li>• Saves the generated cards and loads them back here.</li>
              </ul>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">Tip:</p>
              <p className="mt-1">Generate flashcards after the course outline is ready so the cards stay aligned with the real chapter structure.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-4 text-white shadow-xl md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                Flashcard {activeIndex + 1}
              </span>
              <span className="text-sm text-slate-400">Tap to reveal</span>
            </div>

            <button
              onClick={() => setFlipped((prev) => !prev)}
              className="group relative h-[18rem] w-full rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-0 text-center [perspective:1200px] transition-transform duration-300 hover:scale-[1.01]"
            >
              <div
                className={`relative h-full w-full rounded-[1.5rem] transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
                  flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] p-6 [backface-visibility:hidden]">
                  <span className="max-w-3xl text-xl font-semibold leading-relaxed text-white md:text-2xl">
                    {currentCard?.front}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center rounded-[1.5rem] p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="max-w-3xl text-xl font-semibold leading-relaxed text-white md:text-2xl">
                    {currentCard?.back}
                  </span>
                </div>
              </div>
            </button>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm" onClick={prevCard} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button variant="outline" size="sm" onClick={nextCard} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFlipped(false)} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Card list</h3>
              <div className="mt-4 space-y-3">
                {flashcards.map((card, index) => (
                  <button
                    key={`${card.front}-${index}`}
                    onClick={() => {
                      setActiveIndex(index);
                      setFlipped(false);
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      index === activeIndex
                        ? "border-amber-300 bg-amber-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{card.front}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{card.back}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[1.25rem] border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
              <p className="font-semibold">Review pattern</p>
              <p className="mt-1">Flip the card first, then jump to the next one only after you can recall the answer without looking.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}