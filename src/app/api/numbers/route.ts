import { NextRequest, NextResponse } from 'next/server';
import Album, { AlbumStatus } from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
// import TotalBalance from '@/models/totalBalance';
import Artist from '@/models/Artists';
import Label from '@/models/Label';



export async function GET(request: NextRequest) {
  try {
    await connect();


    // Get all album IDs under the specific labelId without status draft
    const albums = await Album.find({ status: { $ne: AlbumStatus.Draft } });

    // Count the total albums
    const totalAlbums = albums.length;

    // Count the unique artists under the labelId
    const totalArtists = await Artist.countDocuments();

    // Fetch the total lables with isvarified true
    const totalLabels = await Label.find({isVerified: true}).countDocuments()
    

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
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
      status: 500,
    });
  }
}
