import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
            
            // console.log("invaild user why user/api");
            // console.log(UserData);

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
        console.log("invaild user catch user/api catch"); 
        console.log(error);

        return NextResponse.json({
           
            status: 500,
            message: "Invalid ",
            success: false
        })

    }

}




