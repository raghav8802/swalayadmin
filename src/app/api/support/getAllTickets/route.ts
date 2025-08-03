import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Support from "@/models/Support";
import SupportReply from "@/models/SupportReply";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached support tickets query with pagination
const getCachedSupportTickets = createCachedQuery(
  async (page: number, limit: number, search?: string) => {
    await connect();
    
    const skip = (page - 1) * limit;
    let matchStage: any = {};
    
    // Add search functionality
    if (search && search.trim() !== '') {
      matchStage = {
        $or: [
          { subject: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
          { ticketId: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalCountPipeline = [];
    if (Object.keys(matchStage).length > 0) {
      totalCountPipeline.push({ $match: matchStage });
    }
    totalCountPipeline.push({ $count: "total" });
    
    const countResult = await Support.aggregate(totalCountPipeline);
    const totalCount = countResult.length > 0 ? countResult[0].total : 0;
    
    // Build aggregation pipeline
    const pipeline = [];
    
    // Add match stage if search is provided
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }
    
    pipeline.push(
      {
        $lookup: {
          from: "supportreplies",
          let: { supportId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$supportId", "$$supportId"] } } },
            {
              $group: {
                _id: null,
                totalReplies: { $sum: 1 },
                unreadReplies: {
                  $sum: {
                    $cond: [
                      { $and: [
                        { $eq: ["$senderType", "user"] },
                        { $eq: ["$isRead", false] }
                      ]},
                      1,
                      0
                    ]
                  }
                }
              }
            }
          ],
          as: "replyStats"
        }
      },
      {
        $addFields: {
          replyCount: { $ifNull: [{ $arrayElemAt: ["$replyStats.totalReplies", 0] }, 0] },
          unreadReplies: { $ifNull: [{ $arrayElemAt: ["$replyStats.unreadReplies", 0] }, 0] },
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "in-progress"] }, then: 2 },
                { case: { $eq: ["$status", "resolved"] }, then: 3 }
              ],
              default: 4
            }
          }
        },
      },
      { $sort: { statusOrder: 1 as const, createdAt: -1 as const } },
      { $skip: skip },
      { $limit: limit }
    );
    
    const tickets = await Support.aggregate(pipeline).allowDiskUse(true);
    
    
    return {
      data: tickets,
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
  'support-tickets-paginated',
  120 // 2 minutes cache for support tickets
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
    
    const result = await getCachedSupportTickets(page, limit, search);
    
    return NextResponse.json({
      success: true,
      message: "Support tickets fetched successfully",
      ...result
    });
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
