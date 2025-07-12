import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import sendMail from "@/helpers/sendMail";
import EmailLayout from "@/components/email/EmailLayout";
import SupportTicketEmailTemplate from "@/components/email/support-ticket";
import React from "react";

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

    const ticket = await Support.findOne({ ticketId });
    if (!ticket) {
      return NextResponse.json({ 
        success: false, 
        message: "Ticket not found" 
      });
    }

    const updatedTicket = await Support.findOneAndUpdate(
      { ticketId },
      updateData,
      { new: true }
    );

    // Send email notification if ticket is being closed
    if (isClosed === true && !ticket.isClosed) {
      const emailTemplate = React.createElement(
        EmailLayout as React.ElementType,
        null,
        React.createElement(SupportTicketEmailTemplate as React.ElementType, {
          type: 'closed',
          ticketId: ticket.ticketId,
          subject: ticket.subject,
          name: ticket.name
        })
      );

      await sendMail({
        to: ticket.email,
        subject: `Support Ticket Closed - ${ticket.subject}`,
        emailTemplate
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