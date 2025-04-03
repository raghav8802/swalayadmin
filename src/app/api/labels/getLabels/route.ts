import { connect } from "@/dbConfig/dbConfig"; // Assuming this is your database connection file
import Label from "@/models/Label"; // Import the Label model
import { NextResponse } from "next/server";

export async function GET() {
  // Connect to the database
  await connect();

  try {
    // Fetch all labels from the database
    const labels = await Label.find()
      .select("-password -verifyCode -verifyCodeExpiry -razor_contact")
      .sort({ _id: -1 });

    console.log('Found Labels:', labels.length);
    console.log('Labels:', labels.map(l => ({ id: l._id, username: l.username, usertype: l.usertype })));

    // If no labels found, return a message
    if (!labels.length) {
      return NextResponse.json({
        status: 404,
        message: "No labels found",
        success: false,
      });
    }

    // Return the fetched labels
    return NextResponse.json({
      status: 200,
      data: labels,
      message: "Labels fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error('Error fetching labels:', error);
    // Handle any errors
    return NextResponse.json({
      status: 500,
      message: "An error occurred while fetching labels",
      success: false,
    });
  }
}
