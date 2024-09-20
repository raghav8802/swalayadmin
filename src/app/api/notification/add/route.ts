import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig";
import Notification from "@/models/notification";


export async function POST(req: NextRequest) {
  try {
    await connect();

    const body = await req.json();
    console.log("body -------------------");
    console.log(body);

    const { labels, category, message } = body;

    // Ensure the message field is provided
    if (!message) {
      return NextResponse.json({
        message: "Message field is required",
        success: false,
        status: 400,
      });
    }

    // Set toAll to "All" if no labels are provided, otherwise use the provided labels
    const toAll = !labels || labels.length === 0 ? "All" : null;

    // Create a new notification
    const newNotification = new Notification({
      labels: labels || null,     // Set to null if not provided
      toAll: toAll,               // Set to "All" if no labels are provided
      category: category || null, // Set to null if not provided
      message,                    // Message is required
    });

    const savedNotification = await newNotification.save();
    return NextResponse.json({
      message: "Success",
      success: true,
      status: 200,
      data: savedNotification,
    });
  } catch (error: any) {
    console.error("Error creating notification:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
