import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import Youtube from "@/models/youtube";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connect();

  try {

    const copyrightsData = await Youtube.find({ status: false })
    .populate({
      path: "labelId",
      select: "username lable usertype", // Select username, label, and usertype from the Label model
      model: Label,
    });

  // Format the response with conditional label value based on usertype
  const formattedData = copyrightsData.map((item: any) => ({
    _id: item._id,
    labelId: item.labelId._id, // Keep labelId
    label: item.labelId.usertype === 'normal' 
              ? item.labelId.username // Show username for 'normal' users
              : item.labelId.lable,    // Show label for 'super' users
    link: item.link,
    comment: item.comment,
    status: item.status,
  }));

    return NextResponse.json({
      message: "copyright data found",
      success: true,
      status: 200,
      data: formattedData,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error.message,
      success: false,
    });
  }
}
