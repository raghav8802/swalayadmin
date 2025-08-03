import { NextRequest, NextResponse } from "next/server";
import Track from "@/models/track";
import { connect } from "@/dbConfig/dbConfig";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached all tracks query with pagination
const getCachedAllTracks = createCachedQuery(
  async (page: number, limit: number, search?: string) => {
    await connect();
    
    const skip = (page - 1) * limit;
    let query: any = {};
    
    // Add search functionality
    if (search && search.trim() !== '') {
      query = {
        $or: [
          { songName: { $regex: search, $options: 'i' } },
          { isrc: { $regex: search, $options: 'i' } },
          { version: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalCount = await Track.countDocuments(query);
    
    // Get paginated data
    const tracks = await Track.find(query)
      .select("_id songName isrc version")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return {
      data: tracks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
        limit
      }
    };
  },
  'tracks-paginated',
  300 // 5 minutes cache
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
        return NextResponse.json({
            success: false,
            message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100"
        }, { status: 400 });
    }
    
    const result = await getCachedAllTracks(page, limit, search);

    if (!result.data?.length) {
      return NextResponse.json({
        message: "Tracks not found",
        success: false,
        status: 404,
        pagination: result.pagination
      });
    }

    return NextResponse.json({
      success: true,
      message: "Track details fetched successfully",
      ...result
    });
  } catch (error) {
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
