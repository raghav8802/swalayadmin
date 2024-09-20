import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";


export async function POST(request: NextRequest) {
  await connect();

  try {
    const labelId = request.nextUrl.searchParams.get("labelId");
    if (!labelId) {
      return NextResponse.json({
        message: "Label ID is required",
        success: false,
        status: 400,
      });
    }

    const reqBody = await request.json();
    console.log("reqBody :: ");
    console.log(reqBody);
    
    const { username, email, contact, lable, usertype, state } = reqBody;

    const existingLabel = await Label.findById(labelId);
    if (!existingLabel) {
      return NextResponse.json({
        message: "Label not found",
        success: false,
        status: 404,
      });
    }

    existingLabel.username = username;
    existingLabel.email = email;
    existingLabel.contact = contact;
    existingLabel.lable = lable;
    existingLabel.usertype = usertype;
    existingLabel.state = state;

    await existingLabel.save();

    return NextResponse.json({
      message: "Label updated successfully",
      data: existingLabel,
      success: true,
      status: 200,
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
}