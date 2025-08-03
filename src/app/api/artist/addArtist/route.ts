import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Artist from '@/models/Artists';
import { invalidateCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    await connect();  // Connect to the database

    const reqBody = await request.json();

    // Validate required fields
    if (!reqBody.artistName) {
      return NextResponse.json({
        message: "Artist name required",
        success: false,
        status: 400
      });
    }

    // Create and save the new artist
    const newArtist = new Artist(reqBody);
    const savedArtist = await newArtist.save();

    // Invalidate all artist-related caches
    invalidateCache('artists');
    invalidateCache('all-labels'); // Also invalidate labels cache since artists are related

    return NextResponse.json({
      message: "Artist added successfully",
      data: savedArtist,
      success: true,
      status: 201
    });

  } catch (error: any) {
    console.error('Error creating artist:', error);
    return NextResponse.json({
      error: error.message || 'An unknown error occurred',
      success: false,
      status: 500
    }, { status: 500 });
  }
}