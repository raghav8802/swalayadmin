import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import PaymentRequest, { PaymentStatus } from "@/models/paymentRequest";
import Payment from "@/models/Payments";
import TotalBalance from "@/models/totalBalance";
import { NextRequest, NextResponse } from "next/server";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached payments query
const getCachedPayments = createCachedQuery(
  async (labelId: string) => {
    await connect();
    
    // Parallel queries
    const [label, payments, totalBalanceRecord, totalPayout] = await Promise.all([
      Label.findById(labelId).select("lable username").lean(),
      Payment.find({ labelId }).sort({ time: 1 }).lean(),
      TotalBalance.findOne({ labelId }).lean(),
      PaymentRequest.aggregate([
        { $match: { labelId, status: PaymentStatus.APPROVED } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
    ]);

    const labelName = label
      ? ((label as any).lable && (label as any).lable.trim() !== "" ? (label as any).lable : (label as any).username)
      : "Unknown Label";

    const totalBalance = (totalBalanceRecord as any)?.totalBalance || 0;
    const totalPayoutBalance = totalPayout.length > 0 ? totalPayout[0].total : 0;

    return {
      payments,
      labelName,
      totalBalance,
      totalPayoutBalance,
      currentBalance: totalBalance - totalPayoutBalance
    };
  },
  'payments-by-label',
  180 // 3 minutes cache
);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    const data = await getCachedPayments(labelId);
    return createCachedResponse(data, "Payments fetched successfully", 180);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
