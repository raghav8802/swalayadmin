import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connect } from '@/dbConfig/dbConfig';
import Album from '@/models/albums';
import Artist from '@/models/Artists';
import Label from '@/models/Label';
import Track from '@/models/track';
import ApiResponse from '@/lib/apiResponse';
import crypto from 'crypto';


import axios from 'axios';



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


const verifyAlbumMeta = async (token: string, albumId: string) => {
  try {
    const verifyMetaResponse = await axios.get('https://apicms.infinitesoul.in/v2.0/album/verify/meta', {
      params: {
        album_id: "",
        label_id: '61b990392d56b657a5c186d7',  // Replace with the actual label_id
        token: token,
      },
       
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjFiOTkyMWQyZDU2YjY1N2E1YzE4OWZjIiwic2NvcGUiOlsiTGFiZWwiLCJBZHZhbmNlTWV0YWRhdGEiXSwiZXh0cmEiOnt9LCJleHAiOjE3NTk1NjUwOTcsImlhdCI6MTcyODQ2MTA5NywiaXNzIjoiVFNNIiwic3ViIjoiNjFiOTkyMWQyZDU2YjY1N2E1YzE4OWZjIn0.AEXW0dWbb90qLRjFYvw3phhpj-eqbcfErCs8gDgEC8_oM9Ogig1tbxbMUdDGwSjHdWdw8dpM_PUW1ZBW-FpRhZoSRtm-9TrfIqvXBEHq8GKXdTNwe3OXjGg8qmeqH_bm-lPMWVr7WWvkS6kqaftptPziXKJWhK0ZIH1dVOqjwFw6itlqVZw1LUKKge4Idsb9wKsafBQixXaz9bH92LTIlnOuTbf5HhfiFiKuG33KnYAKLwd1o6lYTv0ZNYgGdXVGHyTxkaarCV2Kw7URfq0dUV2Nln-lk8iI-JBqrzECCk7NL8y5Vy9Ez9yBxTP_FjEA_5pje0cbqX1dE6lETBjLZQ`,  // Replace with your Bearer token
      },

    });
    console.log('Verify Meta Response:', verifyMetaResponse.data);
    return verifyMetaResponse.data;
  } catch (error) {
    console.error('Error during verification:', error);
    throw new Error('Failed to verify album metadata');
  }
};




export async function POST(req: Request) {
  try {
    await connect();

    const { albumId }: { albumId?: string } = await req.json();

    if (!albumId) {
      return ApiResponse(400, null, false, 'Album ID is required').nextResponse;
    }

    const albumObjectId = new mongoose.Types.ObjectId(albumId);

    const album = await Album.findById(albumObjectId).select('_id labelId title artist thumbnail language genre releasedate status totalTracks cline pline tags comment');

    if (!album) {
      return ApiResponse(404, null, false, 'Album not found').nextResponse;
      
    }

    console.log(album.labelId);
   

    let labelDetails = null;
    if (album.labelId && mongoose.Types.ObjectId.isValid(album.labelId)) {
      labelDetails = await Label.findById(album.labelId).select('_id lable');
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

        console.log(track);

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
            genre:  "Indie",
            sub_genre : "Indie Pop",
            mood: album.tags[0] || "",
            isrc: track.isrc || "",
            label : labelDetails?.lable || "",
            publisher : labelDetails?.lable || "",
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
            apple_id: "",
            facebook_artist_page_url: lyricist.facebook,
            insta_artist_page_url: lyricist.instagram,
            spotify_id: lyricist.spotify,
            is_iprs_member: lyricist.iprs,
            ipi_number: lyricist.iprsNumber,
          })) || [],
          composers: composersDetails.filter(Boolean).map(composer => ({
            id: composer._id,
            name : composer.artistName,
            apple_id: "",
            facebook_artist_page_url: composer.facebook,
            insta_artist_page_url: composer.instagram,
            spotify_id: composer.spotify,
            is_iprs_member: composer.iprs,
            ipi_number: composer.iprsNumber,
          })) || [],
          producers: producersDetails.filter(Boolean).map(producer => ({
            id: producer._id,
            name : producer.artistName,
            apple_id: "",
            facebook_artist_page_url: producer.facebook,
            insta_artist_page_url: producer.instagram,
            spotify_id: producer.spotify,
            is_iprs_member: producer.iprs,
            ipi_number: producer.iprsNumber,
          })) || [],

          track_main_artist : singersDetails.filter(Boolean).map(singer => ({
            id: singer._id,
            name : singer.artistName,
            apple_id: "",
            facebook_artist_page_url: singer.facebook,
            insta_artist_page_url: singer.instagram,
            spotify_id: singer.spotify,
            is_iprs_member: singer.iprs,
            ipi_number: singer.iprsNumber,

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
      
      version: "2",
      albums: [
        {
          
          is_update: false,
          name: "Gangster-Raju-1724771189421-32",
          label:  labelDetails?.lable || "",
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
                 
               }
          ]
        }
      ]
    };

    // Log the formatted request body
    console.log("Data sent to the external API:", JSON.stringify(formattedResponse, null, 2));

    // Send the formatted data to the external API and get signed URLs
    const externalApiResponse = await fetch('https://apicms.infinitesoul.in/v2.0/album/add/meta', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjFiOTkyMWQyZDU2YjY1N2E1YzE4OWZjIiwic2NvcGUiOlsiTGFiZWwiLCJBZHZhbmNlTWV0YWRhdGEiXSwiZXh0cmEiOnt9LCJleHAiOjE3NTk1NjUwOTcsImlhdCI6MTcyODQ2MTA5NywiaXNzIjoiVFNNIiwic3ViIjoiNjFiOTkyMWQyZDU2YjY1N2E1YzE4OWZjIn0.AEXW0dWbb90qLRjFYvw3phhpj-eqbcfErCs8gDgEC8_oM9Ogig1tbxbMUdDGwSjHdWdw8dpM_PUW1ZBW-FpRhZoSRtm-9TrfIqvXBEHq8GKXdTNwe3OXjGg8qmeqH_bm-lPMWVr7WWvkS6kqaftptPziXKJWhK0ZIH1dVOqjwFw6itlqVZw1LUKKge4Idsb9wKsafBQixXaz9bH92LTIlnOuTbf5HhfiFiKuG33KnYAKLwd1o6lYTv0ZNYgGdXVGHyTxkaarCV2Kw7URfq0dUV2Nln-lk8iI-JBqrzECCk7NL8y5Vy9Ez9yBxTP_FjEA_5pje0cbqX1dE6lETBjLZQ',
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

    // Add logging to see the actual response structure
    console.log('Response Data:', responseData);

    // Check if data and signed_albums exist and have content
    if (!responseData.data?.signed_albums?.length) {
      throw new Error('No signed albums data received from the API');
    }

    const { signed_albums } = responseData.data;

    // Add additional safety checks before accessing the data
    if (!signed_albums[0]?.inlay?.signed_url) {
      throw new Error('Missing inlay signed URL in the response');
    }

    // Fetch the album art and upload it using the signed URL
    const albumArtBuffer = await fetchFileFromS3(thumbnailUrl);
    await uploadFileToSignedUrl(signed_albums[0].inlay.signed_url, albumArtBuffer, 'image/jpeg');

    // Add safety check for songs array
    if (!signed_albums[0]?.songs?.length) {
      throw new Error('No signed URLs received for songs');
    }

    // Fetch and upload each track using the signed URLs
    for (let i = 0; i < tracks.length; i++) {
      if (!signed_albums[0].songs[i]?.media?.signed_url) {
        throw new Error(`Missing signed URL for track ${i}`);
      }
      const trackBuffer = await fetchFileFromS3(`${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}albums/07c1a${tracks[i].albumId}ba3/tracks/${tracks[i].audioFile}`);
      await uploadFileToSignedUrl(signed_albums[0].songs[i].media.signed_url, trackBuffer, 'audio/mp4');
    }


    console.log('externalApiResponse' , responseData);

    const token = responseData.data?.token;
    if (!token) {
      throw new Error('Token not found in the response');
    }

    const verifiedMeta = await verifyAlbumMeta(token, albumId);

    return NextResponse.json({ message: 'Success', data: verifiedMeta, success: true, status: 201 });
  
  } catch (error: any) {
    console.error('Internal Server Error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}