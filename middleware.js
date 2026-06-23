import { clerkMiddleware , createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)' , '/create' , '/course(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  if (
    url.pathname.startsWith("/api/inngest") ||
    url.pathname.startsWith("/api/webhook")
  ) {
    return;
  }
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // Skip Next.js internals, static files, AND api/inngest
    '/((?!_next|api/inngest|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Skip API routes too - they'll be caught by first matcher if needed
    '/(api|trpc)(.*)',
  ],
};
