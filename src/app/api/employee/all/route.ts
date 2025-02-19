import { connect } from "@/dbConfig/dbConfig";
import Admin from "@/models/admin";
import Employee from "@/models/Employee";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {
    const EmployeeData = await Employee.find().select(
      "_id fullName officialEmail phoneNumber role department status"
    );

    if (!EmployeeData) {
      return NextResponse.json({
        status: 404,
        message: "No not found",
        success: false,
      });
    }
    

    return NextResponse.json({
      status: 200,
      data: EmployeeData,
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
