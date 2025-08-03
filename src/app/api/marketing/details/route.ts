import Marketing from "@/models/Marketing";
import Album, { IAlbum } from "@/models/albums";
import Artist from "@/models/Artists";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Track from "@/models/track";
import Label, { iLabel } from "@/models/Label";


// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define the type for artistMap
interface ArtistMap {
  [key: string]: string;
}

// API handler function
export async function GET(req: NextRequest) {
  try {
    await connect();

    const albumId = req.nextUrl.searchParams.get("albumId");
    
    // Validate albumId
    if (!albumId || typeof albumId !== "string") {
      return NextResponse.json({
        message: "Invalid albumId",
        success: false,
        status: 400,
      });
    }

    // Run all database queries in parallel
    const [marketing, album, tracks] = await Promise.all([
      Marketing.findOne({ albumId }).lean(), // Use lean() for better performance
      Album.findById(albumId).lean() as Promise<IAlbum | null>,
      Track.find({ albumId }).lean()
    ]);

    // Early returns for not found cases
    if (!marketing) {
      return NextResponse.json({
        message: "Marketing details not found",
        success: false,
        status: 404,
      });
    }

    if (!album) {
      return NextResponse.json({
        message: "Album details not found",
        success: false,
        status: 404,
      });
    }

    // Fetch label data and artist data in parallel
    const [labelData, artistDetails] = await Promise.all([
      Label.findById(album.labelId).select('_id username usertype lable').lean() as Promise<iLabel | null>,
      fetchAllArtistDetails(tracks)
    ]);

    // Process label information
    let labelName = '';
    let labelType = '';
    
    if (labelData) {
      labelType = labelData.usertype || '';
      if (labelData.usertype === 'normal') {
        labelName = labelData.username;
      } else if (labelData.usertype === 'super') {
        labelName = labelData.lable || labelData.username || '';
      }
    }

    // Create artist mapping
    const artistMap: ArtistMap = {};
    artistDetails.forEach((artist: any) => {
      artistMap[artist._id.toString()] = artist.artistName;
    });

    // Format tracks with optimized mapping
    const formattedTracks = tracks.map(track => ({
      number: track.trackOrderNumber,
      title: track.songName,
      duration: track.duration,
      singer: mapArtistIds(track.singers, artistMap),
      producer: mapArtistIds(track.producers, artistMap),
      lyricist: mapArtistIds(track.lyricists, artistMap),
      composer: mapArtistIds(track.composers, artistMap),
      isrc: track.isrc,
      audioFile: track.audioFile,
    }));

    // Construct optimized response
    const responseData = {
      marketing,
      title: marketing.albumName,
      artist: marketing.aboutArtist,
      releaseYear: album.releasedate ? new Date(album.releasedate).getFullYear() : null,
      genre: album.genre || "Unknown",
      coverUrl: album.thumbnail || "",
      albumDetails: album,
      tracks: formattedTracks,
      labelName,
      labelType
    };

    return NextResponse.json({
      message: "Success",
      success: true,
      status: 200,
      data: responseData,
    });

  } catch (error) {
    console.error("Error fetching marketing details:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
  
}


// Optimized function to fetch all artist details
async function fetchAllArtistDetails(tracks: any[]): Promise<any[]> {
  // Use Set for O(1) lookup and automatic deduplication
  const artistIdsSet = new Set<string>();

  // Single loop to collect all artist IDs
  tracks.forEach(track => {
    addArtistIds(track.singers, artistIdsSet);
    addArtistIds(track.composers, artistIdsSet);
    addArtistIds(track.lyricists, artistIdsSet);
    addArtistIds(track.producers, artistIdsSet);
  });

  if (artistIdsSet.size === 0) {
    return [];
  }

  // Fetch all artists in a single query with lean() for better performance
  return await Artist.find({ 
    _id: { $in: Array.from(artistIdsSet) } 
  }).select('_id artistName').lean();
}

// Helper function to add artist IDs to Set
function addArtistIds(artistIds: any[] | undefined, artistIdsSet: Set<string>): void {
  if (Array.isArray(artistIds)) {
    artistIds.forEach(id => {
      if (id) artistIdsSet.add(id);
    });
  }
}

// Helper function to map artist IDs to names
function mapArtistIds(artistIds: any[] | undefined, artistMap: ArtistMap): string[] {
  if (!Array.isArray(artistIds)) return [];
  return artistIds
    .map(id => artistMap[id])
    .filter(name => name !== undefined);
}