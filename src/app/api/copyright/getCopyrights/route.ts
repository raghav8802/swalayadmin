import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import Youtube from "@/models/youtube";
import { NextResponse, NextRequest } from "next/server";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached copyrights query with pagination
const getCachedCopyrights = createCachedQuery(
  async (page: number, limit: number, search?: string) => {
    await connect();

    const skip = (page - 1) * limit;
    let query: any = {};
    
    // Add search functionality
    if (search && search.trim() !== '') {
      query = {
        $or: [
          { link: { $regex: search, $options: 'i' } },
          { comment: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalCount = await Youtube.countDocuments(query);

    const copyrightsData = await Youtube.find(query)
      .populate({
        path: "labelId",
        select: "username lable usertype", // Select username, label, and usertype from the Label model
        model: Label,
      })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Format the response with conditional label value based on usertype
    const formattedData = copyrightsData.map((item: any) => {
      // Check if labelId exists and is not null
      if (item.labelId) {
        return {
          _id: item._id,
          labelId: item.labelId._id, // Keep labelId
          label:
            item.labelId.usertype === "normal"
              ? item.labelId.username // Show username for 'normal' users
              : item.labelId.lable, // Show label for 'super' users
          link: item.link,
          comment: item.comment,
          status: item.status,
        };
      } else {
        // Handle the case where labelId is null
        return {
          _id: item._id,
          labelId: null, // Set labelId to null
          label: "Unknown", // Provide a default label
          link: item.link,
          comment: item.comment,
          status: item.status,
        };
      }
    });

    return {
      data: formattedData,
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
  'copyrights-paginated',
  300 // 5 minutes cache
);

export const dynamic = 'force-dynamic';

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
    
    const result = await getCachedCopyrights(page, limit, search);
    
    return NextResponse.json({
      success: true,
      message: "copyright data found",
      ...result
    });
  } catch (error: any) {
    console.error("Error fetching copyrights:", error);
    return NextResponse.json({
      status: 500,
      message: error.message,
      success: false,
    });
  }
}
