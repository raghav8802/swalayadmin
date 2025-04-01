import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
// import PaymentRequest, { PaymentStatus } from "@/models/paymentRequest";
import PaymentRequest, { PaymentStatus } from "@/models/paymentRequest";
import Payment from "@/models/Payments";
import TotalBalance from "@/models/totalBalance";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get("labelId");

    if (!labelId) {
      return NextResponse.json({
        message: "LabelId is required",
        success: false,
        status: 400,
      });
    }

    // Fetch only lable and username fields from Label by ID
    const label = await Label.findById(labelId).select("lable username");

    // Get LabelName, use username if lable is blank or null
    const LabelName = label
      ? label.lable && label.lable.trim() !== ""
        ? label.lable
        : label.username
      : "Unknown Label";

      // Fetch payments from the database
      const payments = await Payment.find({ labelId }).sort({ time: 1 });
      
      //! calculate total pay in balance
    // Fetch total balance from the TotalBalance collection
    const totalBalanceRecord = await TotalBalance.findOne({ labelId });
    const totalBalance = totalBalanceRecord
    ? totalBalanceRecord.totalBalance
    : 0;
    
    //! calculate total pay in

    // Calculate total payout balance from PaymentRequest collection where status is 'COMPLETED'
    const totalPayout = await PaymentRequest.aggregate([
      { $match: { labelId, status: PaymentStatus.APPROVED } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalPayoutBalance =
      totalPayout.length > 0 ? totalPayout[0].total : 0;

    return NextResponse.json({
      message: "Data fetched successfully",
      success: true,
      status: 200,
      data: {
        LabelName,
        payments,
        totalBalance,
        totalPayoutBalance,
      },
    });
  } catch {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
