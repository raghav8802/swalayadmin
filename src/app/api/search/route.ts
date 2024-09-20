import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";
import Track from "@/models/track";

// Connect to the database
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");


  try {
    await connect();
    const searchTerm = new RegExp(query as string, "i"); // Case-insensitive search

    // Search for albums by title and labelId
    const albums = await Album.find({
      title: searchTerm
    })
      .select("_id title") // Select _id and title
      .lean(); // Lean for better performance

    // Get album IDs for filtering tracks
    const albumIds = albums.map((album) => album._id);

    // Search for tracks by songName and filter by albumId (matching the labelId)
    const tracks = await Track.find({
      songName: searchTerm,
      albumId: { $in: albumIds }, // Only include tracks under albums with the specified labelId
    })
      .populate({
        path: "albumId", // Populate the albumId field
        model: "Album", // Reference the correct model name
        select: "_id title", // Select _id and title from Album
      })
      .select("_id songName albumId") // Select _id, songName, and albumId
      .lean();

    // Combine and format the search results
    const results = [
      ...albums.map((album) => ({
        type: "album",
        albumId: album._id,
        albumName: album.title,
        trackId: null,
        trackName: null,
      })),
      ...tracks.map((track) => ({
        type: "track",
        albumId: track.albumId._id,
        albumName: track.albumId.title,
        trackId: track._id,
        trackName: track.songName,
      })),
    ];

    return NextResponse.json({
      message: "Success",
      success: true,
      status: 200,
      data: results,
    });
  } catch (error) {
    console.error("------------------------");
    console.error("Error in search API:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
