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
    const contentType = request.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      // Handle simple JSON form (from main employees page)
      const body = await request.json();
      const { name, email, role } = body;

      const existingEmployee = await Employee.findOne({ personalEmail: email });

      if (existingEmployee) {
        // Update existing employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
          existingEmployee._id,
          {
            fullName: name,
            role: role,
          },
          { new: true }
        );

        return NextResponse.json({
          message: "Employee updated successfully",
          success: true,
          data: updatedEmployee,
        });
      } else {
        // Create new employee with minimal required fields
        const newEmployee = new Employee({
          fullName: name,
          personalEmail: email,
          phoneNumber: "", // Will be filled later
          address: "", // Will be filled later
          aadharCardNumber: "", // Will be filled later
          role: role,
          status: "Active",
          employeeVerification: "Pending",
          ndaSignature: { status: "Pending" },
          workPolicy: { status: "Pending" },
        });

        const savedEmployee = await newEmployee.save();

        return NextResponse.json({
          message: "Employee added successfully",
          success: true,
          data: savedEmployee,
        });
      }
    } else {
      // Handle FormData (from the old comprehensive form)
      const formData = await request.formData();
      const fields: Record<string, any> = {};
      let ndaFileBuffer: Buffer | null = null;
      let workPolicyFileBuffer: Buffer | null = null;
      let ndaFileName: string | null = null;
      let workPolicyFileName: string | null = null;
      let NdaSignatureFile: string | null = null;
      let WorkPolicyFile: string | null = null;

      // Extract fields and files from FormData
      formData.forEach(async (value, key) => {
        if (key === "ndaSignature[status]") {
          fields["ndaSignatureStatus"] = value;
        }
        if (key === "workPolicy[status]") {
          fields["workPolicyStatus"] = value;
        }

        if (key === "ndaSignature[document]" && value instanceof Blob) {
          ndaFileName = `NdaSignature-${Date.now()}-${value.name}`;
          ndaFileBuffer = Buffer.from(await value.arrayBuffer());
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
        status,
        ndaSignatureStatus,
        workPolicyStatus,
        employeeVerification,
        salary,
        type,
      } = fields;

      console.log("in api ");
      console.log({
        ndaSignatureStatus,
        workPolicyStatus,
        employeeVerification,
      });

      const existingEmployee = await Employee.findOne({
        personalEmail: email,
      });

      // Handle file uploads for existing employees
      if (ndaFileBuffer && ndaFileName) {
        console.log("nda");
        
        const retFile = await uploadEmployeeNdaToS3({
          file: ndaFileBuffer,
          fileName: ndaFileName,
        });
        console.log("retFile nda :");
        console.log(retFile);
        if (retFile.status) {
          NdaSignatureFile = `https://swalay-music-files.s3.ap-south-1.amazonaws.com/employees/documents/${retFile.fileName}`;
        }
      }

      if (workPolicyFileBuffer && workPolicyFileName) {
        console.log("work policy");
        
        const retFile = await uploadWorkPolicyToS3({
          file: workPolicyFileBuffer,
          fileName: workPolicyFileName,
        });
        console.log("retFile workPolicyFileName :");
        console.log(retFile);
        if (retFile.status) {
          WorkPolicyFile = `https://swalay-music-files.s3.ap-south-1.amazonaws.com/employees/documents/${retFile.fileName}`;
        }
      }

      if (existingEmployee) {
        // Update existing employee
        const updateFields: Record<string, any> = {
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
          },
          status,
          employeeVerification,
          salary: Number(salary),
          type,
        };

        if (NdaSignatureFile) {
          updateFields.ndaSignature = {
            status: ndaSignatureStatus,
            document: NdaSignatureFile,
          };
        }
        if (WorkPolicyFile) {
          updateFields.workPolicy = {
            status: workPolicyStatus,
            document: WorkPolicyFile,
          };
        }

        await Employee.findByIdAndUpdate(existingEmployee._id, updateFields, {
          new: true,
        });

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
          },
          status,
          ndaSignature: { status: ndaSignatureStatus, document: NdaSignatureFile },
          workPolicy: { status: workPolicyStatus, document: WorkPolicyFile },
          employeeVerification,
          salary: Number(salary),
          type,
        });

        const savedEmployee = await newEmployee.save();

        return NextResponse.json({
          message: "Employee added successfully",
          success: true,
          status: 201,
          data: savedEmployee,
        });
      }
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
