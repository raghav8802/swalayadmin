import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";
import Track from "@/models/track";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached search query
const getCachedSearchResults = createCachedQuery(
  async (query: string) => {
    await connect();
    const searchTerm = new RegExp(query, "i");

    // Parallel search queries
    const [albums, tracks] = await Promise.all([
      Album.find({ title: searchTerm })
        .select("_id title")
        .lean(),
      Track.find({ songName: searchTerm })
        .populate({
          path: "albumId",
          model: "Album",
          select: "_id title",
        })
        .select("_id songName albumId")
        .lean()
    ]);

    // Format results
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

    return results;
  },
  'search-results',
  120 // 2 minutes cache for search results
);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    
    if (!query) {
      return NextResponse.json({
        message: "Search query is required",
        success: false,
        status: 400,
      });
    }

    const results = await getCachedSearchResults(query);
    return createCachedResponse(results, "Search completed successfully", 120);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
