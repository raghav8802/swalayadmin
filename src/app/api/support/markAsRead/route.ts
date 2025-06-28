import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SupportReply from "@/models/SupportReply";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { replyId, isRead } = await req.json();

    if (!replyId || typeof isRead !== 'boolean') {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    const updatedReply = await SupportReply.findByIdAndUpdate(
      replyId,
      { isRead },
      { new: true }
    );

    if (!updatedReply) {
      return NextResponse.json({ 
        success: false, 
        message: "Reply not found" 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedReply,
      message: "Reply status updated successfully"
    });
  } catch (error) {
    console.error('Error updating reply status:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error" 
    });
  }
} 