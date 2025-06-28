import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import Label from "@/models/Label";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, subject, message, priority = 'medium', category = 'general' } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields: email, subject, and message are required" 
      });
    }

    // Find user in Label schema by email
    const user = await Label.findOne({ email: email });
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found with this email address. Please check the email or create a user account first." 
      });
    }

    // Use the found user's data
    const name = user.username;
    const labelId = user._id.toString();

    const newTicket = new Support({
      name,
      email,
      labelId,
      subject,
      message,
      priority,
      category,
      status: 'pending',
      isClosed: false
    });

    await newTicket.save();

    return NextResponse.json({ 
      success: true, 
      data: newTicket,
      message: "Support ticket created successfully"
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error" 
    });
  }
} 