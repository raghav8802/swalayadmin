import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbConfig/dbConfig';
import Artist from '@/models/Artists';
import Track from '@/models/track';
import Album from '@/models/albums';
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached artist details with albums
const getCachedArtistDetails = createCachedQuery(
  async (artistId: string) => {
    await connect();
    
    // Get artist data
    const artistData = await Artist.findOne({ _id: artistId }).lean();
    if (!artistData) return null;

    // Get tracks where artist is involved
    const tracks = await Track.find({
      $or: [
        { primarySinger: artistId },
        { singers: artistId },
        { composers: artistId },
        { lyricists: artistId },
        { producers: artistId }
      ]
    }).select('albumId songName').lean();

    // Get unique album IDs and fetch album data
    const albumIds = Array.from(new Set(tracks.map(track => track.albumId.toString())));
    const albums = await Album.find({ _id: { $in: albumIds } }).lean();

    return { artistData, albums };
  },
  'artist-details',
  900 // 15 minutes cache
);

export async function GET(request: NextRequest) {
  try {
    const artistId = request.nextUrl.searchParams.get("artistId");

    if (!artistId) {
      return NextResponse.json({ 
        status: 400, 
        message: "Artist ID is missing", 
        success: false 
      });
    }

    const result = await getCachedArtistDetails(artistId);
    if (!result) {
      return NextResponse.json({ 
        status: 404, 
        message: "Artist not found", 
        success: false 
      });
    }

    return createCachedResponse(result, "Artist details fetched successfully", 900);
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
}