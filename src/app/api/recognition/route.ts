import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Database connection
import Recognition from "@/models/recognitionModel"; // Add this import

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    const authToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiMzI4NmI1NjE4NTkyZGVkMTJiN2VjMTg1N2RkYWIwOTAxM2Y1NTAzZmI5ZThjYzYzOGEyNjdiNjQ1ZjU1ZDBmMmEzZmM0MDg4NzhlMzI3NTMiLCJpYXQiOjE3NDIxMzI5MzUuNTg1NTU1LCJuYmYiOjE3NDIxMzI5MzUuNTg1NTU4LCJleHAiOjIwNTc2NjU3MzUuNTUwODU2LCJzdWIiOiIxNDQwNzAiLCJzY29wZXMiOlsiKiIsIndyaXRlLWFsbCIsInJlYWQtYWxsIiwiYnVja2V0cyIsIndyaXRlLWJ1Y2tldHMiLCJyZWFkLWJ1Y2tldHMiLCJhdWRpb3MiLCJ3cml0ZS1hdWRpb3MiLCJyZWFkLWF1ZGlvcyIsImNoYW5uZWxzIiwid3JpdGUtY2hhbm5lbHMiLCJyZWFkLWNoYW5uZWxzIiwiYmFzZS1wcm9qZWN0cyIsIndyaXRlLWJhc2UtcHJvamVjdHMiLCJyZWFkLWJhc2UtcHJvamVjdHMiLCJ1Y2YiLCJ3cml0ZS11Y2YiLCJyZWFkLXVjZiIsImRlbGV0ZS11Y2YiLCJibS1wcm9qZWN0cyIsImJtLWNzLXByb2plY3RzIiwid3JpdGUtYm0tY3MtcHJvamVjdHMiLCJyZWFkLWJtLWNzLXByb2plY3RzIiwiYm0tYmQtcHJvamVjdHMiLCJ3cml0ZS1ibS1iZC1wcm9qZWN0cyIsInJlYWQtYm0tYmQtcHJvamVjdHMiLCJmaWxlc2Nhbm5pbmciLCJ3cml0ZS1maWxlc2Nhbm5pbmciLCJyZWFkLWZpbGVzY2FubmluZyIsIm1ldGFkYXRhIiwicmVhZC1tZXRhZGF0YSJdfQ.Eu1rqcNhBflt2k03yeY_XGjmWibVAzqYYhfs_7COOZ-IhgfAmA0HPyeUk8dCXeV1Ykljj6MKtVvBhGInzFn-w2np8zJ88_Bv344ABRepj1UpH9kZzssLyI8NkAyqHFKu15uC1hNUfvGy6_hz8KiSP4Wa7FVf3ulzrhNJgwuIHvTQVpRKrp90z38efQo8J5bsPZG6HWVhsDenhK-481rLxxezB1bjobBT-zh5D5s9Gg6XbdHzkKTliYDaT8f47Ne1mqeX5cPrxON1ms4KWH1tYxYSMgElXoM8oFZOWAIm9Pu0oVOY_HvUZ0DL1DE91ERaE_anZFZhmqC9F0JbfryxttvduVw3hxYj7nfGuGRDFtL9gqteUXF5MbzudQlR2sdu-kWAIT8HdTzNnOJtUitL_ED-YLhvlNaWflJ2r6LYyeMVGR54r3oOnx_GHQ3Eb0LJw1foN3ezawVkPZWki7aFez2Wnu1rRAdzX8cQGHvX4V43zulDCNd2nFf2RlMUBWZSwSO3Ifl-fWNlFfq3DJ3z3LlxTfTX6f4AkPMx8k1goLyRqDkXB4vWGEeQfo6OYDQt4SwXe7BMXVa_LX_x3i_mwZq0JZIrc55MvobI_3m-O4FH9dSYaaK09IQaxOPcirYl-TsGEVdmcgmsQeHeRL2myu9RIRIa2G_ulPvF1-Kd6d0";
    const api1_headers = {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
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

      await sleep(20000);

      // Step 4: Fetch the details of the uploaded file using the file ID
      const api2_url = `https://api-v2.acrcloud.com/api/fs-containers/14982/files/${uploadedFileId}`;
      
      console.log("Fetching details of the uploaded file.");
      const fileDetailResponse = await axios.get(api2_url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });

      const fileDetails = fileDetailResponse.data;
      console.log("File details fetched successfully:", fileDetails);

      // Store the recognition results in the database
      try {
        const recognition = await Recognition.create({
          trackId: trackId,
          fileUrl: fileUrl,
          acrCloudFileId: uploadedFileId,
          recognitionDetails: fileDetails,
          status: 'completed',
          createdAt: new Date()
        });

        // Return success response with file details and database record
        return NextResponse.json({
          message: "File uploaded and details saved successfully",
          fileId: uploadedFileId,
          fileDetails: fileDetails,
          recognitionId: recognition._id,
          success: true,
          status: 201,
        });
      } catch  {
        console.error("Database error:");
        
      }
    } else {
      console.log("File upload failed. Response:", uploadResponseData);
      return NextResponse.json({
        message: "File upload failed",
        data: uploadResponseData,
        success: false,
        status: 500,
      });
    }
  } catch  {
    console.log("Error:", ); 
  }
}
