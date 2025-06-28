import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import SupportReply from "@/models/SupportReply";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { ticketId, message, senderType, senderId, senderName } = await req.json();

    if (!ticketId || !message || !senderType || !senderId || !senderName) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    // Check if ticket exists and is not closed
    const ticket = await Support.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ 
        success: false, 
        message: "Ticket not found" 
      });
    }

    if (ticket.isClosed) {
      return NextResponse.json({ 
        success: false, 
        message: "Cannot reply to closed ticket" 
      });
    }

    // Create new reply
    const newReply = new SupportReply({
      supportId: ticketId,
      senderType,
      senderId,
      senderName,
      message,
      isRead: false
    });

    await newReply.save();

    // Update ticket status to in-progress if it was pending
    if (ticket.status === 'pending') {
      await Support.findByIdAndUpdate(ticketId, { status: 'in-progress' });
    }

    return NextResponse.json({ 
      success: true, 
      data: newReply,
      message: "Reply sent successfully"
    });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error" 
    });
  }
} 