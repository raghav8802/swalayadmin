import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const body = await request.json();
    const { 
      employeeId, 
      employeeVerification, 
      ndaSignature, 
      workPolicy 
    } = body;

    if (!employeeId) {
      return NextResponse.json({
        error: "Employee ID is required",
        success: false,
        status: 400,
      });
    }

    const updateData: any = {
      employeeVerification,
    };

    if (ndaSignature) {
      updateData.ndaSignature = ndaSignature;
    }

    if (workPolicy) {
      updateData.workPolicy = workPolicy;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
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
      message: "Documentation updated successfully",
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
      "employeeVerification ndaSignature workPolicy"
    );

    if (!employee) {
      return NextResponse.json({
        error: "Employee not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Documentation retrieved successfully",
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