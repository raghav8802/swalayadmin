import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Marketing from "@/models/Marketing";
import Notification from "@/models/notification";
import { invalidateCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();

    const { marketingId, message } = reqBody;
    const result = await Marketing.findByIdAndUpdate(
      marketingId,
      { comment: message, isExtraFileRequested: true },
      { new: true }
    );

    const newNotification = new Notification({
      labels: reqBody.labelId, //id
      category: "Updates",
      message: `Extra file requested for marketing: ${reqBody.albumName}`,
    });
    await newNotification.save();

    // Invalidate marketing-related caches
    invalidateCache('marketing');

    if (result) {
      return NextResponse.json({
        message: "Extra file requested",
        success: true,
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: "Invalid markeitng id",
        success: false,
        status: 400,
      });
    }
  } catch (error: any) {
    console.log("error :: ");
    console.log(error);

    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
}
