"use client";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

const tiers = [
  {
    name: "Basic",
    label: "Free",
    price: "$0",
    description: "Perfect for trying AI learning with light, occasional usage.",
    instant: 10,
    rate: 5,
    meter: 35,
    cta: "Stay on Basic",
    highlight: false,
    features: ["Course outlines", "Smart notes", "Email support"],
  },
  {
    name: "Student",
    label: "Popular",
    price: "$9",
    description: "Best for daily study sessions and steady AI workflows.",
    instant: 25,
    rate: 15,
    meter: 60,
    cta: "Upgrade to Student",
    highlight: true,
    features: ["Everything in Basic", "Quizzes + flashcards", "Priority queue"],
  },
  {
    name: "Gold",
    label: "Power",
    price: "$19",
    description: "Built for power users who generate content nonstop.",
    instant: 100,
    rate: 60,
    meter: 90,
    cta: "Go Gold",
    highlight: false,
    features: ["Everything in Student", "Fastest generation", "Premium support"],
  },
];
type Tier = "Basic" | "Student" | "Gold";
function page() {
  const { user } = useUser();
  
  const handlePayment = async (tier: Tier) => {
  try {
    const result = await axios.post("/api/create-checkout-session", {
      tier,
      email: user?.primaryEmailAddress?.emailAddress,
    });
     
      window.location.href = result.data.url;
  } catch (error) {
    console.error("Payment error:", error);
    return;
  }
};
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <section className="relative px-6 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 w-fit rounded-full border border-border bg-muted/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Upgrade Plans
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Pick the pace that fits your learning
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Each plan boosts how many AI generations you can run at once and
              per minute. Start free, then level up as your study workload grows.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 ${
                  tier.highlight ? "ring-2 ring-indigo-300" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                      {tier.label}
                    </p>
                    <h2 className="text-2xl font-bold mt-1">{tier.name}</h2>
                  </div>
                  <div className="text-3xl font-extrabold text-foreground">
                    {tier.price}
                    <span className="text-sm text-muted-foreground">/mo</span>
                  </div>
                </div>

                <p className="mt-4 text-muted-foreground">{tier.description}</p>

                <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Speed</span>
                    <span>Per minute</span>
                  </div>

                  <div className="mt-3 h-2 w-full rounded-full bg-border/60">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300"
                      style={{ width: `${tier.meter}%` }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Instant requests</p>
                      <p className="text-lg font-semibold text-foreground">
                        {tier.instant}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Requests / minute</p>
                      <p className="text-lg font-semibold text-foreground">
                        {tier.rate}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                    onClick={() => {
                        handlePayment(tier.name as Tier);
                    }}
                  className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                    tier.highlight
                      ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500"
                      : "border border-border text-foreground hover:border-indigo-300"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default page;