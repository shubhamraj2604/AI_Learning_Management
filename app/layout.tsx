import type { Metadata } from "next";
import { Geist, Geist_Mono , Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

const outfit = Outfit({
   variable: "--font-geist-mono",
  subsets: ["latin"],
})
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "EasyLearn",
  description: "EasyLearn is an AI-powered learning management system that helps students generate quizzes, receive personalized feedback, and enhance learning efficiently.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${outfit.variable} ${outfit.variable} antialiased`}
        >
       <Provider>
        {children}
       </Provider>
      </body>
    </html>
    </ClerkProvider>
  );
}
