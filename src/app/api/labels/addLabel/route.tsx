import React from "react";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import AccountActivationEmailTemplate from "@/components/email/account-activation";
import sendMail from "@/helpers/sendMail";
import EmailLayout from "@/components/email/EmailLayout";


interface RazorpayResponse {
  id: string;
  name: string;
  email: string;
  contact: number;
}

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    const {
      username,
      email,
      password = "Swalay@123",
      contact,
      lable,
      usertype,
      state,
      reference_id,
      notes,
    } = reqBody;

    if (!username || !email || !contact) {
      return NextResponse.json({
        message: "Username, email, and contact are required fields",
        success: false,
        status: 400,
      });
    }

 

    if (usertype !== "normal") {
      const existingLabelByLabelName = await Label.findOne({ lable: lable });

      if (existingLabelByLabelName) {
        return NextResponse.json({
          message: "Already exists an account with same Label Name",
          success: false,
          status: 400,
        });
      }
    }

    const extingUserVerifiedByEmail = await Label.findOne({ email });

    if (extingUserVerifiedByEmail) {
      return NextResponse.json({
        message: "Already exists an account with this email",
        success: false,
        status: 400,
      });
    }

    const razorpayApiKey = process.env.RAZORPAY_KEY_ID;
    const razorpayApiSecret = process.env.RAZORPAY_KEY_SECRET;

    const razorpayResponse = await fetch(
      "https://api.razorpay.com/v1/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${razorpayApiKey}:${razorpayApiSecret}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          name: username,
          email: email,
          contact: contact,
          type: "vendor",
          reference_id: reference_id || "",
          notes: notes || {},
        }),
      }
    );
    

    const razorpayData = (await razorpayResponse.json()) as RazorpayResponse;

    if (!razorpayResponse.ok) {
      console.error("Failed to create Razorpay contact:", razorpayData);
      return NextResponse.json({
        message: "Failed to create Razorpay contact",
        razorpayError: razorpayData,
        success: false,
        status: razorpayResponse.status,
      });
    }

    const razorpayContactId = razorpayData.id;
  

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new Label({
      username,
      email,
      contact,
      razor_contact: razorpayContactId, // Ensure this matches the schema
      password: hashedPassword,
      usertype,
      lable: lable,
      state,
    });

    await newUser.save();

    const emailTemplate = (
      <EmailLayout>
        <AccountActivationEmailTemplate clientName={username} />
      </EmailLayout>
    );
     await sendMail({
      to: email, // Key 'to' must be specified
      subject: "Welcome to SwaLay Plus - Account Activated", // Key 'subject' must be specified
      emailTemplate, // This passes the rendered template
    });

    return NextResponse.json({
      message: "Razorpay contact created and user registered successfully",
      userData: reqBody,
      // razorpayData,
      success: true,
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in API:", error.message);
    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
}
