import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-indigo-600">Easy Study</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost">Subscribe</Button>
          <UserButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-30 py-20 md:py-32 gap-10">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Learn Smarter with AI
          </h2>
          <p className="text-gray-700 text-lg md:text-xl">
            Personalized learning powered by AI. Get tailored study plans, notes, and guidance to achieve your goals faster.
          </p>
          <div className="flex gap-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Explore Courses</Button>
          </div>
        </div>
        <div className="flex-1 relative w-full h-64 md:h-96">
          <Image
            src="/hero.webp" // replace with your hero image
            alt="AI Learning Illustration"
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 bg-white">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose AI LMS?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-xl mb-2">Personalized Study Plans</h4>
            <p className="text-gray-600">AI analyzes your learning style to create optimized study schedules.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-xl mb-2">Instant Notes & Summaries</h4>
            <p className="text-gray-600">Generate concise notes and summaries for any subject, instantly.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-xl mb-2">Track Your Progress</h4>
            <p className="text-gray-600">Monitor your learning journey and get AI-driven suggestions to improve.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 bg-indigo-600 text-white text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Learning?</h3>
        <p className="mb-8 text-lg md:text-xl">Join thousands of learners leveraging AI for smarter learning.</p>
        <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">Start Learning Now</Button>
      </section>
    </div>
  );
}
