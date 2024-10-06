import { connect } from "@/dbConfig/dbConfig";
import ApiResponse from "@/lib/apiResponse";
import Payment from "@/models/Payments";
import TotalBalance from "@/models/totalBalance";
import { NextRequest, NextResponse } from "next/server";
import { uploadPayoutReportToS3 } from "@/dbConfig/uploadFileToS3";

export async function POST(request: NextRequest) {
  // Establish a connection to the database
  await connect();

  try {
    // Parse the incoming form data from the request
    const formData = await request.formData();

    // Create an object to store the parsed form data
    const data = {} as { [key: string]: any };

    // Populate the `data` object with key-value pairs from the form data
    formData.forEach((value, key) => {
      data[key] = value;
      console.log(`${key}: ${value}`);
    });

    // Log all the form data for debugging
    console.log('All form data:', data);
    console.log(data.formDataObj);

    // Extract relevant fields from the form data
    const labelId = formData.get("labelId")?.toString();
    const amount = formData.get("amount")?.toString();
    const time = formData.get("time")?.toString();
    const type = formData.get("type")?.toString() || "Royalty";

    console.log(labelId, amount, time, type);

    // Extract the PDF file from the form data, if it exists
    const payoutReportFile = formData.get("payout_report_url") as File | null;
    console.log(payoutReportFile);

    // Validation for required fields
    if (!labelId || !amount || !time) {
      return NextResponse.json({
        message: "Please provide all required fields",
        success: false,
        status: 400,
      });
    }

    // Validation for the amount field
    const numericAmount = parseFloat(amount!);
    if (isNaN(numericAmount)) {
      return NextResponse.json({
        message: "Invalid amount provided",
        success: false,
        status: 400,
      });
    }

    // Initialize payout report URL variable
    let payout_report_url: string | undefined;

    // If a file is provided, handle the file upload
    if (payoutReportFile) {
      console.log("File present");

      // Ensure the uploaded file is a PDF
      const fileExtension = payoutReportFile.name
        .split(".")
        .pop()
        ?.toLowerCase();
      if (fileExtension !== "pdf") {
        return ApiResponse(400, null, false, "Only PDF files are allowed")
          .nextResponse;
      }

      // Convert the file to a buffer for upload
      const buffer = Buffer.from(await payoutReportFile.arrayBuffer());

      // Generate a unique file name and upload the file to S3
      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${date.getFullYear()}`;
      const fileName = `earningreport-${labelId}-${formattedDate}-${Date.now()}.${fileExtension}`;
      const uploadResult = await uploadPayoutReportToS3({
        file: buffer,
        fileName: fileName,
      });

      // Handle any errors that occur during file upload
      if (!uploadResult.status) {
        return ApiResponse(500, null, false, "Failed to upload payout report")
          .nextResponse;
      }

      // Store the file URL
      payout_report_url = uploadResult.fileName;
    }

    // Create a new payment record in the database
    const newPayment = new Payment({
      labelId,
      amount: numericAmount.toFixed(2),
      time: new Date(time!),
      type,
      payout_report_url,
    });

    // Save the payment to the database
    const savedPayment = await newPayment.save();

    // Update the total balance or create a new entry
    const existingBalance = await TotalBalance.findOne({ labelId });
    if (existingBalance) {
      // Update the existing total balance
      existingBalance.totalBalance += numericAmount;
      await existingBalance.save();
    } else {
      // Create a new total balance record
      const newTotalBalance = new TotalBalance({
        labelId,
        totalBalance: numericAmount,
      });
      await newTotalBalance.save();
    }

    // Respond with the saved payment data
    return NextResponse.json({
      message: "Payment created successfully",
      payment: savedPayment,
      success: true,
      status: 200,
    });

  } catch (error: any) {
    // Handle any errors that occur during processing
    return ApiResponse(
      500,
      error.message,
      false,
      "An error occurred while creating the payment"
    ).nextResponse;
  }
}
