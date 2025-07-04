import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Lead from "@/models/leadModel";
import sendMail from "@/helpers/sendMail";
import EmailLayout from "@/components/email/EmailLayout";
import LeadApprovalEmailTemplate from "@/components/email/lead-approval";
import React from "react";

export async function POST(req: Request) {
  try {
    await connect();
    
    const body = await req.json();
    console.log("Received data:", body);

    // Validate fields
    if (!body.name || !body.email || !body.contactNo || !body.labelName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new lead
    const lead = await Lead.create(body);

    // Send email using sendMail
    const emailTemplate = React.createElement(
      EmailLayout as React.ElementType,
      null,
      React.createElement(LeadApprovalEmailTemplate as React.ElementType, { name: body.name })
    );
    await sendMail({
      to: body.email,
      subject: 'Label Application Approved',
      emailTemplate,
    });

    return NextResponse.json(
      { success: true, data: lead },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 