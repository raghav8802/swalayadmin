import {  NextResponse } from 'next/server';
import Album, { AlbumStatus } from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
// import TotalBalance from '@/models/totalBalance';
import Artist from '@/models/Artists';
import Label from '@/models/Label';

export async function GET() {
  try {
    await connect();

    // Get all album IDs under the specific labelId without status draft
    const albums = await Album.find({ status: { $ne: AlbumStatus.Draft } });

    // Count the total albums
    const totalAlbums = albums.length;

    // Count the unique artists under the labelId
    const totalArtists = await Artist.countDocuments();

    // Fetch the total labels
    const totalLabels = await Label.countDocuments();
    
    
    // Count the albums with status 'Processing'
    const upcomingReleases = await Album.countDocuments({ status: AlbumStatus.Processing });

    const data = {
      totalAlbums,
      totalArtist: totalArtists,
      totalLabels,
      upcomingReleases,
    };


    return NextResponse.json({
      message: "Numbers are fetched",
      success: true,
      status: 200,
      data: data,
    });

  } catch (error) {
    console.error('Error in numbers API:', error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
      status: 500,
    });
  }
}
