import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Lead from "@/models/leadModel";
import { createCachedQuery, createCachedResponse, generateCacheKey } from '@/lib/cache';

// Cached leads query with pagination
const getCachedLeads = createCachedQuery(
  async (page: number, limit: number, search?: string) => {
    await connect();
    
    const skip = (page - 1) * limit;
    let query: any = {};
    
    // Add search functionality
    if (search && search.trim() !== '') {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { labelName: { $regex: search, $options: 'i' } },
          { contactNo: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalCount = await Lead.countDocuments(query);
    
    // Get paginated data
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return {
      data: leads,
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
  'leads-paginated',
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
            return NextResponse.json(
                { 
                    success: false,
                    message: "Invalid pagination parameters. Page must be >= 1, limit must be between 1-100" 
                },
                { status: 400 }
            );
        }
        
        const result = await getCachedLeads(page, limit, search);
        
        return NextResponse.json({
            success: true,
            message: "Leads fetched successfully",
            ...result
        });
    } catch (error: any) {
        console.error("Error fetching leads:", error);
        return NextResponse.json(
            { 
                success: false,
                error: error.message 
            },
            { status: 500 }
        );
    }
} 