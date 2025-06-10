import { NextResponse } from "next/server";
import ShemaruUser from "@/models/Shemaroo";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(request: Request) {
  try {
    await connect();
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user (include password field)
    const user = await ShemaruUser.findOne({ email }).select(
      "+password isActive"
    );
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "User is not active." },
        { status: 403 }
      );
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
          data: {
            email: user.email,
            isActive: user.isActive,
            _id: user._id.toString(),
          },
        },
        { status: 401 }
      );
    }

    // Success (you can add JWT or session logic here if needed)
    return NextResponse.json({ success: true, message: "Login successful." });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error." },
      { status: 500 }
    );
  }
}
