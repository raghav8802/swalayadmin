import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import PaymentRequest from "@/models/paymentRequest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    const payoutId = searchParams.get("payoutId"); // Get the payoutId from the query parameters

    if (!payoutId) {
      return NextResponse.json({
        message: "payoutId is required",
        success: false,
        status: 400,
      });
    }

    // Find the specific PaymentRequest by _id
    const payment = await PaymentRequest.findById(payoutId);

    if (!payment) {
      return NextResponse.json({
        message: "Payment not found",
        success: false,
        status: 404,
      });
    }

    // Fetch the corresponding label
    const label = await Label.findById(payment.labelId);
    const labelName = label?.lable || label?.username || ""; // Get label name or fallback to username if lable is null

    // Prepare the response object
    const paymentWithLabelName = {
      ...payment.toObject(),
      labelName, // Add the labelName to the response object
    };

    return NextResponse.json({
      message: "Payout fetched successfully",
      success: true,
      status: 200,
      data: paymentWithLabelName,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
