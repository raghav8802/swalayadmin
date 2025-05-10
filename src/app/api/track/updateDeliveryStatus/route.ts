import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";

export async function POST(request: NextRequest) {
  try {
    const { trackId, status } = await request.json();

    if (!trackId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!['pending', 'delivered', 'failed', null].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    await connect();

    const result = await Track.findByIdAndUpdate(
      trackId,
      { $set: { deliveryStatus: status } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Track not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Delivery status updated successfully",
    });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 