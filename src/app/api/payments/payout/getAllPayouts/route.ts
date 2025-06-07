import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import PaymentRequest, { PaymentStatus } from "@/models/paymentRequest";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    // const status = searchParams.get("status");
    const status = searchParams.get("status")?.toUpperCase();

    let payments;

    if (status === "ALL") {
      // Fetch all payment requests if status is "All"
      payments = await PaymentRequest.find({}).sort({ request_at: 1 });
    } else if (
      status &&
      Object.values(PaymentStatus).includes(status as PaymentStatus)
    ) 
    
    {
      // Fetch payment requests with the specified status
      payments = await PaymentRequest.find({ status}).sort({ request_at: 1 });
      
        
      } else {
        // Default to fetching only pending payments
        payments = await PaymentRequest.find({
          status: PaymentStatus.PENDING,
        }).sort({ request_at: 1 });

    }

    // Fetch the corresponding labels
    const paymentsWithLabelName = await Promise.all(
      payments.map(async (payment) => {
        const label = await Label.findById(payment.labelId);
        const labelName = label?.lable || label?.username || ""; // Get label name or fallback to username if lable is null

        return {
          ...payment.toObject(),
          labelName, // Add the labelName to the response object
        };
      })
    );

    return NextResponse.json({
      message: "Payouts fetched successfully",
      success: true,
      status: 200,
      data: paymentsWithLabelName,
    });
  } catch  {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
