import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";

import {  NextResponse } from "next/server";

export async function GET() {
  await connect();

  try {
    const EmployeeData = await Employee.find().select(
      "_id fullName officialEmail phoneNumber role department status salary"
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
