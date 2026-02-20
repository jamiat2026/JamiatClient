// app/api/create-subscription/route.js
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, frequency, name, email } = body;

    if (!amount || !frequency) {
      return NextResponse.json(
        { error: "Missing required fields: amount or frequency" },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured on server" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Map frequency to Razorpay plan period
    const period =
      frequency === "Monthly"
        ? "monthly"
        : frequency === "Weekly"
        ? "weekly"
        : frequency === "Daily"
        ? "daily"
        : "yearly";

    // Razorpay enforces minimum intervals for certain periods (daily >= 7)
    const interval =
      period === "daily" ? 7 : 1;

    // Create a plan for this amount/frequency (plans can be created programmatically)
    const plan = await razorpay.plans.create({
      period,
      interval,
      item: {
        name: `Donation - ${period} - ₹${amount}`,
        amount: Math.round(amount * 100),
        currency: "INR",
      },
    });

    // Create a customer (so subscription ties to a customer)
    let customer;
    try {
      customer = await razorpay.customers.create({ name, email });
    } catch (err) {
      const msg = err?.error?.description || "";
      if (msg.includes("Customer already exists")) {
        const existing = await razorpay.customers.all({ email });
        customer = existing?.items?.[0];
      }
      if (!customer?.id) {
        throw err;
      }
    }

    // Create a subscription for the created plan and customer.
    // Keep total_count within Razorpay limits by capping to ~10 years per period.
    const totalCount =
      period === "daily"
        ? 520 // 10 years at 7-day interval
        : period === "weekly"
        ? 520 // 10 years
        : period === "monthly"
        ? 120 // 10 years
        : 20; // yearly: 20 years
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: totalCount,
      customer_id: customer.id,
    });

    return NextResponse.json({ success: true, plan, customer, subscription });
  } catch (error) {
    console.error("Create-subscription error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
