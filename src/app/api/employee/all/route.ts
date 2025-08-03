import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";
import { NextRequest, NextResponse } from "next/server";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached employees query with pagination
const getCachedEmployees = createCachedQuery(
  async (page: number, limit: number, search?: string) => {
    await connect();
    
    const skip = (page - 1) * limit;
    let query: any = {};
    
    // Add search functionality
    if (search && search.trim() !== '') {
      query = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { officialEmail: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
          { role: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalCount = await Employee.countDocuments(query);
    
    // Get paginated data
    const employees = await Employee.find(query)
      .select("_id fullName officialEmail phoneNumber role department status salary")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    return {
      data: employees,
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
  'employees-paginated',
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
    
    const result = await getCachedEmployees(page, limit, search);

    if (!result.data?.length) {
      return NextResponse.json({
        status: 404,
        message: "No employees found",
        success: false,
        pagination: result.pagination
      });
    }

    return NextResponse.json({
      success: true,
      message: "Employees fetched successfully",
      ...result
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
}
