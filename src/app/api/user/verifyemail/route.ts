import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await connect()
    console.log("verify email start ...");
    try {

        const reqBody = await request.json();
        console.log("reqBody : ");
        console.log(reqBody);
        // const { token } = reqBody;
        const  token  = reqBody;
        console.log("token ::");
        console.log(token);
        console.log("-----");

        const User = await Label.findOne({
            verifyCode: token,
            verifyCodeExpiry: { $gt: Date.now() }
        })

        if (!User) {
            console.log("usernot found");
            
            return NextResponse.json({
                status: 400,
                message: "Invalid token",
                success: false
            })
        }

        User.isVerified = true;
        User.verifyCode = "";
        User.verifyCodeExpiry = null;

        await User.save()

        return NextResponse.json({
            status: 200,
            message: "Email verified successfully",
            sucess: true
        })


    } catch (error) {

    }

}




