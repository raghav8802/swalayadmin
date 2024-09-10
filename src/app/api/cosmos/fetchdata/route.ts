import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import Artist from '@/models/Artists';
import Track from '@/models/track';
import ApiResponse from '@/lib/apiResponse';
import crypto from 'crypto';
import fetch from 'node-fetch';

// Function to generate MD5 checksum
const generateMD5Checksum = (buffer: Buffer): string => {
  return crypto.createHash('md5').update(buffer).digest('hex');
};

// Function to fetch image from URL and generate checksum and size
const fetchImageAndGenerateChecksum = async (url: string): Promise<{ checksum: string, size: number }> => {
  console.log(`Fetching image from URL: ${url}`);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch image from URL: ${url}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const size = buffer.length; // Calculate the size of the file
  const checksum = generateMD5Checksum(buffer);
  return { checksum, size };
};

// Function to upload file using a PUT request to the signed URL
const uploadFileToSignedUrl = async (signedUrl: string, fileBuffer: Buffer, contentType: string) => {
  const fileSize = fileBuffer.length;

  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileSize.toString(),
      'Accept': 'application/json, text/plain, */*',
      'Origin': 'http://localhost:9000',
      'Connection': 'keep-alive',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
    },
    body: fileBuffer,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file to ${signedUrl}. Status: ${response.status}`);
  }

  console.log(`File uploaded successfully to ${signedUrl}`);
};

// Function to fetch file from S3
const fetchFileFromS3 = async (s3Url: string): Promise<Buffer> => {
  const response = await fetch(s3Url);
  if (!response.ok) throw new Error(`Failed to fetch file from S3: ${s3Url}`);

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export async function POST(req: Request) {
  try {
    await connect();

    const { albumId }: { albumId?: string } = await req.json();

    if (!albumId) {
      return ApiResponse(400, null, false, 'Album ID is required').nextResponse;
    }

    const albumObjectId = new mongoose.Types.ObjectId(albumId);

    const album = await Album.findById(albumObjectId).select('_id title artist thumbnail language genre releasedate status totalTracks cline pline tags comment');

    if (!album) {
      return ApiResponse(404, null, false, 'Album not found').nextResponse;
    }

    let artistDetails = null;
    if (album.artist && mongoose.Types.ObjectId.isValid(album.artist)) {
      artistDetails = await Artist.findById(album.artist).select('_id artistName profileImage isSinger isLyricist isComposer isProducer');
    }

    const tracks = await Track.find({ albumId: album._id });

    const fetchArtistDetails = async (artistId: string) => {
      if (mongoose.Types.ObjectId.isValid(artistId)) {
        return await Artist.findById(artistId).select('_id labelId artistName iprs iprsNumber facebook appleMusic spotify instagram ');
      }
      return null;
    };

    const tracksWithDetails = await Promise.all(
      tracks.map(async (track) => {
        const singersDetails = await Promise.all(
          track.singers.map(fetchArtistDetails)
        );

        const composersDetails = await Promise.all(
          track.composers.map(fetchArtistDetails)
        );

        const lyricistsDetails = await Promise.all(
          track.lyricists.map(fetchArtistDetails)
        );

        const producersDetails = await Promise.all(
          track.producers.map(fetchArtistDetails)
        );

        const audioFileUrl = `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${track.albumId}ba3/tracks/${track.audioFile}`;
        console.log(`Track file URL: ${audioFileUrl}`);
        const { checksum: audioFileChecksum, size: audioFileSize } = await fetchImageAndGenerateChecksum(audioFileUrl);

        return {
          isrc: track.isrc || "",  
          data : {
            crbt_cut_name : track.songName || "",
            song_name: track.songName || "",
            album_name : album.title || "",
            language : album.language || "",
            album_type : "Album",  
            content_type : "Single",
            genre: album.genre || "",
            sub_genre : track.category || "",
            mood: "",
            isrc: track.isrc || "",
            label : "SwaLay Digital",
            publisher : "TalantonCore India Publishing ",
            track_duration : "" , 
            time_for_crbt_cut: track.crbt || "",
            original_release_date_of_movie : album.releasedate || "",
            original_release_date_of_music : album.releasedate || "",
            go_live_date: album.releasedate || "",
            date_of_expiry : "",
            c_line: album.cline || "",
            p_line: album.pline || "",
            parental_advisory : "Not Explicit",
            upc_id : "" ,
          },
          lyricists: lyricistsDetails.filter(Boolean).map(lyricist => ({
            id: lyricist._id,
            name : lyricist.artistName,
            apple_id: lyricist.appleMusic,
            facebook_artist_page_url: lyricist.facebook,
            insta_artist_page_url: lyricist.instagram,
            spotify_id: lyricist.spotify,
            is_iprs_member: lyricist.iprs,
            ipi_number: lyricist.iprsNumber,
          })) || [],
          composers: composersDetails.filter(Boolean).map(composer => ({
            id: composer._id,
            name : composer.artistName,
            apple_id: composer.appleMusic,
            facebook_artist_page_url: composer.facebook,
            insta_artist_page_url: composer.instagram,
            spotify_id: composer.spotify,
            is_iprs_member: composer.iprs,
            ipi_number: composer.iprsNumber,
          })) || [],
          producers: producersDetails.filter(Boolean).map(producer => ({
            id: producer._id,
            name : producer.artistName,
            apple_id: producer.appleMusic,
            facebook_artist_page_url: producer.facebook,
            insta_artist_page_url: producer.instagram,
            spotify_id: producer.spotify,
            is_iprs_member: producer.iprs,
            ipi_number: producer.iprsNumber,
          })) || [],
          track_main_artist: singersDetails.filter(Boolean).map(artist => ({
            id: artist._id,
            name : artist.artistName,
            apple_id: artist.appleMusic,
            facebook_artist_page_url: artist.facebook,
            insta_artist_page_url: artist.instagram,
            spotify_id: artist.spotify,
            is_iprs_member: artist.iprs,
            ipi_number: artist.iprsNumber,         
          })) || [],
          media: {
            id : "",
            size : audioFileSize || "",
            md5: audioFileChecksum || "",
            filename: track.audioFile || "",
          }
        };
      })
    );

    const thumbnailUrl = `${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${album._id}ba3/cover/${album.thumbnail}`;
    console.log(`Thumbnail URL: ${thumbnailUrl}`);
    const { checksum: thumbnailChecksum, size: thumbnailSize } = await fetchImageAndGenerateChecksum(thumbnailUrl);

    const formattedResponse = {
      one: "add",
      two: "meta",
      version: "2",
      submitted_by_form: false,
      albums: [
        {
          uploaded_via: "AdvanceMetaData",
          is_update: false,
          name: "Gangster-Raju-1724771189421-32",
          label: "SwaLay Digital",
          label_id: "",
          c_line: album.cline || "",
          upc_id: "",
          songs: tracksWithDetails || [],
          inlay: {
            id: "",
            size: thumbnailSize || "",
            md5: thumbnailChecksum || "",
            filename: album.thumbnail || "",
          }, 
          album_main_artist: [
               {
                 id: artistDetails ? artistDetails._id : "",
                 name: artistDetails ? artistDetails.artistName : ""
               }
          ]
        }
      ]
    };

    // Log the formatted request body
    console.log("Data sent to the external API:", JSON.stringify(formattedResponse, null, 2));

    // Send the formatted data to the external API and get signed URLs
    const externalApiResponse = await fetch('http://pdl.gaonaweb.com/v2.0/album/add/meta', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjFiOTkyMWQyZDU2YjY1N2E1YzE4OWZjIiwic2NvcGUiOlsiRHVwbGljYXRlVXBsb2FkZXIiLCJMYWJlbCIsIkFkdmFuY2VNZXRhZGF0YSJdLCJleHRyYSI6e30sImV4cCI6MTc1NjQ1NTM1OCwiaWF0IjoxNzI1MzUxMzU4LCJpc3MiOiJUU00iLCJzdWIiOiI2MWI5OTIxZDJkNTZiNjU3YTVjMTg5ZmMifQ.OeCKVxGHLjAudvs_kRdNxNXRItYKCtPjWzUXh_MjOpcG8j5uSiR96zM6orAu21KFCbF5W890ELoS501-yllj8vVjLqQPEVNUrEaZBNGjhICjMgaUATn9RJz37C9gz51LkWXsilYPwa3l-uOkGbtt43AVN3oYqgc7BvHscwG637FL30CslB2_OX__Tx8nnuQpruGT1m4xSEZbYrKGCnMm0O-a8DaC5N8DJrI9GBFtM6RWdd-qydc2Mox4bZnGL8m1-OMFU5sHcOBebUAUQ_H6aIowB7qAj14Rdt8MvrXDNcRtCK_O1tXHAluM55-MkMxk9pF_ZJIuMuXJa0qZJZwDVw',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'http://localhost:9000',
        'Referer': 'http://localhost:9000/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
      body: JSON.stringify(formattedResponse),
    });

    const responseData :any = await externalApiResponse.json();

    if (!externalApiResponse.ok) {
      return NextResponse.json(responseData, { status: externalApiResponse.status });
    }

    const { signed_albums } = responseData.data   ;

    // Fetch the album art and upload it using the signed URL
    const albumArtBuffer = await fetchFileFromS3(thumbnailUrl);
    await uploadFileToSignedUrl(signed_albums[0].inlay.signed_url, albumArtBuffer, 'image/jpeg');

    // Fetch and upload each track using the signed URLs
    for (let i = 0; i < tracks.length; i++) {
      const trackBuffer = await fetchFileFromS3(`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${tracks[i].albumId}ba3/tracks/${tracks[i].audioFile}`);
      await uploadFileToSignedUrl(signed_albums[0].songs[i].media.signed_url, trackBuffer, 'audio/mp4');
    }

    return NextResponse.json({ message: 'Suceess album saved', data: responseData , success: true, status: 201});
  
  } catch (error: any) {
    console.error('Internal Server Error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
