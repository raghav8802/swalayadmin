import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Lyrics from "@/models/Lyrics";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached lyrics query
const getCachedLyrics = createCachedQuery(
  async (trackId: string) => {
    await connect();
    return await Lyrics.findOne({ trackId }).lean();
  },
  'lyrics-by-track',
  900 // 15 minutes cache for lyrics
);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const trackid = url.searchParams.get("trackid");

    if (!trackid) {
      return NextResponse.json({
        message: "Trackid is required",
        success: false,
        status: 400,
      });
    }

    const lyrics = await getCachedLyrics(trackid);

    if (!lyrics) {
      return NextResponse.json({
        message: "Lyrics not found",
        success: false,
        status: 404,
      });
    }

    return createCachedResponse(lyrics, "Lyrics fetched successfully", 900);
  } catch (error) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
