import { NextRequest, NextResponse } from 'next/server';
import Album, { AlbumStatus } from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached filtered albums query with pagination
const getCachedFilteredAlbums = createCachedQuery(
  async (status: string, page: number, limit: number, search?: string) => {
    await connect();
    
    const skip = (page - 1) * limit;
    let query: any = {};
    
    // Status filter
    if (status && status !== "All") {
      const statusEnumValue = AlbumStatus[status as keyof typeof AlbumStatus];
      if (statusEnumValue !== undefined) {
        query.status = statusEnumValue;
      }
    } else if (status === "All") {
      query.status = { $ne: AlbumStatus.Draft };
    }
    
    // Add search functionality
    if (search && search.trim() !== '') {
      const searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
          { genre: { $regex: search, $options: 'i' } },
          { language: { $regex: search, $options: 'i' } },
          { upc: { $regex: search, $options: 'i' } }
        ]
      };
      
      if (Object.keys(query).length > 0) {
        query = { $and: [query, searchQuery] };
      } else {
        query = searchQuery;
      }
    }
    
    // Get total count for pagination
    const totalCount = await Album.countDocuments(query);
    
    // Get paginated data
    const albums = await Album.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: albums,
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
  'albums-filtered-paginated',
  240 // 4 minutes cache
);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {

    const {searchParams} = new URL(req.url);
    
    const status = searchParams.get("status") || "All";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";


    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
        return NextResponse.json({
            message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100",
            success: false,
            status: 400,
        });
    }

    const result = await getCachedFilteredAlbums(status, page, limit, search);



    if (!result.data?.length) {
      return NextResponse.json({
        message: "No albums found",
        success: true,
        status: 404,
        pagination: result.pagination
      });
    }

    return NextResponse.json({
      success: true,
      message: "Albums filtered successfully",
      ...result
    });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
