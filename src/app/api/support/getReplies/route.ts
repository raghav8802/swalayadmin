import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SupportReply from "@/models/SupportReply";
import Support from "@/models/Support";

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json({ 
        success: false, 
        message: "Ticket ID is required" 
      });
    }

    // Check if ticket exists using ticketId field instead of _id
    const ticket = await Support.findOne({ ticketId: ticketId });
    if (!ticket) {
      return NextResponse.json({ 
        success: false, 
        message: "Ticket not found" 
      });
    }

    // Get all replies for the ticket using the ticket's _id
    const replies = await SupportReply.find({ supportId: ticket._id })
      .sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      data: replies,
      ticket: {
        _id: ticket._id,
        subject: ticket.subject,
        status: ticket.status,
        isClosed: ticket.isClosed,
        priority: ticket.priority
      }
    });

  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    });
  }
} 