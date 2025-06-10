import { NextResponse } from "next/server";
import ShemaruUser from "@/models/Shemaroo";
import { connect } from "@/dbConfig/dbConfig";

export async function GET() {
  try {
    await connect();
    // Fetch all users, exclude password, sort by createdAt descending
    const users = await ShemaruUser.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, status: 200, data:users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Server error." }, { status: 500 });
  }
}
