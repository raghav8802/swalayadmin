import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import bcryptjs from 'bcryptjs';
import Admin from "@/models/admin";
import { Resend } from 'resend';
import OTP from "@/models/OTP";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    await connect();

    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const user = await Admin.findOne({ email });
        if (!user) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "User doesn't exist"
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
        await resend.emails.send({
            from: "SwaLay <swalay.care@talantoncore.in>",
            to: email,
            subject: 'Login OTP for SwaLay-Plus EMP.',
            html: `<p>Your OTP for login is: <strong>${otp}</strong></p>
                   <p>This OTP will expire in 10 minutes.</p>`
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



