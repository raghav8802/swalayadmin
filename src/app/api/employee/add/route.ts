import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";
import {
  uploadEmployeeNdaToS3,
  uploadWorkPolicyToS3,
} from "@/dbConfig/uploadFileToS3";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const formData = await request.formData(); // Parse incoming FormData
    const fields: Record<string, any> = {};
    let ndaFileBuffer: Buffer | null = null;
    let workPolicyFileBuffer: Buffer | null = null;
    let ndaFileName: string | null = null;
    let workPolicyFileName: string | null = null;

    // Extract fields and files from FormData
    formData.forEach(async (value, key) => {
      if (key === "ndaSignature[document]" && value instanceof Blob) {
        ndaFileName = `NdaSignature-${Date.now()}-${value.name}`; 
        ndaFileBuffer = Buffer.from(await value.arrayBuffer()); // Now this works because it's inside an async function
      } else if (key === "workPolicy[document]" && value instanceof Blob) {
        workPolicyFileName = `WorkPolicy-${Date.now()}-${value.name}`;
        workPolicyFileBuffer = Buffer.from(await value.arrayBuffer());
      } else {
        fields[key] = value;
      }
    });

    const {
      name,
      email,
      officialEmail,
      userType,
      role,
      phone,
      address,
      dob,
      aadhar,
      pan,
      bankAccount,
      ifsc,
      bank,
      branch,
      joiningDate,
      department,
      manager,
      managerContact,
      status,
    } = fields;
    console.log("in api ");
    console.log({
      name,
      email,
      officialEmail,
      userType,
      role,
      phone,
      address,
      dob,
      aadhar,
      pan,
      bankAccount,
      ifsc,
      bank,
      branch,
      joiningDate,
      department,
      manager,
      managerContact,
      status,
    });
    
    

    const existingEmployee = await Employee.findOne({
      personalEmail: email,
    });

    if (existingEmployee) {
      // Update existing employee
      const updatedEmployee = await Employee.findByIdAndUpdate(
        existingEmployee._id,
        {
          fullName: name,
          personalEmail: email,
          officialEmail,
          phoneNumber: phone,
          address,
          dateOfBirth: dob,
          aadharCardNumber: aadhar,
          panCardNumber: pan,
          bankAccountNumber: bankAccount,
          ifscCode: ifsc,
          bank,
          branch,
          joiningDate,
          role,
          department,
          manager: {
            name: manager,
            contact: managerContact,
          },
          status,
        }
      );

      // Handle file uploads for existing employees
      if (ndaFileBuffer && ndaFileName) {
        await uploadEmployeeNdaToS3({
          file: ndaFileBuffer, // Pass the file buffer as 'file'
          fileName: ndaFileName, // Pass the file name as 'fileName'
        });
      }
      if (workPolicyFileBuffer && workPolicyFileName) {
        await uploadWorkPolicyToS3({
          file: workPolicyFileBuffer, // Pass the file buffer as 'file'
          fileName: workPolicyFileName, // Pass the file name as 'fileName'
        });
      }

      return NextResponse.json({
        message: "Employee data updated",
        success: true,
        status: 200,
      });
    } else {
      // Add new employee
      const newEmployee = new Employee({
        fullName: name,
        personalEmail: email,
        officialEmail,
        phoneNumber: phone,
        address,
        dateOfBirth: dob,
        aadharCardNumber: aadhar,
        panCardNumber: pan,
        bankAccountNumber: bankAccount,
        ifscCode: ifsc,
        bank,
        branch,
        joiningDate,
        role,
        department,
        manager: {
          name: manager,
          contact: managerContact,
        },
        status,
      });

      // Save the employee before uploading files
      const savedEmployee = await newEmployee.save();

      // Handle file uploads for new employees
      if (ndaFileBuffer && ndaFileName) {
        await uploadEmployeeNdaToS3({
          file: ndaFileBuffer, // Pass the file buffer as 'file'
          fileName: ndaFileName, // Pass the file name as 'fileName'
        });
      }
      if (workPolicyFileBuffer && workPolicyFileName) {
        await uploadWorkPolicyToS3({
          file: workPolicyFileBuffer, // Pass the file buffer as 'file'
          fileName: workPolicyFileName, // Pass the file name as 'fileName'
        });
      }

      return NextResponse.json({
        message: "Employee added successfully",
        success: true,
        status: 201,
        data: savedEmployee,
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
