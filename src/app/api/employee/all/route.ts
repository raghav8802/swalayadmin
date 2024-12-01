import { connect } from "@/dbConfig/dbConfig";
import Admin from "@/models/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const UserData = await Admin.find().select(
      "_id username email usertype isActive"
    );

    if (!UserData) {
      return NextResponse.json({
        status: 404,
        message: "User not found",
        success: false,
      });
    }

    return NextResponse.json({
      status: 200,
      data: UserData,
      message: "User found successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error verifying token or finding user", error);

    return NextResponse.json({
      status: 500,
      message: "Internal server error",
      success: false,
    });

  }
}
