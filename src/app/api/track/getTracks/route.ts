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



export async function GET(req: NextRequest) {
  await connect();

  const albumId = req.nextUrl.searchParams.get("albumId");

  // console.log("albumId :->", albumId);

  if (!albumId || !mongoose.Types.ObjectId.isValid(albumId)) {
    return NextResponse.json({
      message: "Invalid albumId 1",
      success: false,
      status: 400,
    });
  }

  try {
    // Fetch tracks
    
    const tracks = await Track.find({ albumId: albumId }).sort({ _id: -1 }).exec();

    // console.log("tracks :->", tracks);

    if (!tracks || tracks.length === 0) {
      return NextResponse.json({
        message: "No tracks found for this album 2",
        success: false,
        status: 400,
      });
    }

    // Collect all unique artist IDs
    const artistIds = new Set<string>();
    tracks.forEach((track) => {
      // Remove primarySinger from artistIds since it's a direct name, not an ID
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
      const artistId = artist._id as unknown as mongoose.Types.ObjectId;
      map[artistId.toString()] = artist.artistName;
      return map;
    }, {} as ArtistNameMap);

    // Replace artist IDs with names in tracks
    const tracksWithArtistNames = tracks.map((track) => ({
      ...track.toObject(),
      // Keep primarySinger as is since it's already a name
      primarySinger: track.primarySinger,
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
  } catch (error: unknown) {

    console.log("error :->", error);
    
    return NextResponse.json({
      message: "Internal server error 4",
      success: false,
      status: 500,
    });

  }
}