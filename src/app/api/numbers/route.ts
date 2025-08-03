import { NextResponse } from 'next/server';
import Album, { AlbumStatus } from '@/models/albums';
import Artist from '@/models/Artists';
import Label from '@/models/Label';
import { connect } from '@/dbConfig/dbConfig';
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached stats query
const getCachedStats = createCachedQuery(
  async () => {
    await connect();
    
    // Use Promise.all for parallel queries
    const [albums, totalArtists, totalLabels, upcomingReleases] = await Promise.all([
      Album.find({ status: { $ne: AlbumStatus.Draft } }).lean(),
      Artist.countDocuments(),
      Label.countDocuments(),
      Album.countDocuments({ status: AlbumStatus.Processing })
    ]);

    return {
      totalAlbums: albums.length,
      totalArtist: totalArtists,
      totalLabels,
      upcomingReleases,
    };
  },
  'dashboard-stats',
  180 // 3 minutes cache for frequently updated stats
);

export async function GET() {
  try {
    const data = await getCachedStats();
    return createCachedResponse(data, "Numbers fetched successfully", 180);
  } catch (error) {
    console.error('Error in numbers API:', error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
      status: 500,
    });
  }
}
