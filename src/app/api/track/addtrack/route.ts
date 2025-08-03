import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";
import { uploadTrackToS3 } from "@/dbConfig/uploadFileToS3";
import Album from "@/models/albums";
import { invalidateCache } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();
    console.log("formData from addtrack route: ---------------------------------");
    formData.forEach((value, key) => {
      console.log("key : key", key);
      console.log("value : value", value);
    });

    const albumId = formData.get("albumId")?.toString();

    console.log("albumId from input");
    console.log(albumId);
    
    if (!albumId || !mongoose.Types.ObjectId.isValid(albumId)) {
      return NextResponse.json({
        message: "Invalid albumId",
        success: false,
        status: 400,
      });
    }

   
    const lastTrack = await Track.findOne({ isrc: /^INT63/ }).select('isrc').sort({ _id: -1 });

    // Generate the next ISRC
    let newISRC = "INT63" + new Date().getFullYear().toString().slice(-2) + "03001"; // Default value
    console.log("newISRC before assignment");
    console.log(newISRC);

    // let newISRC = "";
    if (lastTrack && lastTrack.isrc) {
      
      const lastISRC = parseInt(lastTrack.isrc.slice(-5)); // Extract the sequence number
      const nextISRC = lastISRC + 1;
      newISRC = `INT63${new Date().getFullYear().toString().slice(-2)}${String(
        nextISRC
      ).padStart(5, "0")}`;
    }else{
      return NextResponse.json({
        message: "ISRC assignment error",
        success: false,
        status: 500,
      });
    }


    const data = {
      albumId: new mongoose.Types.ObjectId(albumId),
      songName: formData.get("songName")?.toString() ?? "",
      primarySinger: formData.get("primarySinger")?.toString() ?? "",
      featuredArtist: formData.get("featuredArtist")?.toString() ?? "",
      singers: JSON.parse(formData.get("singers")?.toString() ?? "[]"),
      composers: JSON.parse(formData.get("composers")?.toString() ?? "[]"),
      lyricists: JSON.parse(formData.get("lyricists")?.toString() ?? "[]"),
      producers: JSON.parse(formData.get("producers")?.toString() ?? "[]"),
      isrc: newISRC,
      duration: formData.get("duration")?.toString() ?? "",
      crbt: formData.get("crbt")?.toString() ?? "",
      category: formData.get("category")?.toString() ?? "",
      version: formData.get("version")?.toString() ?? "",
      trackType: formData.get("trackType")?.toString() ?? "",
    };



    const audioFile = formData.get("audioFile") as File;
  
    

    if (!audioFile) {
      return NextResponse.json({
        message: "Audio file is required",
        success: false,
        status: 400,
      });
    }

    const songName = (formData.get("songName") as string).trim();
    const songNameNoSpace = songName.replace(/ /g, "-");
    
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const audioFileExtension = audioFile.name.split(".").pop();
    
    const audioFileName = `${songNameNoSpace}-${Date.now()}.${audioFileExtension}`;

    const uploadResult = await uploadTrackToS3({
      file: audioBuffer,
      fileName: audioFileName,
      folderName: albumId,
    });

  

    if (!uploadResult.status) {

      return NextResponse.json({
        message: "Failed to upload audio file",
        success: false,
        status: 500,
      });
    }

    const newTrack = new Track({
      ...data,
      audioFile: audioFileName
    });
    
    await newTrack.save();


    // here i want to update total track count to increase 1 but album id in album schema
    await Album.findByIdAndUpdate(albumId, {
      $inc: { totalTracks: 1 }
    });

    // Invalidate related caches after adding track
    invalidateCache('tracks-by-album');
    invalidateCache('tracks-all');
    invalidateCache('albums-');
    invalidateCache('dashboard-stats');

    return NextResponse.json({
      message: "Success! Track saved",
      // data: savedTrack,
      success: true,
      status: 201,
    });


  } catch (error: any) {
    console.error("Error creating track:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
    
  }
}



