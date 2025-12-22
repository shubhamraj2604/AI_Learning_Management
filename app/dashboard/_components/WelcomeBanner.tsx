"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function WelcomeBanner() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-6 text-white shadow-lg">
      
      {/* Decorative blur */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />

      <div className="relative flex items-center gap-6">
        {/* Image */}
        <Image
          src="/welcome.jpg"
          alt="Welcome"
          width={110}
          height={110}
          className="rounded-xl shadow-md"
          />

        {/* Text */}
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Welcome back, {user?.firstName} 👋
          </h2>

          <p className="mt-1 text-white/90">
            “Small progress each day adds up to big results.”
          </p>

          <p className="mt-3 text-sm text-white/80">
            Let’s continue building something amazing today 🚀
          </p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
