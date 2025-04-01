import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label"; // Import the Label model
import Payment from "@/models/Payments";
import {  NextResponse } from "next/server";

export async function GET() {
  // Establish a connection to the database
  await connect();

  try {
    // Fetch all payments from the database
    const payments = await Payment.find().exec();

    // Transform the payments data to include only necessary label information
    const transformedPayments = await Promise.all(
      payments.map(async (payment) => {
        const label = await Label.findById(payment.labelId)
          .select("usertype username lable")
          .exec();

        if (!label) {
          return payment;
        }

        let labelName = label.username; // Default to username

        if (label.usertype === "super") {
          labelName = label.lable || label.username; // Use label name or fallback to username
        }

        return {
          _id: payment._id,
          labelId: payment.labelId,
          amount: payment.amount,
          status: payment.status,
          time: payment.time,
          type: payment.type,
          payout_report_url: payment.payout_report_url,
          usertype: label.usertype,
          labelName: labelName,
        };
      })
    );

    // Respond with the transformed payments data
    return NextResponse.json({
      message: "Payments fetched successfully",
      data: transformedPayments,
      success: true,
      status: 200,
    });
  } catch  {
    // Handle any errors that occur during processing
    return NextResponse.json({
      message: "An error occurred while fetching the payments",
      error: "error ",
      success: false,
      status: 500,
    });
  }
}
