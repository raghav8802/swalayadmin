import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import OTP from "@/models/OTP";
import Admin from "@/models/admin";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    await connect();

    try {
        const reqBody = await request.json();
        const { email, otp } = reqBody;

        // Find the latest OTP for this email
        const otpRecord = await OTP.findOne({ 
            email,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return NextResponse.json({
                success: false,
                status: 400,
                error: "OTP expired or not found"
            });
        }

        if (otpRecord.otp !== otp) {
            return NextResponse.json({
                success: false,
                status: 400,
                error: "Invalid OTP"
            });
        }

        // Get admin details for token
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({
                success: false,
                status: 400,
                error: "Admin not found"
            });
        }

        const tokenData = {
            id: admin?._id,
            username: admin?.username
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '5d' });

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        const response = NextResponse.json({
            message: "OTP verified successfully",
            success: true,
            status: 200
        });

        response.cookies.set("authtoken", token, { httpOnly: true });
        return response;

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        });
    }
} 