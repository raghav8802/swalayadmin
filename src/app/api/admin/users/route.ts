import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import { connect } from "@/dbConfig/dbConfig";
import { createCachedQuery, createCachedResponse } from '@/lib/cache';

// Cached admin users query
const getCachedAdminUsers = createCachedQuery(
  async () => {
    await connect();
    
    return await Admin.find({})
      .select("-password -verifyCode -verifyCodeExpiry")
      .sort({ joinedAt: -1 })
      .lean();
  },
  'admin-users',
  600 // 10 minutes cache
);

export async function GET() {
  try {
    const users = await getCachedAdminUsers();
    return createCachedResponse(users, "Admin users fetched successfully", 600);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch admin users",
      success: false,
      data: null
    }, { status: 500 });
  }
} 