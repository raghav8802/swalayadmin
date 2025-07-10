import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import Track from "@/models/track";
import { uploadTrackToS3 } from "@/dbConfig/uploadFileToS3";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();

    const trackId = formData.get("trackId")?.toString();
  
    if (!trackId || !mongoose.Types.ObjectId.isValid(trackId)) {
      return NextResponse.json({
        message: "Invalid trackId",
        success: false,
        status: 400,
      });
    }

    const albumId = formData.get("albumId")?.toString();
    if (!albumId || !mongoose.Types.ObjectId.isValid(trackId)) {
      return NextResponse.json({
        message: "Invalid trackId",
        success: false,
        status: 400,
      });
    }


    // Initialize the updateData object with all potential fields
    const updateData: {
      songName?: string;
      primarySinger?: string;
      featuredArtist?: string;
      singers?: string[];
      composers?: string[];
      lyricists?: string[];
      producers?: string[];
      isrc?: string;
      duration?: string;
      crbt?: string;
      category?: string;
      version?: string;
      trackType?: string;
      audioFile?: string; // Include audioFile as an optional field
    } = {};

    // Populate updateData with fields from formData
    updateData.songName = formData.get("songName")?.toString() ?? "";
    updateData.primarySinger = formData.get("primarySinger")?.toString() ?? "";
    updateData.featuredArtist = formData.get("featuredArtist")?.toString() ?? "";
    updateData.singers = JSON.parse(formData.get("singers")?.toString() ?? "[]");
    updateData.composers = JSON.parse(formData.get("composers")?.toString() ?? "[]");
    updateData.lyricists = JSON.parse(formData.get("lyricists")?.toString() ?? "[]");
    updateData.producers = JSON.parse(formData.get("producers")?.toString() ?? "[]");

    updateData.crbt = formData.get("crbt")?.toString() ?? "";
    updateData.category = formData.get("category")?.toString() ?? "";
    updateData.version = formData.get("version")?.toString() ?? "";
    updateData.trackType = formData.get("trackType")?.toString() ?? "";

    const audioFile = formData.get("audioFile") as File;

    // Handle audio file update
    if (audioFile && audioFile.size > 0) {

      if (!["audio/mpeg", "audio/wav"].includes(audioFile.type)) {
        return NextResponse.json({
          message: "Invalid file type. Please upload an MP3 or WAV file.",
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

      // Update the audio file field
      updateData.audioFile = uploadResult.fileName;
      updateData.duration = formData.get("duration")?.toString() ?? "";
    }

    // Perform the update operation
    const updatedTrack = await Track.findByIdAndUpdate(trackId, updateData, { new: true });

    if (!updatedTrack) {
      return NextResponse.json({
        message: "Track not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Success! Track updated",
      data: updatedTrack,
      success: true,
      status: 200,
    });

  } catch (error: any) {
    console.error("Error updating track:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
