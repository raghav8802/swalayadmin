import { NextRequest, NextResponse } from "next/server";
import Album from "@/models/albums";
import { connect } from "@/dbConfig/dbConfig";
import { ShemarooStatus } from "@/models/albums"; // Import the ShemarooStatus enum

export async function POST(req: NextRequest) {
  await connect();

  const { albumId, status } = await req.json();

  console.log("Received request to update Shemaroo status -----------------------");

  console.log("Received albumId:", albumId);
  console.log("Received status:", status);

  if (!albumId || status === undefined) {
    return NextResponse.json({
      message: "Album ID and status are required",
      success: false,
      status: 400,
    });
  }

  // Validate the status value
  if (!Object.values(ShemarooStatus).includes(Number(status))) {
    return NextResponse.json({
      message: "Invalid Shemaroo status value",
      success: false,
      status: 400,
    });
  }

  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { shemaroDeliveryStatus: Number(status) },
      { new: true } // Return the updated document
    );

    if (!updatedAlbum) {
      return NextResponse.json({
        message: "Album not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Shemaroo status updated successfully",
      success: true,
      status: 200,
      data: updatedAlbum,
    });
    
  } catch (error) {
    console.error("Error updating Shemaroo status:", error);

    return NextResponse.json({
      message: "Failed to update Shemaroo status",
      success: false,
      status: 500,
    });
  }
}

