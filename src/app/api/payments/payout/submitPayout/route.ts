import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import PaymentRequest, { PaymentStatus } from "@/models/paymentRequest";
import TotalBalance from "@/models/totalBalance";

export async function POST(req: NextRequest) {
  try {
    await connect();

    // Parse the JSON request body
    const requestBody = await req.json();

    const payoutId = requestBody.payoutId ?? "";
    const labelId = requestBody.labelId ?? "";
    const status = requestBody.status ?? PaymentStatus.PENDING;
    const amount = parseFloat(requestBody.amount ?? "0");

    if (!labelId || isNaN(amount) || !payoutId) {
      return NextResponse.json({
        message: "LabelId, amount, and payoutId are required",
        success: false,
        status: 400,
      });
    }

    // Update the PaymentRequest with the new data
    const updateRequest = await PaymentRequest.findByIdAndUpdate(
      payoutId,
      {
        amount,
        update_at: new Date(),
        status,
      },
      { new: true }
    );

    if (!updateRequest) {
      return NextResponse.json({
        message: "Payment request not found",
        success: false,
        status: 404,
      });
    }

    // Update the TotalBalance
    const existingBalance = await TotalBalance.findOne({ labelId });
    if (existingBalance) {
      // Update the existing total balance
      existingBalance.totalBalance -= amount;
      await existingBalance.save();
    } else {
      // Create a new total balance record
      const newTotalBalance = new TotalBalance({
        labelId,
        totalBalance: -amount, // Initial balance set to negative of amount being processed
      });
      await newTotalBalance.save();
    }

    return NextResponse.json({
      message: "Payout request submitted successfully",
      success: true,
      status: 201,
      data: updateRequest,
    });
  } catch (error: any) {
    console.error("Error submitting payout request:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
