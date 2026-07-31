import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#eef2ff_0%,_#f8fafc_55%,_#fdf2f8_100%)] px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-8 text-white md:p-10">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-3 text-sm leading-7 text-indigo-100">
              Continue your personalized learning journey and pick up where you left off.
            </p>
          </div>

          <div className="flex items-center justify-center p-4 md:p-8">
            <SignIn routing="hash" />
          </div>
        </div>
      </div>
    </div>
  )
}