import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { ticketId, status, isClosed, priority } = await req.json();

    if (!ticketId) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing ticket ID" 
      });
    }

    const updateData: any = {};

    // Update status if provided
    if (status) {
      const validStatuses = ['pending', 'in-progress', 'resolved'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ 
          success: false, 
          message: "Invalid status" 
        });
      }
      updateData.status = status;
    }

    // Update isClosed if provided
    if (typeof isClosed === 'boolean') {
      updateData.isClosed = isClosed;
    }

    // Update priority if provided
    if (priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        return NextResponse.json({ 
          success: false, 
          message: "Invalid priority" 
        });
      }
      updateData.priority = priority;
    }

    const updatedTicket = await Support.findByIdAndUpdate(
      ticketId,
      updateData,
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json({ 
        success: false, 
        message: "Ticket not found" 
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedTicket,
      message: "Ticket updated successfully"
    });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ 
      success: false, 
      message: "Server error" 
    });
  }
} 