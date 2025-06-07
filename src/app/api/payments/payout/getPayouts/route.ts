import { connect } from "@/dbConfig/dbConfig";
import PaymentRequest from "@/models/paymentRequest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get("labelId");

    if (!labelId) {
      return NextResponse.json({
        message: "Labelid required",
        success: false,
        status: 400,
      });
    }

    // Fetch payments from the database
    const payments = await PaymentRequest.find({labelId}).sort({ time: 1 }); // Sorting by time in descending order

    return NextResponse.json({
      message: "Payouts fetched successfully",
      success: true,
      status: 200,
      data: payments,
    });
  } catch  {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
