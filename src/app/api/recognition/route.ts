import axios from 'axios';

const uploadFile = async (fileUrl: string) => {
  const api1_url = "https://api-v2.acrcloud.com/api/fs-containers/14982/files";
  const api1_headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer , // Replace with your actual Bearer token
    'Content-Type': 'application/json'
  };

  try {
    console.log("Sending file URL to ACRCloud:", fileUrl); // Log the file URL

    // Prepare the request body with the file URL as 'file'
    const requestBody = {
      file: fileUrl, // Send the file URL directly as 'file'
      data_type: 'audio'
    };

    // Send POST request to ACRCloud
    const response = await axios.post(api1_url, requestBody, { headers: api1_headers });

    const responseData = response.data;
    console.log("Response from ACRCloud:", responseData); // Log the response

    // Check if the file ID exists in the response
    if (responseData?.data?.id) {
      const uploadedFileId = responseData.data.id; // Save the uploaded file's ID in a variable
      console.log("File uploaded successfully. File ID:", uploadedFileId);
      return uploadedFileId;
    } else {
      console.log("File upload failed. Response:", responseData);
      return null; // Return null in case of failure
    }
  } catch (error: any) {
    // Capture and log more detailed error responses
    if (error.response) {
      console.error("Error response from API:", error.response.data);
      alert(`Error: ${error.response.data.error || 'Unknown error occurred.'}`);
    } else {
      console.error("Error uploading file:", error.message);
      alert(`Error: ${error.message}`);
    }
    return null; // Return null on error
  }
};

export default uploadFile;
