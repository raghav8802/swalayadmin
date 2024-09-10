import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface TokenPayload {
    id: string;
}

export async function GET(request: NextRequest) {
    await connect()

    try {

        const token = request.cookies.get('authtoken')?.value || '';
        const cookieData = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload;
        const userid = cookieData.id;

        const UserData = await Label.findById(userid).select('-password');

        if (!UserData) {

            return NextResponse.json({
                status: 400,
                message: "Invalid User",
                success: false
            })
        }

        return NextResponse.json({
            status: 200,
            data: UserData,
            message: "user find successfully",
            success: true
        })


    } catch (error) {

    }

}




