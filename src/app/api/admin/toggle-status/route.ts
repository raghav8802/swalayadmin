import { NextResponse } from "next/server";

import Admin from "@/models/admin";
import { connect } from "@/dbConfig/dbConfig";


export async function POST(req: Request) {
  try {
    await connect();
    
    const { userId, status } = await req.json();

    if (!userId) {
      return NextResponse.json({
        status: 400,
        message: "User ID is required",
        data: null
      }, { status: 400 });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
        data: null
      }, { status: 404 });
    }

    // Update user status
    user.isActive = status;
    await user.save();

    return NextResponse.json({
      status: 200,
      message: "User status updated successfully",
      data: {
        _id: user._id,
        isActive: user.isActive,
      }
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to update user status",
      data: null
    }, { status: 500 });
  }
} 