import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
  try {
    await connect();
    
    const users = await Admin.find({})
      .select("-password -verifyCode -verifyCodeExpiry")
      .sort({ joinedAt: -1 });

    return NextResponse.json({
      status: 200,
      message: "Admin users fetched successfully",
      data: users
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to fetch admin users",
      data: null
    }, { status: 500 });
  }
} 