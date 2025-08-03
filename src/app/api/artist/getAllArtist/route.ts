import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Artist from "@/models/Artists";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached artists query with pagination
const getCachedAllArtists = createCachedQuery(
  async (page: number, limit: number, search?: string) => {
    await connect();
    
    const skip = (page - 1) * limit;
    let query: any = {};
    
    // Add search functionality
    if (search && search.trim() !== '') {
      query = {
        $or: [
          { artistName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { spotifyId: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalCount = await Artist.countDocuments(query);
    
    // Get paginated data
    const artists = await Artist.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return {
      data: artists,
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
  'artists-paginated',
  600 // 10 minutes cache
);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);
    
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
    
    const result = await getCachedAllArtists(page, limit, search);
    
    return NextResponse.json({
      success: true,
      message: "Artists fetched successfully",
      ...result
    });
  } catch (error: any) {
    console.error("Error fetching artists:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetch artists"
    }, { status: 500 });
  }
} 