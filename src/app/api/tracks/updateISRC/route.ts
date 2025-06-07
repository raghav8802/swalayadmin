import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";

export async function POST(request: NextRequest) {
  try {
    const { id, isrc } = await request.json();

    if (!id || !isrc) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connect();

    const result = await Track.findByIdAndUpdate(
      id,
      { $set: { isrc } },
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
      message: "ISRC updated successfully",
    });
  } catch (error) {
    console.error("Error updating ISRC:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 