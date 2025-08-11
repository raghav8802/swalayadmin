import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Album from "@/models/albums";
import { uploadFileToS3 } from "@/dbConfig/uploadFileToS3";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const formData = await req.formData();

    const data = {
      labelId: formData.get("labelId")?.toString() ?? "",
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

    
    


    const artwork = formData.get("artwork") as File;
    const albumName = (formData.get("title") as string).trim();
    const albumNameNoSpace = albumName.replace(/ /g, "-");
    console.log("::: albumNameNoSpace : ->");
    console.log(albumName);
    
    if (!artwork) {
      return NextResponse.json({
        message: "Artwork is required",
        success: false,
        status: 500,
      });
    }

    const buffer = Buffer.from(await artwork.arrayBuffer());

    // here i save the albumdetails
    const newAlbum = new Album(data);
    const savedAlbum = await newAlbum.save();


    const folderName = savedAlbum._id;

    const timestamp = Date.now(); // Current timestamp in milliseconds
    const random = Math.round(Math.random() * 16).toString(4);
    const fileExtension = artwork.name.split(".").pop(); // Get file extension
    const artworkName = `${albumNameNoSpace}-${timestamp}-${random}.${fileExtension}`;

    // here i save the image to aws s3
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


    // Update the album with the S3 file name
    savedAlbum.thumbnail = uploadResult.fileName; // Set the thumbnail field to the S3 file name
    await savedAlbum.save(); // Save the updated album

    return NextResponse.json({
      message: "Suceess album saved",
      data: savedAlbum,
      // data: [],
      success: true,
      status: 201,
    });
  } catch (error: any) {
    console.error("Error creating album:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}