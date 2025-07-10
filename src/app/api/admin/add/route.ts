import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import bcrypt from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(req: Request) {
  try {
    await connect();
    
    const { username, email, password, usertype } = await req.json();

    // Validate required fields
    if (!username || !email || !password || !usertype) {
      return NextResponse.json({
        status: 400,
        message: "All fields are required",
        data: null
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        status: 400,
        message: "Email already exists",
        data: null
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newAdmin = await Admin.create({
      username,
      email,
      password: hashedPassword,
      usertype,
      isVerified: true, // Since this is created by admin
    });

    // Remove sensitive data before sending response
    const adminData = {
      _id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      usertype: newAdmin.usertype,
      isActive: newAdmin.isActive,
      joinedAt: newAdmin.joinedAt,
    };

    return NextResponse.json({
      status: 201,
      message: "Admin user created successfully",
      data: adminData
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to create admin user",
      data: null
    }, { status: 500 });
  }
} 