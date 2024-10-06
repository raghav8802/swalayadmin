import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Database connection

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Get the request body
    const reqBody = await request.json();
    const fileUrl = reqBody.fileUrl as string; // The track URL from the request body
    const trackId = reqBody.trackId;

    // Step 1: Fetch the file from the provided URL
    console.log("Fetching file from URL:", fileUrl);
    const fileResponse = await axios.get(fileUrl, {
      responseType: "arraybuffer", // Fetching the file as binary data
    });

    const fileData = fileResponse.data;

    if (!fileData) {
      throw new Error("Failed to fetch the file from the URL.");
    }

    console.log("File fetched from URL successfully.");

    // Step 2: Upload the file to ACRCloud
    const api1_url = "https://api-v2.acrcloud.com/api/fs-containers/14982/files";
    const api1_headers = {
      Accept: "application/json",
      Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiYmUwOWUyZjUwYTU1MjhhNWQ2ZGQwNmQwOGYzZTQ0YmI0MmYxZDdiNmQ2MGI2NGY3MTZhNTBhNWUwZDQ1YWM0OGQ1YmM0MmI4NWNjOGZlMTUiLCJpYXQiOjE3MjA2OTk3MzYuOTQ5MTA2LCJuYmYiOjE3MjA2OTk3MzYuOTQ5MTEsImV4cCI6MjAzNjIzMjUzNi45MTc4MDMsInN1YiI6IjE0NDA3MCIsInNjb3BlcyI6WyIqIiwid3JpdGUtYWxsIiwicmVhZC1hbGwiLCJidWNrZXRzIiwid3JpdGUtYnVja2V0cyIsInJlYWQtYnVja2V0cyIsImF1ZGlvcyIsIndyaXRlLWF1ZGlvcyIsInJlYWQtYXVkaW9zIiwiY2hhbm5lbHMiLCJ3cml0ZS1jaGFubmVscyIsInJlYWQtY2hhbm5lbHMiLCJiYXNlLXByb2plY3RzIiwid3JpdGUtYmFzZS1wcm9qZWN0cyIsInJlYWQtYmFzZS1wcm9qZWN0cyIsInVjZiIsIndyaXRlLXVjZiIsInJlYWQtdWNmIiwiZGVsZXRlLXVjZiIsImJtLXByb2plY3RzIiwiYm0tY3MtcHJvamVjdHMiLCJ3cml0ZS1ibS1jcy1wcm9qZWN0cyIsInJlYWQtYm0tY3MtcHJvamVjdHMiLCJibS1iZC1wcm9qZWN0cyIsIndyaXRlLWJtLWJkLXByb2plY3RzIiwicmVhZC1ibS1iZC1wcm9qZWN0cyIsImZpbGVzY2FubmluZyIsIndyaXRlLWZpbGVzY2FubmluZyIsInJlYWQtZmlsZXNjYW5uaW5nIiwibWV0YWRhdGEiLCJyZWFkLW1ldGFkYXRhIl19.X-c4bdwYLTxEbojlB3womUyV4z5QC8JS5ptG2XTriGfrZP0bcIi1oHPgIwJLtKdSFWcmF4CVdbQab3tLh9dZALfdq8zcD4vwXuQwrQNcE_xOZeLNI5UfkeRjse1wmPPsLUezMjGfNIqD6r36utNeLBDtH5hcNI_vEtbFI6axJ42ue9ybUZkFoq0iFtHTo2iOm5TB68ItHGHmm9RLF46wuVi-W4AO25DLuPHlO-ZtGE3Mihk0NAFQEGqcIMcnGk1NBA562IiQpUkhp5rREvNS8g4np2EnrH3Ts82w7cadf2C3RweiPHS2TmBNmB8PN9bP8P5SREYk-hhdUSwiA3W5e37_H1ouycuTr1Klzu-DSsOzQyQKGAYONvGVTI0aTT97WMgcqXzQZi39YF0KLakC3V_15Pa2b0yiRUUER97SrdAf_DGPc0g5Pd16m3q_fmOBTfeTN9ucagVnWQMeL_fpT-9voyllI5Ir7fI7XGGQPnLWZID6cO5O-AtYyxqrPyD_muc7VvAx1TRNeTu7X7i4yLK4LtgIUW5zKSeZVltC4dRxCUsUWDYRko6pZBFBDFmJliXAuq5ulOfwuTlAppoxBkoT4wgP_qal7snhNjbkM5qnj4y0K-JbnXg1i4CkrKYTGcgjcjudFjaNcdPqiG9xDYBbN6BkekxD7qDNf7gOvOE", // Replace with your actual Bearer token
      "Content-Type": "multipart/form-data",
    };

    // Prepare the form data (similar to PHP's `CURLFILE`)
    const formData = new FormData();
    formData.append("file", new Blob([fileData]), "track.mp3"); // Binary data and filename
    formData.append("data_type", "audio");

    // Step 3: Upload to ACRCloud
    console.log("Uploading file to ACRCloud.");
    const uploadResponse = await axios.post(api1_url, formData, {
      headers: api1_headers,
    });

    const uploadResponseData = uploadResponse.data;
    console.log("Response from ACRCloud after file upload:", uploadResponseData);

    if (uploadResponseData?.data?.id) {
      const uploadedFileId = uploadResponseData.data.id; // Save the uploaded file's ID
      console.log("File uploaded successfully. File ID:", uploadedFileId);

      // Step 4: Fetch the details of the uploaded file using the file ID
      const api2_url = `https://api-v2.acrcloud.com/api/fs-containers/14982/files/${uploadedFileId}`;
      
      console.log("Fetching details of the uploaded file.");
      const fileDetailResponse = await axios.get(api2_url, {
        headers: {
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiYmUwOWUyZjUwYTU1MjhhNWQ2ZGQwNmQwOGYzZTQ0YmI0MmYxZDdiNmQ2MGI2NGY3MTZhNTBhNWUwZDQ1YWM0OGQ1YmM0MmI4NWNjOGZlMTUiLCJpYXQiOjE3MjA2OTk3MzYuOTQ5MTA2LCJuYmYiOjE3MjA2OTk3MzYuOTQ5MTEsImV4cCI6MjAzNjIzMjUzNi45MTc4MDMsInN1YiI6IjE0NDA3MCIsInNjb3BlcyI6WyIqIiwid3JpdGUtYWxsIiwicmVhZC1hbGwiLCJidWNrZXRzIiwid3JpdGUtYnVja2V0cyIsInJlYWQtYnVja2V0cyIsImF1ZGlvcyIsIndyaXRlLWF1ZGlvcyIsInJlYWQtYXVkaW9zIiwiY2hhbm5lbHMiLCJ3cml0ZS1jaGFubmVscyIsInJlYWQtY2hhbm5lbHMiLCJiYXNlLXByb2plY3RzIiwid3JpdGUtYmFzZS1wcm9qZWN0cyIsInJlYWQtYmFzZS1wcm9qZWN0cyIsInVjZiIsIndyaXRlLXVjZiIsInJlYWQtdWNmIiwiZGVsZXRlLXVjZiIsImJtLXByb2plY3RzIiwiYm0tY3MtcHJvamVjdHMiLCJ3cml0ZS1ibS1jcy1wcm9qZWN0cyIsInJlYWQtYm0tY3MtcHJvamVjdHMiLCJibS1iZC1wcm9qZWN0cyIsIndyaXRlLWJtLWJkLXByb2plY3RzIiwicmVhZC1ibS1iZC1wcm9qZWN0cyIsImZpbGVzY2FubmluZyIsIndyaXRlLWZpbGVzY2FubmluZyIsInJlYWQtZmlsZXNjYW5uaW5nIiwibWV0YWRhdGEiLCJyZWFkLW1ldGFkYXRhIl19.X-c4bdwYLTxEbojlB3womUyV4z5QC8JS5ptG2XTriGfrZP0bcIi1oHPgIwJLtKdSFWcmF4CVdbQab3tLh9dZALfdq8zcD4vwXuQwrQNcE_xOZeLNI5UfkeRjse1wmPPsLUezMjGfNIqD6r36utNeLBDtH5hcNI_vEtbFI6axJ42ue9ybUZkFoq0iFtHTo2iOm5TB68ItHGHmm9RLF46wuVi-W4AO25DLuPHlO-ZtGE3Mihk0NAFQEGqcIMcnGk1NBA562IiQpUkhp5rREvNS8g4np2EnrH3Ts82w7cadf2C3RweiPHS2TmBNmB8PN9bP8P5SREYk-hhdUSwiA3W5e37_H1ouycuTr1Klzu-DSsOzQyQKGAYONvGVTI0aTT97WMgcqXzQZi39YF0KLakC3V_15Pa2b0yiRUUER97SrdAf_DGPc0g5Pd16m3q_fmOBTfeTN9ucagVnWQMeL_fpT-9voyllI5Ir7fI7XGGQPnLWZID6cO5O-AtYyxqrPyD_muc7VvAx1TRNeTu7X7i4yLK4LtgIUW5zKSeZVltC4dRxCUsUWDYRko6pZBFBDFmJliXAuq5ulOfwuTlAppoxBkoT4wgP_qal7snhNjbkM5qnj4y0K-JbnXg1i4CkrKYTGcgjcjudFjaNcdPqiG9xDYBbN6BkekxD7qDNf7gOvOE`, // Replace with your actual Bearer token
          Accept: "application/json",
        },
      });

      const fileDetails = fileDetailResponse.data;
      console.log("File details fetched successfully:", fileDetails);

      // Return success response with file details
      return NextResponse.json({
        message: "File uploaded and details fetched successfully",
        fileId: uploadedFileId,
        fileDetails: fileDetails,
        success: true,
        status: 201,
      });
    } else {
      console.log("File upload failed. Response:", uploadResponseData);
      return NextResponse.json({
        message: "File upload failed",
        data: uploadResponseData,
        success: false,
        status: 500,
      });
    }
  } catch (error: any) {
    console.log("Error:", error.message); // Log the error  
    return NextResponse.json(
      {
        error: error.message || "An unknown error occurred",
        success: false,
        status: 500,
      },
      { status: 500 }
    );
  }
}
