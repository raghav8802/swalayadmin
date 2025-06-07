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

    // Initialize the updateData object with all potential fields
    const updateData: {
      songName?: string;
      primarySinger?: string;
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
    updateData.singers = JSON.parse(formData.get("singers")?.toString() ?? "[]");
    updateData.composers = JSON.parse(formData.get("composers")?.toString() ?? "[]");
    updateData.lyricists = JSON.parse(formData.get("lyricists")?.toString() ?? "[]");
    updateData.producers = JSON.parse(formData.get("producers")?.toString() ?? "[]");
    updateData.isrc = formData.get("isrc")?.toString() ?? "";
    updateData.duration = formData.get("duration")?.toString() ?? "";
    updateData.crbt = formData.get("crbt")?.toString() ?? "";
    updateData.category = formData.get("category")?.toString() ?? "";
    updateData.version = formData.get("version")?.toString() ?? "";
    updateData.trackType = formData.get("trackType")?.toString() ?? "";

    const audioFile = formData.get("audioFile") as File;

    // Handle audio file update
    if (audioFile) {
      const songName = (formData.get("songName") as string).trim();
      const songNameNoSpace = songName.replace(/ /g, "-");
      const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
      const audioFileExtension = audioFile.name.split(".").pop();
      const audioFileName = `${songNameNoSpace}-${Date.now()}.${audioFileExtension}`;

      const uploadResult = await uploadTrackToS3({
        file: audioBuffer,
        fileName: audioFileName,
        folderName: trackId,
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

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating track:", error);
      return NextResponse.json({
        message: error.message,
        success: false,
        status: 500,
      });
    }
    return NextResponse.json({
      message: 'An unknown error occurred',
      success: false,
      status: 500,
    });
  }
}
