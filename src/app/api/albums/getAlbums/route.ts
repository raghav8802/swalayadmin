import { NextRequest, NextResponse } from "next/server";

import Album from "@/models/albums";
import { connect } from "@/dbConfig/dbConfig";
import { createCachedQuery, createCachedResponse } from "@/lib/cache";

// Cached database query
const getCachedAlbums = createCachedQuery(
  async (labelId?: string) => {
    await connect();
    const query = labelId ? { labelId, status: 2 } : { status: 2 };
    return await Album.find(query).sort({ _id: -1 }).lean();
  },
  "albums-live",
  300 // 5 minutes cache
);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    
    const { searchParams } = new URL(req.url);
    const labelId = searchParams.get("labelid") ?? undefined;

    const albums = await getCachedAlbums(labelId);

    if (!albums?.length) {
      return NextResponse.json({
        message: "No albums found",
        success: false,
        status: 404,
      });
    }

    return createCachedResponse(albums, "Albums fetched successfully", 300);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
