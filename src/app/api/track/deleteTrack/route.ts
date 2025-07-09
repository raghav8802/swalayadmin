import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";
import Album from "@/models/albums";

export async function POST(request: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await request.json();
    const id = body.trackId;


    if (!id) {
      return NextResponse.json({
        message: "Invalid trackId",
        success: false,
        status: 400,
      });
    }

    // Find and delete the Track by ID
    const deletedAlbum = await Track.findByIdAndDelete(id);

    // Get the albumId from the deleted track
    const albumId = deletedAlbum?.albumId;

    if (albumId) {
      const trackCount = await Track.countDocuments({ albumId });
      await Album.findByIdAndUpdate(albumId, { totalTracks: trackCount });
    }

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
  } catch {
    console.error("Error deleting track:");
    return NextResponse.json({
      message: "internal server error",
      success: false,
      status: 500,
    });
  }
}
