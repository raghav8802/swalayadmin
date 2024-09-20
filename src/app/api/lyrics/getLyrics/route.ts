import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Lyrics from "@/models/Lyrics";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const url = new URL(req.url);
    const trackid = url.searchParams.get("trackid"); // Get the 'trackid' query parameter

    if (!trackid) {
      return NextResponse.json({
        message: "Trackid is required",
        success: false,
        status: 500,
      });
    }

    const lyrics = await Lyrics.findOne({ trackId: trackid });

    if (!lyrics) {
      return NextResponse.json({
        message: "Lyrics not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "success! lyrics fetched",
      success: true,
      status: 200,
      data: lyrics
    });

  } catch (error) {

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
  
}
