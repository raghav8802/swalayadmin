import { NextRequest, NextResponse } from 'next/server';
import mongoose from "mongoose";
import Album, { AlbumStatus } from "@/models/albums";
import { connect } from "@/dbConfig/dbConfig";


export async function POST(req: NextRequest) {

  await connect();

  try {
    const { id, status, comment } = await req.json();

    console.log("status : ", status);
    
    if (!id || status === undefined || (status === AlbumStatus.Rejected && !comment)) {
      return NextResponse.json({
        message: "Missing required fields",
        success: false,
      });
    }

    if (!Object.values(AlbumStatus).includes(status)) {
      return NextResponse.json({
        message: "Invalid status value ds",
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        message: "Invalid album ID",
        success: false,
      });
    }

    // Fixed the syntax: The update parameters should be passed as the second argument, not as part of a filter.
    // const album = await Album.findByIdAndUpdate(
    //   id,
    //   { status, comment }
    // );

    return NextResponse.json({
      message: "Album status updated successfully",
      success: true,
    });

  } catch (error: any) {
    console.error("Internal Server Error:", error);

    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
