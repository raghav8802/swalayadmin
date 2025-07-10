import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import SentEmail from "@/models/SentEmail";

export async function GET(req: NextRequest) {
  await connect();
  try {
    const { searchParams } = new URL(req.url!);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;
    const total = await SentEmail.countDocuments();
    const emails = await SentEmail.find({}, "recipients subject sentAt _id html")
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    return NextResponse.json({ success: true, data: emails, total, page, limit });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || "Server error" }, { status: 500 });
  }
} 