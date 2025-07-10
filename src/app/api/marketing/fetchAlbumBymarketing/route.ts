import {  NextResponse } from 'next/server';
import Album from '@/models/albums';
import Marketing from '@/models/Marketing';
import { connect } from '@/dbConfig/dbConfig';

export async function GET() {
  await connect();

  try {
    // Fetch all marketing entries
    const marketingEntries = await Marketing.find().sort({ _id: -1 });

    if (!marketingEntries || marketingEntries.length === 0) {
      return NextResponse.json({
        message: "No marketing entries found",
        success: true,
        status: 404,
      });
    }

    // Iterate through each marketing entry and fetch the corresponding album details
    const marketingWithAlbumDetails = await Promise.all(
      marketingEntries.map(async (marketing) => {
        // Fetch album details based on the albumId in the marketing entry
        const album = await Album.findById(marketing.albumId);

        // Default marketing status
        let marketingStatus = "Pitched";
        if (marketing.isExtraFileRequested) {
          marketingStatus = "Requested";
        }
        if (marketing.isSelectedForPromotion) {
          marketingStatus = "Selected";
        }

        if (album) {
          return {
            marketingId: marketing._id, // Include the marketing ID
            artist: album.artist,
            cline: album.cline,
            comment: album.comment,
            date: album.date,
            genre: album.genre,
            labelId: album.labelId,
            language: album.language,
            marketingStatus, // Add the marketing status
            pline: album.pline,
            releasedate: album.releasedate,
            status: album.status,
            tags: album.tags,
            thumbnail: album.thumbnail,
            title: album.title,
            totalTracks: album.totalTracks,
            upc: album.upc,
            __v: album.__v,
            _id: album._id,
            
          };
        }

        // If no album is found, return a placeholder response
        return {
          marketingId: marketing._id, // Include the marketing ID even if no album is found
          marketingStatus, // Add the marketing status
          message: `No album found for albumId: ${marketing.albumId}`,
        };
      })
    );

    return NextResponse.json({
      message: "Marketing details with album information are found",
      success: true,
      status: 200,
      data: marketingWithAlbumDetails,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({
      message: "Internal server down",
      success: false,
      status: 500,
    });
  }
}
