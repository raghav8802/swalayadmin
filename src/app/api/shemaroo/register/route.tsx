import { NextResponse } from "next/server";

import ShemaruUser from "@/models/Shemaroo";
import { connect } from "@/dbConfig/dbConfig";


export async function POST(request: Request) {
  try {
    
    await connect();

    const body = await request.json();
    const { email, password, role } = body;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json({ success: false, message: "All fields are required." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await ShemaruUser.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists." }, { status: 409 });
    }

    // Create new user
    const newUser = new ShemaruUser({ email, password,isActive: role === "active" ? true : false });
    console.log("New User:", newUser);
    await newUser.save();

    // Optionally, you can add role handling here if your schema supports it

    return NextResponse.json({ success: true, message: "User registered successfully." }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Server error." }, { status: 500 });
  }
}
