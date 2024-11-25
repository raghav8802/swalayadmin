import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import bcryptjs from 'bcryptjs';
import Admin from "@/models/admin";
import { Resend } from 'resend';
import OTP from "@/models/OTP";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
console.log("herer");

await connect()

    try {
        const reqBody = await request.json()
        console.log("reqBody ");
        console.log(reqBody);
        
        
        
        const { email, password } = reqBody

        const user = await Admin.findOne({ email });

        console.log("user login data in api : ");
        console.log(user);
        
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
            })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            usertype: user.usertype
        }

        
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '5d'} );

        const response = NextResponse.json({
            message: "Logged In Success",
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



