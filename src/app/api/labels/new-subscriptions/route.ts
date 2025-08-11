import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Subscription from "@/models/Subscription";
import sendMail from "@/helpers/sendMail";
import React from "react";
import Label from "@/models/Label";
import SubscriptionSuccessEmail from "@/components/email/SubscriptionSuccessEmail";

const plansDetails = [
  {
    id: 1,
    name: "Basic Plan",
    provider: "Per Track / Lifetime",
    price: "116.82",
    trackCount: "1",
  },
  {
    id: 3,
    name: "Basic Plus Plan",
    provider: "Per Track / Lifetime",
    price: "234.82",
    trackCount: "1",
  },
  {
    id: 4,
    name: "Pro Plan",
    provider: "Per Track / Lifetime",
    price: "423.62",
    trackCount: "1",
  },
  {
    id: 5,
    name: "All-In-One Plan",
    provider: "Per Track / Lifetime",
    price: "706.82",
    trackCount: "1",
  },
  {
    id: 6,
    name: "LABEL PARTNER",
    provider: "Unlimited Track/ Lifetime",
    price: "824.82",
    trackCount: "unlimited",
  },
];

export async function POST(request: NextRequest) {
  console.log("Verifying payment in api...");

  try {
    await connect();

    const data = await request.json();
    console.log("Request body:", data);

    const { userEmail, planId, startDate } = data;

    if (!userEmail || !planId || !startDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Fetch label details by _id: userId
    const userDetails = await Label.findOne({ email: userEmail }).select(
      "_id email"
    );
    console.log("User details:", userDetails);
    if (!userDetails) {
      return NextResponse.json({ message: "Label not found" }, { status: 404 });
    }

    // 2. Map plan details by planId
    const planDetails = plansDetails.find((plan) => plan.id === Number(planId));
    console.log("Plan details:", planDetails);

    if (!planDetails) {
      return NextResponse.json({ message: "Invalid planId" }, { status: 400 });
    }

    console.log("startDate:", startDate);
    // 3. Calculate endDate (assuming 12 months from startDate)
    const start = new Date(startDate);
    const endDate = new Date(start);
    endDate.setMonth(endDate.getMonth() + 12);

    console.log("Start date:", start);
    console.log("End date:", endDate);

    // 4. Fetch the last invoice ID from the database
    const lastSubscription = await Subscription.findOne({})
      .sort({ createdAt: -1 })
      .select("invoiceId").limit(1);

    let newInvoiceId = "SL/INV/P3001";
    if (lastSubscription && lastSubscription.invoiceId) {
      const lastInvoiceId = lastSubscription.invoiceId;
      const invoiceNumberMatch = lastInvoiceId.match(/(\d+)$/);
      if (invoiceNumberMatch) {
        const lastInvoiceNumber = parseInt(invoiceNumberMatch[1], 10);
        const newInvoiceNumber = (lastInvoiceNumber + 1)
          .toString()
          .padStart(4, "0");
        newInvoiceId = `SL/INV/P${newInvoiceNumber}`;
      }
    }

    // 5. Create and save subscription
    const subscription = new Subscription({
      userId: userDetails._id,
      planId: planId,
      planName: planDetails.name,
      price: planDetails.price,
      trackCount: planDetails.trackCount,
      startDate: start,
      endDate: endDate,
      paymentId: `pay_CST_${Math.random().toString(36).substr(2, 9)}`,
      orderId: `order_CST_${Math.random().toString(36).substr(2, 9)}`,
      razorpayPaymentId: `razorpay_CST${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      invoiceId: newInvoiceId,
      status: "active",
    });
    await subscription.save();
    console.log("Subscription saved successfully:", subscription);

    // 6. Send subscription confirmation email
    try {
      const emailTemplate = React.createElement(SubscriptionSuccessEmail, {
        clientName: userDetails.name,
        planName: planDetails.name,
        price: planDetails.price,
        startDate: start.toLocaleDateString(),
      });
      await sendMail({
        to: userDetails.email,
        subject: `Your SwaLay Subscription is Active!`,
        emailTemplate,
      });
      console.log("Subscription confirmation email sent to", userDetails.email);
    } catch (emailError) {
      console.error(
        "Failed to send subscription confirmation email:",
        emailError
      );
    }

    return NextResponse.json(
      { message: "payment verified successfully", isOk: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
