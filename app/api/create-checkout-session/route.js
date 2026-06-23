import { NextResponse } from "next/server";
import Stripe from "stripe";


export async function POST(req) {
  try {
    const { tier, email } = await req.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // console.log(process.env.STRIPE_STUDENT_PRICE_ID);

    const priceIds = {
      Student: process.env.STRIPE_STUDENT_PRICE_ID,
      Gold: process.env.STRIPE_GOLD_PRICE_ID,
    };

    const priceId = priceIds[tier];

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid tier" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
  {
    price_data: {
      currency: "usd",
      product_data: {
        name: tier,
      },
      unit_amount: tier === "Gold" ? 1900 : 900,
    },
    quantity: 1,
  },
],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        tier,
        email,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}