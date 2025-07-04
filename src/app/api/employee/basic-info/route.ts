import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const body = await request.json();
    const { fullName, personalEmail, phoneNumber, address, dateOfBirth, aadharCardNumber, panCardNumber } = body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ personalEmail });

    if (existingEmployee) {
      // Update existing employee with only basic info
      const updatedEmployee = await Employee.findByIdAndUpdate(
        existingEmployee._id,
        {
          fullName,
          personalEmail,
          phoneNumber,
          address,
          dateOfBirth,
          aadharCardNumber,
          panCardNumber,
        },
        { new: true, runValidators: false }
      );

      return NextResponse.json({
        message: "Basic info updated successfully",
        success: true,
        data: updatedEmployee,
        employeeId: updatedEmployee._id,
      });
    } else {
      // Create new employee with only basic info (required fields)
      const newEmployee = new Employee({
        fullName,
        personalEmail,
        phoneNumber,
        address,
        dateOfBirth,
        aadharCardNumber,
        panCardNumber,
        // Set default values for optional fields to avoid validation issues
        status: "Active",
        employeeVerification: "Pending",
        ndaSignature: { status: "Pending" },
        workPolicy: { status: "Pending" },
      });

      const savedEmployee = await newEmployee.save();

      return NextResponse.json({
        message: "Employee created with basic info",
        success: true,
        data: savedEmployee,
        employeeId: savedEmployee._id,
      });
    }
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
      "fullName personalEmail phoneNumber address dateOfBirth aadharCardNumber panCardNumber"
    );

    if (!employee) {
      return NextResponse.json({
        error: "Employee not found",
        success: false,
        status: 404,
      });
    }

    return NextResponse.json({
      message: "Basic info retrieved successfully",
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