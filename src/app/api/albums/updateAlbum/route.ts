import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";
import { uploadFileToS3 } from "@/dbConfig/uploadFileToS3";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();
    const albumId = formData.get("albumId")?.toString() ?? "";

    if (!albumId) {
      return NextResponse.json({
        message: "Album ID is required",
        success: false,
        status: 400,
      });
    }

    const data = {
      title: formData.get("title")?.toString() ?? "",
      releasedate: formData.get("releaseDate")?.toString() ?? "",
      artist: formData.get("artist")?.toString() ?? "",
      genre: formData.get("genre")?.toString() ?? "",
      label: formData.get("label")?.toString() ?? "",
      language: formData.get("language")?.toString() ?? "",
      tags: JSON.parse(formData.get("tags")?.toString() ?? "[]"),
      pline: formData.get("pLine")?.toString() ?? "",
      cline: formData.get("cLine")?.toString() ?? "",
    };

    console.log(data);
    console.log("----------------");
    

    const artwork = formData.get("artwork") as File;
    const albumName = (formData.get("title") as string).trim();
    const albumNameNoSpace = albumName.replace(/ /g, "-");

    if (!artwork && !Object.keys(data).length) {
      return NextResponse.json({
        message: "No changes detected",
        success: false,
        status: 400,
      });
    }

    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({
        message: "Album not found",
        success: false,
        status: 404,
      });
    }

    // Update album details
    Object.assign(album, data);

    if (artwork) {
      const buffer = Buffer.from(await artwork.arrayBuffer());
      const folderName = album._id;
      const timestamp = Date.now();
      const random = Math.round(Math.random() * 16).toString(4);
      const fileExtension = artwork.name.split(".").pop();
      const artworkName = `${albumNameNoSpace}-${timestamp}-${random}.${fileExtension}`;

      const uploadResult = await uploadFileToS3({
        file: buffer,
        fileName: artworkName,
        folderName: folderName,
      });

      if (!uploadResult.status) {
        return NextResponse.json({
          message: "Failed to upload artwork",
          success: false,
          status: 500,
        });
      }

      album.thumbnail = uploadResult.fileName; // Update thumbnail field with S3 file name
    }

    await album.save(); // Save updated album

    return NextResponse.json({
      message: "Success! Album updated",
      data: album,
      success: true,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error updating album:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
