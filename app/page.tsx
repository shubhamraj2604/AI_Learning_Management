"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import Particles from "@/components/Particles";
import SplitText from "@/components/SplitText";
import Magnet from "@/components/Magnet"
import GradientText from "@/components/GradientText";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden flex flex-col relative">
      {/* Background Particles Container */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={['#000000']}
          particleCount={150}
          particleSpread={5}
          speed={0.2}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      <nav className="relative z-20 flex justify-between items-center px-8 py-4 backdrop-blur-md bg-gray-300 shadow-lg border-b border-white/50">
        <h1 className="">
          <GradientText
colors={[
  "#2ee7a3", // bright teal / medium-dark
  "#3b5fff", // bright indigo
  "#2ee7a3", // repeat teal
  "#3b5fff", // repeat indigo
  "#2ee7a3"  // repeat teal
]}
  animationSpeed={3}
  showBorder={false}
  className="custom-class text-3xl font-extrabold"
       > Easy Study</GradientText>
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
              Sign In
            </Button>
          </Link>
          <UserButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-20 flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20 md:py-32 gap-12 flex-1 bg-linear-to-r from-indigo-300 via-indigo-300 to-purple-400">
        <div className="flex-1 space-y-6 text-white/90 drop-shadow-lg">
            <SplitText
  text="Learn Smarter with AI"
  className="text-5xl font-extrabold text-center text-black"
  delay={100}
  duration={0.6}
  ease="power3.out"
  splitType="chars"
  from={{ opacity: 0, y: 40 }}
  to={{ opacity: 1, y: 0 }}
  threshold={0.1}
  rootMargin="-100px"
  textAlign="center"
/>

          <p className="text-lg md:text-xl text-gray-700 max-w-xl drop-shadow-md">
            Personalized learning powered by AI. Get tailored study plans,
            notes, and guidance to achieve your goals faster.
          </p>

          <div className="flex gap-4">
            <Link href = '/dashboard'>
            <Magnet padding={50} disabled={false} magnetStrength={0.50}>
            <Button size="lg" className="bg-indigo-700 text-white hover:bg-indigo-800 shadow-xl drop-shadow-lg">
              Get Started
            </Button>
            </Magnet>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white/80 text-black hover:bg-white/20 backdrop-blur-sm"
              >
              Explore Courses
              </Button>
          </div>
        </div>

        {/* Hero Image with subtle overlay particles */}
        <div className="flex-1 relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src="/hero.webp"
            alt="AI Learning Illustration"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle particles overlay on image */}
        </div>
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <Particles
              particleColors={['#0f172a']}
              particleCount={200}
              particleSpread={35}
              speed={0.9}
              particleBaseSize={300}
              moveParticlesOnHover={true}
              alphaParticles={true}
            />
          </div>
      </section>

       {/* 2nd section */}
      <section className="relative z-20 px-8 py-20 ">
        <div className="absolute inset-0 opacity-10">
          <Particles
            particleColors={['#0f172a']}
            particleCount={500}
            particleSpread={200}
            speed={0.03}
            particleBaseSize={120}
            moveParticlesOnHover={true}
            alphaParticles={true}
          />
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-indigo-700">
            Why Choose AI LMS?
          </h3>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white/70 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm border border-white/50 hover:-translate-y-2">
              <h4 className="font-semibold text-xl mb-4 text-indigo-700">
                Personalized Study Plans
              </h4>
              <p className="text-gray-600 leading-relaxed">
                AI analyzes your learning style to create optimized study schedules.
              </p>
            </div>

            <div className="bg-white/70 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm border border-white/50 hover:-translate-y-2">
              <h4 className="font-semibold text-xl mb-4 text-indigo-700">
                Instant Notes & Summaries
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Generate concise notes and summaries for any subject, instantly.
              </p>
            </div>

            <div className="bg-white/70 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm border border-white/50 hover:-translate-y-2">
              <h4 className="font-semibold text-xl mb-4 text-indigo-700">
                Track Your Progress
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Monitor your learning journey and get AI-driven suggestions to improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative z-20 px-8 py-20 bg-linear-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Particles
            particleColors={['#c7d2fe', '#e0e7ff']}
            particleCount={100}
            particleSpread={30}
            speed={0.06}
            particleBaseSize={50}
            moveParticlesOnHover={false}
            alphaParticles={true}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">
            Ready to Boost Your Learning?
          </h3>

          <p className="mb-12 text-lg md:text-xl text-white/90 drop-shadow-md leading-relaxed">
            Join thousands of learners leveraging AI for smarter learning.
          </p>

          <Button size="lg" className="bg-white text-indigo-700 hover:bg-white/90 text-lg px-12 py-8 font-semibold shadow-2xl drop-shadow-2xl hover:scale-105 transition-all">
            Start Learning Now
          </Button>
        </div>
      </section>
    </div>
  );
}
