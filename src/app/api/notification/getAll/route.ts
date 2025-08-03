import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Notification from "@/models/notification";
import Label from "@/models/Label";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached notifications query with pagination
const getCachedNotifications = createCachedQuery(
  async (page: number, limit: number, search?: string) => {
    await connect();

    const skip = (page - 1) * limit;
    let query: any = {};
    
    // Add search functionality
    if (search && search.trim() !== '') {
      query = {
        $or: [
          { message: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { toAll: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get total count for pagination
    const totalCount = await Notification.countDocuments(query);

    // Fetch paginated notifications from the database
    const notifications = await Notification.find(query)
      .sort({_id: -1})
      .skip(skip)
      .limit(limit)
      .lean();

    // Process each notification to replace label IDs with usernames or label names
    const updatedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        // Replace the labels array with usernames or label names
        if (notification.labels && notification.labels.length > 0) {
          const labelsWithNames = await Promise.all(
            notification.labels.map(async (labelId: any) => {
              const label:any = await Label.findById(labelId).select('username lable usertype').lean();
            
              if (label) {
                // If usertype is 'normal', use username, otherwise use lable
                return label.usertype === "normal" ? label.username : label.lable;
              }

              return null; // Handle case if label is not found
            })
          );

          // Filter out any null values in case any label wasn't found
          notification.labels = labelsWithNames.filter((name) => name !== null);
        }

        return notification;
      })
    );

    return {
      data: updatedNotifications,
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
  'notifications-paginated',
  180 // 3 minutes cache
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
    
    const result = await getCachedNotifications(page, limit, search);
    
    return NextResponse.json({
      success: true,
      message: "Notifications fetched and updated successfully",
      ...result
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
