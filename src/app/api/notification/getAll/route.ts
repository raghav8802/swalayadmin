import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Notification from "@/models/notification";

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Fetch all notifications from the database
    const notifications = await Notification.find();

    return NextResponse.json({
      message: "Notifications fetched successfully",
      success: true,
      status: 200,
      data: notifications,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
