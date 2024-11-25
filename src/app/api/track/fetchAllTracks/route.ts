import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Track from "@/models/track";
import Artist from "@/models/Artists"; // Import Artist model
import { connect } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
  await connect();

  try {
    // Fetch all tracks sorted by ID in descending order
    const tracks = await Track.find().select("_id songName isrc version").sort({ _id: -1 });
    // const tracks = await Track.find().select("_id songName isrc version").sort({ isrc: 1 });
    // const tracks = await Track.find().select("_id songName isrc version");


    if (!tracks || tracks.length === 0) {
      return NextResponse.json({
        message: "Tracks not found",
        success: false,
        status: 404,
      });
    }

    // Helper function to fetch artist details for an array of IDs
    // const fetchArtists = async (ids: string[] | null) => {
    //   if (!ids || ids.length === 0) return [];
    //   return await Artist.find({ _id: { $in: ids } }).select("_id artistName");
    // };

    // // Process each track to include artist details
    // const trackDetails = await Promise.all(
    //   tracks.map(async (track) => {
    //     const primarySingerDetails = track.primarySinger
    //       ? await Artist.findById(track.primarySinger).select("_id artistName")
    //       : null;
    //     const singersDetails = await fetchArtists(track.singers);
    //     const composersDetails = await fetchArtists(track.composers);
    //     const lyricistsDetails = await fetchArtists(track.lyricists);
    //     const producersDetails = await fetchArtists(track.producers);

    //     return {
    //       ...track.toObject(),
    //       primarySinger: primarySingerDetails,
    //       singers: singersDetails,
    //       composers: composersDetails,
    //       lyricists: lyricistsDetails,
    //       producers: producersDetails,
    //     };
    //   })
    // );

    return NextResponse.json({
      message: "Track details are fetched",
      success: true,
      status: 200,
    //   data: trackDetails,
      data: tracks,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
