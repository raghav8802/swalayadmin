import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Artist from '@/models/Artists';

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { _id, ...updateData } = reqBody;

    // Validate required fields
    if (!updateData.artistName) {
      return NextResponse.json({
        message: "Artist name is required",
        success: false,
        status: 400
      });
    }

    // Update the artist
    const updatedArtist = await Artist.findByIdAndUpdate(
      _id,
      updateData,
      { new: true } // Return the updated document
    );

    if (!updatedArtist) {
      return NextResponse.json({
        message: "Artist not found",
        success: false,
        status: 404
      });
    }

    return NextResponse.json({
      message: "Artist updated successfully",
      data: updatedArtist,
      success: true,
      status: 200
    });

  } catch (error: any) {
    console.error('Error updating artist:', error);
    return NextResponse.json({
      error: error.message || 'An unknown error occurred',
      success: false,
      status: 500
    }, { status: 500 });
  }
} 