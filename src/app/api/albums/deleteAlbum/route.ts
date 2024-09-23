import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";

export async function POST(request: NextRequest) {
  try {
    await connect(); // Connect to the database

    // const { searchParams } = new URL(req.url);
    const body = await request.json();
    const id = body.albumId
    console.log(id);
    

    if (!id) {
      return NextResponse.json({
        message: "Invalid Albums",
        success: false,
        status: 400,
      });
    }

    // Find and delete the album by ID
    const deletedAlbum = await Album.findByIdAndDelete(id);

    if (!deletedAlbum) {
      return NextResponse.json({
        message: "Albums is found",
        success: true,
        status: 404,
      });
    }
    return NextResponse.json({
      message: "Albums is deleted",
      success: true,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error deleting album:", error);
    return NextResponse.json({
      message: "internal server error",
      success: false,
      status: 500,
    });
  }
}
