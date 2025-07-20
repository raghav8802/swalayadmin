import Marketing from "@/models/Marketing";
import Album from "@/models/albums";
import Artist, {Iartist} from "@/models/Artists";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Track from "@/models/track";
import Label from "@/models/Label";

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Define the type for artistMap
interface ArtistMap {
  [key: string]: string; // Maps artist ID to artist name
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

    // Fetch marketing details by albumId
    const marketing = await Marketing.findOne({ albumId });
    if (!marketing) {
      return NextResponse.json({
        message: "Marketing details not found",
        success: false,
        status: 404,
      });
    }

  

    // Fetch album details by albumId
    const album = await Album.findById(albumId);

    if (!album) {
      return NextResponse.json({
        message: "Album details not found",
        success: false,
        status: 404,
      });
    }


    const labelData = await Label.findById(album.labelId).select('_id username usertype lable');

    
    let labelName = '';
    
    if (labelData?.usertype === 'normal') {
      labelName = labelData.username;
    } else if (labelData?.usertype === 'super') {
      labelName = labelData?.lable || labelData?.username || ''; // Get label name or fallback to username if lable is null
    }

    const labelType = labelData?.usertype || ''; // Fallback to empty string if usertype is null
    



    // Fetch all tracks related to the albumId
    const tracks = await Track.find({ albumId });

    // if (!tracks || tracks.length === 0) {
    //   return NextResponse.json({
    //     message: "No tracks found for this album",
    //     success: false,
    //     status: 404,
    //   });
    // }

    // Function to fetch artist details by their IDs
    const fetchArtistDetails = async (artistIds: string[]) => {
      return await Artist.find({ _id: { $in: artistIds } });
    };

    // Collect all unique artist IDs from the tracks
    const artistIdsSet = new Set<string>();

    tracks.forEach(track => {
      track.singers?.forEach((artistId:any) => artistIdsSet.add(artistId));
      track.composers?.forEach((artistId:any) => artistIdsSet.add(artistId));
      track.lyricists?.forEach((artistId:any) => artistIdsSet.add(artistId));
      track.producers?.forEach((artistId:any) => artistIdsSet.add(artistId));
    });

    const artistIds = Array.from(artistIdsSet);

    // Fetch all artist details based on the unique artist IDs
    const artistDetails = await fetchArtistDetails(artistIds);
    
    // Create a mapping of artist IDs to their names for easy lookup
    const artistMap: ArtistMap = {};
    
    artistDetails.forEach((artist: Iartist) => {
        artistMap[artist._id.toString()] = artist.artistName; // Now _id is recognized as Iartist type
      });

    // Format the response data for tracks
    const formattedTracks = tracks.map(track => ({
      number: track.trackOrderNumber, // Assuming 'trackOrderNumber' exists in your Track model
      title: track.songName, // Assuming 'songName' exists in your Track model
      duration: track.duration, // Assuming 'duration' exists in your Track model
      singer: track.singers?.map((id:any) => artistMap[id]) || [],
      producer: track.producers?.map((id:any) => artistMap[id]) || [],
      lyricist: track.lyricists?.map((id:any) => artistMap[id]) || [],
      composer: track.composers?.map((id:any) => artistMap[id]) || [],
      isrc: track.isrc, // Assuming 'isrc' exists in your Track model
      audioFile: track.audioFile, // Assuming 'isrc' exists in your Track model
    }));

    // Construct a response with marketing and album details along with formatted tracks
    const responseData = {
      marketing,
      title: marketing.albumName, // Use 'albumName' from Marketing schema
      artist: marketing.aboutArtist, // Use 'aboutArtist' from Marketing schema
      releaseYear: album.releasedate ? new Date(album.releasedate).getFullYear() : null, // Extract year from release date
      genre: album.genre || "Unknown", // Use genre from Album schema or default to "Unknown"
      coverUrl: album.thumbnail || "", // Use thumbnail as cover URL or default to empty string
      albumDetails: album, // Populate this if needed with relevant data or leave empty as per your requirement
      tracks: formattedTracks,
      labelName, labelType
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