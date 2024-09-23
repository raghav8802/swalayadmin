import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";


export async function POST(request: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await request.json();
    const id = body.trackId
    console.log(id);
    

    if (!id) {
      return NextResponse.json({
        message: "Invalid trackId",
        success: false,
        status: 400,
      });
    }

    // Find and delete the Track by ID
    const deletedAlbum = await Track.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return NextResponse.json({
        message: "Track is found",
        success: true,
        status: 404,
      });
    }
    return NextResponse.json({
      message: "Track is deleted",
      success: true,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error deleting track:", error);
    return NextResponse.json({
      message: "internal server error",
      success: false,
      status: 500,
    });
  }
}
