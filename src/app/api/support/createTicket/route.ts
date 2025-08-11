import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Label from "@/models/Label"
import Support from "@/models/Support"
import sendMail from "@/helpers/sendMail";
import EmailLayout from "@/components/email/EmailLayout";
import SupportTicketEmailTemplate from "@/components/email/support-ticket";
import React from "react";

export async function POST(req: Request) {
  try {
    // Ensure MongoDB is connected
    await connectDB();
    console.log('MongoDB connected successfully');

    const { email, subject, message, priority = 'medium', category = 'general' } = await req.json();
    console.log('Received request data:', { email, subject, message, priority, category });

    if (!email || !subject || !message) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing required fields: email, subject, and message are required" 
      });
    }

    // Find user in Label schema by email
    const user = await Label.findOne({ email: email });
    console.log('Found user:', user);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: "User not found with this email address. Please check the email or create a user account first." 
      });
    }

    // Use the found user's data
    const name = user.username;
    const labelId = user._id.toString();

    // Create the ticket instance
    console.log('Creating new ticket with data:', {
      name,
      email,
      labelId,
      subject,
      message,
      priority,
      category
    });

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

    // Save the ticket
    console.log('Saving ticket...');
    const savedTicket = await newTicket.save();
    console.log('Ticket saved successfully:', savedTicket);

    // Verify the ticket was saved with a ticketId
    if (!savedTicket.ticketId) {
      console.error('Ticket saved but no ticketId was generated:', savedTicket);
      throw new Error('Ticket was saved but no ticketId was generated. This is likely a database configuration issue.');
    }

    // Send email notification
    console.log('Sending email notification...');
    const emailTemplate = React.createElement(
      EmailLayout as React.ElementType,
      null,
      React.createElement(SupportTicketEmailTemplate as React.ElementType, {
        type: 'created',
        ticketId: savedTicket.ticketId,
        subject: subject,
        message: message,
        name: name,
        status: 'pending'
      })
    );

    await sendMail({
      to: email,
      subject: `Support Ticket Created - ${subject}`,
      emailTemplate
    });
    console.log('Email notification sent successfully');

    return NextResponse.json({ 
      success: true, 
      data: savedTicket,
      message: "Support ticket created successfully"
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : "Server error",
      error: error instanceof Error ? error.stack : undefined
    });
  }
} 