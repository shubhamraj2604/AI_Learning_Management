"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const flashcards = [
  {
    front: "What is the main benefit of AI-powered learning?",
    back: "It personalizes the learning experience and helps learners study more efficiently.",
    tag: "Learning",
  },
  {
    front: "Why are spaced reviews helpful?",
    back: "They strengthen memory over time and make recall easier during exams.",
    tag: "Memory",
  },
  {
    front: "What makes a good quiz?",
    back: "It should be clear, relevant, balanced, and test understanding rather than memorization alone.",
    tag: "Quizzes",
  },
];

export default function Flashcards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentCard = flashcards[activeIndex];

  const nextCard = () => {
    setFlipped(false);
    setActiveIndex((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setActiveIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_45%)]" />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            <Sparkles className="h-4 w-4" />
            Study with flashcards
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">Turn concepts into quick recall</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Practice key ideas in a lightweight, interactive way that feels like a real study session.
          </p>
        </div>

        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
          {activeIndex + 1}/{flashcards.length} cards
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-4 text-white shadow-xl md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              {currentCard.tag}
            </span>
            <span className="text-sm text-slate-400">Tap to reveal</span>
          </div>

          <button
            onClick={() => setFlipped((prev) => !prev)}
            className="flex h-64 w-full items-center justify-center rounded-[1.25rem] border border-white/10 bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 p-6 text-center transition-transform duration-300 hover:scale-[1.01]"
          >
            <span className="text-xl font-semibold leading-relaxed text-white md:text-2xl">
              {flipped ? currentCard.back : currentCard.front}
            </span>
          </button>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={prevCard} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button variant="outline" size="sm" onClick={nextCard} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFlipped(false)} className="border-white/20 bg-white/10 text-white hover:bg-white/20">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">Why this helps</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Speeds up review before quizzes and exams.</li>
              <li>• Keeps study sessions short and focused.</li>
              <li>• Makes difficult topics easier to remember.</li>
            </ul>
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
            <p className="font-semibold">Tip:</p>
            <p className="mt-1">Use flashcards after each lesson to reinforce the concepts you just learned.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
