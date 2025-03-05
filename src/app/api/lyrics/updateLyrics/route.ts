import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import mongoose from 'mongoose';
import Lyrics from '@/models/Lyrics';

export async function POST(req: NextRequest) {
  try {
    await connect(); // Connect to the database

    const body = await req.json();

    const { trackId, lyrics } = body;

    
    // Validate required fields
    if (!trackId || !lyrics) {
      return NextResponse.json({
        message: "trackId and lyrics are required",
        success: false,
        status: 400,
      });
    }
    
    // Check if the lyrics already exist
    const isLyricExists = await Lyrics.findOne({ trackId });

    const lyricsString = JSON.stringify(lyrics)
    console.log("api req");
    console.log(trackId, lyricsString);

    if (isLyricExists) {
      // Update existing lyrics
      const responseUpdatedLyrics = await Lyrics.findByIdAndUpdate(
        isLyricExists._id,
        { lyrics },
        { new: true }
      );

      return NextResponse.json({
        message: "Lyrics updated successfully",
        success: true,
        status: 200,
        data: responseUpdatedLyrics,
      });
    } else {
      // Add new lyrics
      const responseNewLyrics = new Lyrics({ trackId, lyrics });
      await responseNewLyrics.save();

      return NextResponse.json({
        message: "Lyrics added successfully",
        success: true,
        status: 201,
        data: responseNewLyrics,
      });
    }
  } catch (error: any) {
    console.error('Error handling lyrics:', error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
