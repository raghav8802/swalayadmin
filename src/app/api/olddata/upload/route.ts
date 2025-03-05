// import { NextRequest, NextResponse } from "next/server";
// import { connect } from "@/dbConfig/dbConfig";
// import oldData from "@/models/oldData";
// import fs from "fs";
// import path from "path";
// import Papa from "papaparse";

// export async function POST(request: NextRequest) {
//   await connect();

//   try {
//     // Parse the request body as JSON
//     const body = await request.json();
//     const { type } = body;

//     if (type === "upload") {
//         console.log("start ing ...");
        
//       // Path to the CSV file in the public folder
//       const filePath = path.join(process.cwd(), "public", "data", "swalay_old_data.csv");

//       // Read the CSV file
//       const file = fs.readFileSync(filePath, "utf8");

//       // Parse the CSV data
//       const parsedData = Papa.parse(file, {
//         header: true,
//         dynamicTyping: true,
//       }).data;

//       const filteredData = parsedData.filter(
//         (row: any) => row.Stats !== "Taken Down"
//       );
      
//       console.log(filteredData);
      

//       // Insert filtered data into MongoDB
//       await oldData.insertMany(filteredData);

//       return NextResponse.json({
//         message: "CSV data uploaded successfully",
//         success: true,
//         status: 200,
//       });
//     } else {
//       return NextResponse.json({
//         message: "Invalid request body",
//         success: false,
//         status: 400,
//       });
//     }
//   } catch (error: any) {
//     console.error("Error uploading CSV data:", error);
//     return NextResponse.json({
//       message: "An error occurred while uploading CSV data",
//       success: false,
//       status: 500,
//       error: error.message,
//     });
//   }
// }