"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Particles from "@/components/Particles";
import SplitText from "@/components/SplitText";
import Magnet from "@/components/Magnet";
import GradientText from "@/components/GradientText";
import Flashcards from "@/components/Flashcards";
import { ArrowRight, Brain, Sparkles, BookOpen, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#fdf2ff_100%)] text-slate-900">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
        <Particles
          particleColors={["#6366f1", "#8b5cf6", "#14b8a6"]}
          particleCount={120}
          particleSpread={6}
          speed={0.2}
          particleBaseSize={70}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      <nav className="relative z-20 flex items-center justify-between px-6 py-4 backdrop-blur-xl md:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg">
            <Brain className="h-5 w-5" />
          </div>
          <GradientText
            colors={["#2ee7a3", "#3b5fff", "#2ee7a3", "#3b5fff", "#2ee7a3"]}
            animationSpeed={3}
            showBorder={false}
            className="text-2xl font-extrabold tracking-tight"
          >
            Easy Study
          </GradientText>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button className="rounded-full bg-slate-900 px-5 text-white hover:bg-slate-800">
              Sign In
            </Button>
          </Link>
          <UserButton />
        </div>
      </nav>

      <main className="relative z-20 px-6 pb-20 md:px-10 lg:px-16">
        <section className="grid items-center gap-10 rounded-[2rem] border border-white/70 bg-white/70 px-6 py-10 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:px-10 md:py-16 lg:px-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              <Sparkles className="h-4 w-4" />
              AI-powered learning platform
            </div>

            <SplitText
              text="Learn Smarter with AI"
              className="text-4xl font-black leading-tight text-slate-900 md:text-6xl"
              delay={80}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 32 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-80px"
              textAlign="left"
            />

            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Build personalized study plans, generate notes, quiz yourself with confidence, and stay motivated with a learning experience that adapts to you.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Magnet padding={60} disabled={false} magnetStrength={0.5}>
                  <Button size="lg" className="rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-white shadow-lg hover:from-indigo-700 hover:to-violet-700">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Magnet>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-slate-300 bg-white/80 px-6 text-slate-700 hover:bg-slate-50"
              >
                Explore Courses
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2 text-sm text-slate-600">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                Structured lessons
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2">
                <Target className="h-4 w-4 text-indigo-600" />
                Smart quizzes
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-400/30 to-violet-500/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-3 shadow-2xl">
              <Image
                src="/hero.webp"
                alt="AI learning illustration"
                width={900}
                height={700}
                className="h-[360px] w-full rounded-[1.4rem] object-cover md:h-[420px]"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-slate-200/70 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-bold text-slate-900 md:text-4xl">Why learners choose Easy Study</h3>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                Every feature is crafted to help you study faster, understand better, and stay consistent.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Personalized Study Plans",
                  description: "AI adapts to your pace and creates a clear path for what to learn next.",
                },
                {
                  title: "Instant Notes & Summaries",
                  description: "Turn lengthy topics into concise, memorable notes in seconds.",
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor your growth and stay motivated with smarter learning insights.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-7 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <h4 className="text-xl font-semibold text-slate-900">{item.title}</h4>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <Flashcards />
        </section>

        <section className="mt-10 rounded-[2rem] bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-800 px-8 py-16 text-center text-white shadow-[0_24px_90px_rgba(67,56,202,0.28)]">
          <h3 className="text-3xl font-bold md:text-5xl">Ready to boost your learning?</h3>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            Join learners who are creating better study habits with AI-powered guidance.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-8 rounded-full bg-white px-8 py-6 text-lg font-semibold text-indigo-700 hover:bg-white/90">
              Start Learning Now
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}
