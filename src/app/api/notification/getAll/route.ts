import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Notification from "@/models/notification";
import Label from "@/models/Label";

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Fetch all notifications from the database
    const notifications = await Notification.find().sort({_id: -1});

    // Process each notification to replace label IDs with usernames or label names
    const updatedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        // Replace the labels array with usernames or label names
        if (notification.labels && notification.labels.length > 0) {
          const labelsWithNames = await Promise.all(
            notification.labels.map(async (labelId:any) => {

              const label = await Label.findById(labelId);
            
              if (label) {
                // If usertype is 'normal', use username, otherwise use lable
                return label.usertype === "normal" ? label.username : label.lable;
              }

              return null; // Handle case if label is not found
            })
          );

          // Filter out any null values in case any label wasn't found
          notification.labels = labelsWithNames.filter((name) => name !== null);
        }

        return notification;
      })
    );

    

    return NextResponse.json({
      message: "Notifications fetched and updated successfully",
      success: true,
      status: 200,
      data: updatedNotifications,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
