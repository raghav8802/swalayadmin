import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import bcryptjs from 'bcryptjs';
import Admin from "@/models/admin";
import sendMail from "@/helpers/sendMail";
import EmailLayout from "@/components/email/EmailLayout";
import OtpEmailTemplate from "@/components/email/otp";
import OTP from "@/models/OTP";
import React from "react";

export async function POST(request: NextRequest) {
    await connect();

    try {
        const reqBody = await request.json();

        console.log("reqBody :: ", reqBody);

        const { email, password } = reqBody;

        const user = await Admin.findOne({ email });

        console.log("user :: ", user);
        

        if (!user) {
            console.log("User doesn't exist 1");
            return NextResponse.json({
                status: 400,
                success: false,
                error: "User doesn't exist 1"
            });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({
                success: false,
                status: 400,
                error: "Check your credentials"
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save OTP to database
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
        });

        // Send OTP via email
        const emailTemplate = React.createElement(
          EmailLayout as React.ElementType,
          null,
          React.createElement(OtpEmailTemplate as React.ElementType, { otp })
        );
        await sendMail({
          to: email,
          subject: 'Login OTP for SwaLay-Plus EMP.',
          emailTemplate,
        });

        return NextResponse.json({
            message: "OTP sent successfully",
            success: true,
            status: 200,
            requireOTP: true
        });

    } catch (error: any) {
        console.log("error :: ", error);
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        });
    }
}


