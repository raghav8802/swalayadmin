import { connect } from "@/dbConfig/dbConfig";
import Admin from "@/models/admin";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface TokenPayload {
    id: string;
}

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    await connect();

    try {
        const token = request.cookies.get('authtoken')?.value || '';
        if (!token) {
            return NextResponse.json({
                status: 401,
                message: "No token provided",
                success: false
            });
        }

        const secret = process.env.TOKEN_SECRET;
        if (!secret) {
            return NextResponse.json({
                status: 500,
                message: "Token secret not configured",
                success: false
            });
        }

        const cookieData = jwt.verify(token, secret) as TokenPayload;
        const userid = cookieData.id;

        const UserData = await Admin.findById(userid).select('-password');
        if (!UserData) {
            return NextResponse.json({
                status: 404,
                message: "User not found",
                success: false
            });
        }

        return NextResponse.json({
            status: 200,
            data: UserData,
            message: "User found successfully",
            success: true
        });

    } catch (error) {
        console.error("Error verifying token or finding user", error);
        return NextResponse.json({
            status: 401,
            message: "Invalid token or user",
            success: false
        });
    }
}
