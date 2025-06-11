import { NextResponse } from "next/server";
import ShemaruUser from "@/models/Shemaroo";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(request: Request) {
  try {
    await connect();
    
    const body = await request.json();
    const { email, password } = body;

    console.log("Login request received shemaroo");
    console.log("Login request body:", body);

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user (include password field)
    const user = await ShemaruUser.findOne({ email }).select(
      "password isActive"
    );

    console.log("User found:", user);

    if (!user) {
      console.log("Invalid email or password.");
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      console.log("User is not active.");
      return NextResponse.json(
        { success: false, message: "User is not active." },
        { status: 403 }
      );
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid email or password.");
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
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error." },
      { status: 500 }
    );

  }
}
