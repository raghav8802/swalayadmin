import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";

export async function GET(req: NextRequest) {
  await connect();
  

  const employeeId = req.nextUrl.searchParams.get("employeeId");

  console.log("employeeId : ", employeeId);

  try {
    const data = await Employee.findById(employeeId);

    if (!employeeId) {
      return NextResponse.json({
        message: "please provide employeeId",
        success: true,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Employee details fetched",
      success: true,
      status: 200,
      data: data,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);

    return NextResponse.json({
      message: "Internal server down",
      success: false,
      status: 500,
    });
  }
}
