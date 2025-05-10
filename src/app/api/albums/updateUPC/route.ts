import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";

export async function POST(request: Request) {
  try {
    const { id, upc } = await request.json();

    if (!id || !upc) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connect();

    const result = await Album.findByIdAndUpdate(
      id,
      { $set: { upc } },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Album not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "UPC updated successfully",
    });
  } catch (error) {
    console.error("Error updating UPC:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 