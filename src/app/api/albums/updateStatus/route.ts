import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Album, { AlbumStatus } from "@/models/albums";
import { connect } from "@/dbConfig/dbConfig";
import Notification from "@/models/notification";
import AlbumStatusEmailTemplate from "@/components/email/album-status";
import sendMail from "@/helpers/sendMail";
import Label from "@/models/Label";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { id, labelid, albumName, status, comment } = await req.json();

    console.log("album status data");
    console.log({ id, labelid, albumName, status, comment });

    if (
      !labelid ||
      status === undefined ||
      (status === AlbumStatus.Rejected && !comment)
    ) {
      return NextResponse.json({
        message: "Missing required fields",
        success: false,
      });
    }

    if (!Object.values(AlbumStatus).includes(status)) {
      return NextResponse.json({
        message: "Invalid status value ",
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


    let message = "";
    let MessageforEmail = "";
    let statusLabel = "";
    switch (status) {
      case 2: //Approved
        message = `Album <b>${albumName}</b> is approved`;
        MessageforEmail = `Album ${albumName} is approved`;
        statusLabel = `approved`;
        break;
      case 3: // Rejected
        message = `Album <b>${albumName}</b> is Rejected due to ${comment}`;
        MessageforEmail = `Album ${albumName} is Rejected`;
        statusLabel = `rejected`;

        break;
      case 4: // Live
        message = `Album <b>${albumName}</b> is Live Now`;
        MessageforEmail = `Album ${albumName} is Live Now`;
        statusLabel = `live`;
        break;
    }

    // send notification
    const newNotification = new Notification({
      labels: [labelid.toString()], //id
      category: "Updates",
      toAll: false,
      message,
    });

    await newNotification.save();

    // fetch user email and name
    const user = await Label.findById(labelid, "username email");

    const username = user?.username;
    const userEmail = user?.email;

    const emailTemplate = AlbumStatusEmailTemplate({
      labelName: username || "",
      albumName,
      status: statusLabel as "approved" | "rejected" | "live",
      message,
    });

    await sendMail({
      to: userEmail as string, // Key 'to' must be specified
      subject: MessageforEmail, // Key 'subject' must be specified
      emailTemplate, // This passes the rendered template
    });


    return NextResponse.json({
      message: "Album status updated successfully",
      success: true,
      data: album,
      status: 200,
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
