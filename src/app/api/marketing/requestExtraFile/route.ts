import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Marketing from "@/models/Marketing";

export async function POST(request: NextRequest) {
  console.log("herer");

  await connect();
  console.log("herer s");

  try {
    const reqBody = await request.json();

    console.log(reqBody);

    const { marketingId, message } = reqBody;
    const result = await Marketing.findByIdAndUpdate(
      marketingId,
      { comment: message, isExtraFileRequested: true },
      { new: true }
    );

    console.log(result);

    if (result) {
      return NextResponse.json({
        message: "Extra file requested",
        success: true,
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: "Invalid markeitng id",
        success: false,
        status: 400,
      });
    }

    
  } catch (error: any) {
    console.log("error :: ");
    console.log(error);

    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
}
