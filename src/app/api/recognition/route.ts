import axios from 'axios';

const uploadFile = async (fileUrl: string) => {
  const api1_url = "https://api-v2.acrcloud.com/api/fs-containers/14982/files";
  const api1_headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI3IiwianRpIjoiYmUwOWUyZjUwYTU1MjhhNWQ2ZGQwNmQwOGYzZTQ0YmI0MmYxZDdiNmQ2MGI2NGY3MTZhNTBhNWUwZDQ1YWM0OGQ1YmM0MmI4NWNjOGZlMTUiLCJpYXQiOjE3MjA2OTk3MzYuOTQ5MTA2LCJuYmYiOjE3MjA2OTk3MzYuOTQ5MTEsImV4cCI6MjAzNjIzMjUzNi45MTc4MDMsInN1YiI6IjE0NDA3MCIsInNjb3BlcyI6WyIqIiwid3JpdGUtYWxsIiwicmVhZC1hbGwiLCJidWNrZXRzIiwid3JpdGUtYnVja2V0cyIsInJlYWQtYnVja2V0cyIsImF1ZGlvcyIsIndyaXRlLWF1ZGlvcyIsInJlYWQtYXVkaW9zIiwiY2hhbm5lbHMiLCJ3cml0ZS1jaGFubmVscyIsInJlYWQtY2hhbm5lbHMiLCJiYXNlLXByb2plY3RzIiwid3JpdGUtYmFzZS1wcm9qZWN0cyIsInJlYWQtYmFzZS1wcm9qZWN0cyIsInVjZiIsIndyaXRlLXVjZiIsInJlYWQtdWNmIiwiZGVsZXRlLXVjZiIsImJtLXByb2plY3RzIiwiYm0tY3MtcHJvamVjdHMiLCJ3cml0ZS1ibS1jcy1wcm9qZWN0cyIsInJlYWQtYm0tY3MtcHJvamVjdHMiLCJibS1iZC1wcm9qZWN0cyIsIndyaXRlLWJtLWJkLXByb2plY3RzIiwicmVhZC1ibS1iZC1wcm9qZWN0cyIsImZpbGVzY2FubmluZyIsIndyaXRlLWZpbGVzY2FubmluZyIsInJlYWQtZmlsZXNjYW5uaW5nIiwibWV0YWRhdGEiLCJyZWFkLW1ldGFkYXRhIl19.X-c4bdwYLTxEbojlB3womUyV4z5QC8JS5ptG2XTriGfrZP0bcIi1oHPgIwJLtKdSFWcmF4CVdbQab3tLh9dZALfdq8zcD4vwXuQwrQNcE_xOZeLNI5UfkeRjse1wmPPsLUezMjGfNIqD6r36utNeLBDtH5hcNI_vEtbFI6axJ42ue9ybUZkFoq0iFtHTo2iOm5TB68ItHGHmm9RLF46wuVi-W4AO25DLuPHlO-ZtGE3Mihk0NAFQEGqcIMcnGk1NBA562IiQpUkhp5rREvNS8g4np2EnrH3Ts82w7cadf2C3RweiPHS2TmBNmB8PN9bP8P5SREYk-hhdUSwiA3W5e37_H1ouycuTr1Klzu-DSsOzQyQKGAYONvGVTI0aTT97WMgcqXzQZi39YF0KLakC3V_15Pa2b0yiRUUER97SrdAf_DGPc0g5Pd16m3q_fmOBTfeTN9ucagVnWQMeL_fpT-9voyllI5Ir7fI7XGGQPnLWZID6cO5O-AtYyxqrPyD_muc7VvAx1TRNeTu7X7i4yLK4LtgIUW5zKSeZVltC4dRxCUsUWDYRko6pZBFBDFmJliXAuq5ulOfwuTlAppoxBkoT4wgP_qal7snhNjbkM5qnj4y0K-JbnXg1i4CkrKYTGcgjcjudFjaNcdPqiG9xDYBbN6BkekxD7qDNf7gOvOE', // Replace with your actual Bearer token
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
