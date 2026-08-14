import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  console.log("secret exists:", !!process.env.STRIPE_WEBHOOK_SECRET);
  console.log("signature exists:", !!sig);
  console.log("body length:", body.length);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const email = session.metadata?.email;
    const tier = session.metadata?.tier;

    console.log("💳 Checkout session completed!", { email, tier });

    if (email && tier) {
      try {
        const updateResult = await db
          .update(USER_TABLE)
          .set({
            isMember: true,
            plan: tier,
          })
          .where(eq(USER_TABLE.email, email))
          .returning();

        console.log("✅ DB update result:", updateResult);
      } catch (dbError) {
        console.error("❌ DB update failed in webhook:", dbError);
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }
    } else {
      console.warn("⚠️ Webhook session lacks email or tier metadata", session.metadata);
    }
  }

  return NextResponse.json({ received: true });
}
