import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const body = await request.json();
    const { 
      employeeId, 
      officialEmail, 
      joiningDate, 
      role, 
      department, 
      type, 
      salary, 
      manager, 
      status 
    } = body;

    if (!employeeId) {
      return NextResponse.json({
        error: "Employee ID is required",
        success: false,
        status: 400,
      });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      {
        officialEmail,
        joiningDate,
        role,
        department,
        type,
        salary: Number(salary),
        manager: {
          name: manager,
        },
        status,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json({
        error: "Employee not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Official details updated successfully",
      success: true,
      data: updatedEmployee,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json({
        error: "Employee ID is required",
        success: false,
        status: 400,
      });
    }

    const employee = await Employee.findById(employeeId).select(
      "officialEmail joiningDate role department type salary manager status"
    );

    if (!employee) {
      return NextResponse.json({
        error: "Employee not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Official details retrieved successfully",
      success: true,
      data: employee,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
} 