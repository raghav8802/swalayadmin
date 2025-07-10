import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Employee from "@/models/Employee";
import { uploadEmployeeNdaToS3, uploadWorkPolicyToS3 } from "@/dbConfig/uploadFileToS3";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const formData = await request.formData();
    const employeeId = formData.get("employeeId") as string;
    const documentType = formData.get("documentType") as string; // "nda" or "workPolicy"
    const file = formData.get("file") as File;

    if (!employeeId || !documentType || !file) {
      return NextResponse.json({
        error: "Employee ID, document type, and file are required",
        success: false,
        status: 400,
      });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${documentType === 'nda' ? 'NdaSignature' : 'WorkPolicy'}-${timestamp}-${file.name}`;

    let uploadResult;

    // Upload to S3 based on document type
    if (documentType === "nda") {
      uploadResult = await uploadEmployeeNdaToS3({
        file: buffer,
        fileName: fileName,
      });
    } else if (documentType === "workPolicy") {
      uploadResult = await uploadWorkPolicyToS3({
        file: buffer,
        fileName: fileName,
      });
    } else {
      return NextResponse.json({
        error: "Invalid document type",
        success: false,
        status: 400,
      });
    }

    if (!uploadResult.status) {
      return NextResponse.json({
        error: "Failed to upload file to S3",
        success: false,
        status: 500,
      });
    }

    // Generate S3 URL using the actual filename returned from S3 upload
    const s3Url = `https://${process.env.NEXT_PUBLIC_AWS_S3_FOLDER_PATH}/employees/documents/${uploadResult.fileName}`;

    // Update employee record with document URL and filename
    const updateData: any = {};
    if (documentType === "nda") {
      updateData.ndaSignature = {
        status: "Completed",
        document: s3Url,
        fileName: uploadResult.fileName, // Store the actual filename
      };
    } else if (documentType === "workPolicy") {
      updateData.workPolicy = {
        status: "Completed",
        document: s3Url,
        fileName: uploadResult.fileName, // Store the actual filename
      };
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
      message: "Document uploaded successfully",
      success: true,
      data: {
        documentUrl: s3Url,
        fileName: uploadResult.fileName,
      },
    });
  } catch (error: any) {
    console.error("Error uploading document:", error.message);
    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
} 