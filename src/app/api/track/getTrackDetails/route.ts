import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Track from "@/models/track";
import Artist from "@/models/Artists"; // Import Artist model
import { connect } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
  await connect();

  const trackId = req.nextUrl.searchParams.get("trackId");

  if (!trackId || !mongoose.Types.ObjectId.isValid(trackId)) {
    return NextResponse.json({
      message: "Invalid trackId",
      success: false,
      status: 400,
    });
  }

  try {
    // Fetch the track by ID
    const track = await Track.findById(trackId);

    if (!track) {
      return NextResponse.json({
        message: "Track not found",
        success: false,
        status: 404,
      });
    }

    // Fetch artist details for each role and include both ID and name
    const fetchArtists = async (ids: string[] | null) => {
      if (!ids || ids.length === 0) return null;
      return await Artist.find({ _id: { $in: ids } }).select("_id artistName");
    };

    // Fetch details for all roles
    const primarySingerDetails = track.primarySinger
      ? await Artist.findById(track.primarySinger).select("_id artistName")
      : null;
    const singersDetails = await fetchArtists(track.singers);
    const composersDetails = await fetchArtists(track.composers);
    const lyricistsDetails = await fetchArtists(track.lyricists);
    const producersDetails = await fetchArtists(track.producers);

    // Modify the track data to include both ID and name for each role
    const trackDetails = {
      ...track.toObject(),
      primarySinger: primarySingerDetails,
      singers: singersDetails,
      composers: composersDetails,
      lyricists: lyricistsDetails,
      producers: producersDetails,
    };

    return NextResponse.json({
      message: "Track details are fetched",
      success: true,
      status: 200,
      data: trackDetails,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
