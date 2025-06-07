import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import PaymentRequest from "@/models/paymentRequest";

export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();

    const { labelId, amount } = body;

    if (!labelId || !amount) {
      return NextResponse.json({
        message: "Missing required fields",
        success: false,
        status: 400,
      });
    }

    const newPaymentRequest = new PaymentRequest({
      labelId,
      amount,
    });

    const savedPaymentRequest = await newPaymentRequest.save();
    return NextResponse.json({
      message: "Payment request created successfully",
      success: true,
      status: 200,
      data: savedPaymentRequest,
    });
  } catch  {
    console.error("Error creating payment request:");
    
    return NextResponse.json({
      message: "Internal Server error",
      success: true,
      status: 500,
    });

  }
}
