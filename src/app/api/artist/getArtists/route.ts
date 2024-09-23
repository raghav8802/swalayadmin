import { connect } from "@/dbConfig/dbConfig";
import Artist from "@/models/Artists";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connect(); // Connect to the database

  try {
    // const labelId = request.nextUrl.searchParams.get("labelId");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "0"); // Default to 0 if no limit provided

    // console.log("LabelId : " + labelId);

    // if (!labelId) {
    //     return NextResponse.json({
    //         message: "Label ID is required",
    //         success: false,
    //         status: 400
    //     });
    // }

    // Build the query with sorting and optional limit
    const query = Artist.find().sort({ createdAt: -1 }); // Sort by createdAt from new to old

    // Apply limit if specified
    if (limit > 0) {
      query.limit(limit);
    }

    const allArtists = await query;

    return NextResponse.json({
      message: "Artists found",
      success: true,
      status: 200,
      data: allArtists,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
      success: false,
    });
  }
}
