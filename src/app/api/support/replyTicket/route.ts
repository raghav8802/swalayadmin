import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/Support";
import SupportReply from "@/models/SupportReply";
import sendMail from "@/helpers/sendMail";
import EmailLayout from "@/components/email/EmailLayout";
import SupportTicketEmailTemplate from "@/components/email/support-ticket";
import React from "react";

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
    const ticket = await Support.findOne({ ticketId });
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
      supportId: ticket._id, // We still need to use _id for the database relationship
      senderType,
      senderId,
      senderName,
      message,
      isRead: false
    });

    await newReply.save();

    // Update ticket status to in-progress if it was pending
    if (ticket.status === 'pending') {
      await Support.findByIdAndUpdate(ticket._id, { status: 'in-progress' });
    }

    // Send email notification to the ticket creator
    const emailTemplate = React.createElement(
      EmailLayout as React.ElementType,
      null,
      React.createElement(SupportTicketEmailTemplate as React.ElementType, {
        type: 'replied',
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        message: message,
        name: ticket.name
      })
    );

    await sendMail({
      to: ticket.email,
      subject: `New Reply - Support Ticket: ${ticket.subject}`,
      emailTemplate
    });

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