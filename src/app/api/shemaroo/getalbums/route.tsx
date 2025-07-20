import { NextRequest, NextResponse } from "next/server";

import Album from "@/models/albums";
import { connect } from "@/dbConfig/dbConfig";
// import { response } from '@/lib/response'; // Import the response function

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  await connect();

  try {
    const status = req.nextUrl.searchParams.get("status");

    // Approved = 1, // Shemaroo approved - send album to Shemaroo
    // Live = 2, // Shemaroo live - album is live on Shemaroo
    // Rejected = 3, // Shemaroo rejected - album is not live on Shemaroo

    if (status === null || status === undefined) {
      return NextResponse.json({
        message: "Status parameter is required",
        success: false,
        status: 400,
      });
    }

    // Convert to number and validate enum values
    const statusNumber = Number(status);
    if (isNaN(statusNumber)) {
      return NextResponse.json({
        message: "Status must be a number",
        success: false,
        status: 400,
      });
    }

    // Check if status is a valid ShemarooStatus value
    if (![1, 2, 3].includes(statusNumber)) {
      return NextResponse.json({
        message:
          "Invalid status parameter. Valid values are: 1 (Approved), 2 (Live), 3 (Rejected)",
        success: false,
        status: 400,
      });
    }

    // Query albums with the specified status
    const albums = await Album.find({ shemaroDeliveryStatus: statusNumber });

    if (!albums) {
      return NextResponse.json({
        message: "Albums are found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Albums are found admin",
      success: true,
      status: 200,
      data: albums,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);

    return NextResponse.json({
      message: "Internal server down",
      success: false,
      status: 500,
    });
  }
}
