import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await connect(); // DB connection

    console.log("Fetching labels..."); // Debug log

    const labels = await Label.find()
      .select("-password -verifyCode -verifyCodeExpiry -razor_contact")
      .sort({ _id: -1 })
      .lean();

    if (!labels?.length) {
      return NextResponse.json(
        {
          success: false,
          status: 404,
          message: "No labels found",
        },
        { status: 404 }
      );
    }
    console.log("Labels fetched successfully:", labels); // Debug log
    return NextResponse.json({
      success: true,
      data: labels,
    });
  } catch (error) {
    console.error("Error fetching labels:", error);
    return NextResponse.json(
      {
        success: false,
        status: 500,
        message: "An error occurred while fetching labels",
      },
      { status: 500 }
    );
  }
}