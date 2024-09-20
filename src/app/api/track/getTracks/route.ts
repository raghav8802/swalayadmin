// ! Fetch all tracks by albumid

import { NextRequest, NextResponse } from "next/server";
import Track from "@/models/track"; // Adjust the path as necessary
import Artist from "@/models/Artists"; // Adjust the path as necessary
import { connect } from "@/dbConfig/dbConfig"; // A utility to connect to MongoDB
import mongoose from "mongoose";

// Define the type for artistNameMap
interface ArtistNameMap {
  [key: string]: string;
}



export async function GET(req: NextRequest, res: NextResponse) {
  await connect();

  const albumId = req.nextUrl.searchParams.get("albumId");

  if (!albumId || !mongoose.Types.ObjectId.isValid(albumId)) {
    return NextResponse.json({
      message: "Invalid albumId",
      success: false,
      status: 400,
    });
  }

  try {
    // Fetch tracks
    
    const tracks = await Track.find({ albumId: albumId }).sort({ _id: -1 }).exec();

    if (!tracks || tracks.length === 0) {
      return NextResponse.json({
        message: "No tracks found for this album",
        success: false,
        status: 400,
      });
    }

    // Collect all unique artist IDs
    const artistIds = new Set<string>();
    tracks.forEach((track) => {
      if (track.primarySinger) artistIds.add(track.primarySinger);
      if (track.singers)
        track.singers.forEach((id: string) => artistIds.add(id));
      if (track.composers)
        track.composers.forEach((id: string) => artistIds.add(id));
      if (track.lyricists)
        track.lyricists.forEach((id: string) => artistIds.add(id));
      if (track.producers)
        track.producers.forEach((id: string) => artistIds.add(id));
    });

    // Fetch artists
    const artists = await Artist.find({ '_id': { $in: Array.from(artistIds) } }).exec();

    // Create a map of artist IDs to artist names
    const artistNameMap: ArtistNameMap = artists.reduce((map, artist) => {
      const artistId = artist._id as mongoose.Types.ObjectId; // Explicitly type _id
      map[artistId.toString()] = artist.artistName;

      return map;
    }, {} as ArtistNameMap);

    // Replace artist IDs with names in tracks
    const tracksWithArtistNames = tracks.map((track) => ({
      ...track.toObject(),
      primarySinger: track.primarySinger
        ? artistNameMap[track.primarySinger]
        : null,
      singers: track.singers
        ? track.singers.map((id: string) => artistNameMap[id] || null)
        : null,
      composers: track.composers
        ? track.composers.map((id: string) => artistNameMap[id] || null)
        : null,
      lyricists: track.lyricists
        ? track.lyricists.map((id: string) => artistNameMap[id] || null)
        : null,
      producers: track.producers
        ? track.producers.map((id: string) => artistNameMap[id] || null)
        : null,
    }));

    return NextResponse.json({
      message: "Tracks are fetched",
      success: true,
      status: 200,
      data: tracksWithArtistNames,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
