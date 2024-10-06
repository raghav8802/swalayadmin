import { NextRequest, NextResponse } from 'next/server';
import mongoose from "mongoose";
import Album, { AlbumStatus } from "@/models/albums";
import { connect } from "@/dbConfig/dbConfig";
import Notification from '@/models/notification';



export async function POST(req: NextRequest) {


  await connect();

  try {
    const { id, albumName, status, comment } = await req.json();

    
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


    const album = await Album.findByIdAndUpdate(
      id,
      { status, comment },
      { new: true } 
    );

let message = ''
    switch (status) {
      case 2: //Approved
        message = `Album <b>${albumName}</b> is approved`
        break;
        case 3: // Rejected
        message = `Album <b>${albumName}</b> is Rejected due to ${comment}`
        break;
        case 4: // Live
        message = `Album <b>${albumName}</b> is Live Now`
        break;
    }

    // send notification 
    const newNotification = new Notification({
      labels: [id.toString()], //id
      category: "Updates",
      message
    });
    await newNotification.save();


    return NextResponse.json({
      message: "Album status updated successfully",
      success: true,
      data: album,
      status: 200
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
