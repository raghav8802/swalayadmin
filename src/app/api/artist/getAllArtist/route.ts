import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Artist from "@/models/Artists";



export const revalidate = 0; 

export async function GET() {
  try {
    await connect();

    // Fetch all artists without any filter
    const artists = await Artist.find({}).sort({ _id: -1 }).lean();
    
    return NextResponse.json({
      message: "Artists fetched successfully",
      success: true,
      data: artists,
    });

  } catch (error: any) {
    console.error("Error fetching artists:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to fetch artists" 
      },
      { status: 500 }
    );
  }
} 