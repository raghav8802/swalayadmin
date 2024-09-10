import { connect } from "@/dbConfig/dbConfig";
import Admin from "@/models/admin";
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

        const UserData = await Admin.findById(userid).select('-password');
          console.log("invaild user why");
            console.log(UserData);
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
        console.log("invaild user catch admin/usr");
        console.log(error);
        return NextResponse.json({
            status: 500,
            message: "Invalid ",
            success: false
        })

    }

}




