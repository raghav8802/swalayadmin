import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import bcryptjs from 'bcryptjs'


export async function POST(request: NextRequest) {
console.log("herer");

await connect()
console.log("herer s");

    try {
        const reqBody = await request.json()
        
        console.log(reqBody);
        
        const { email, password } = reqBody

        const user = await Label.findOne({ email });
        if (!user) {
            return NextResponse.json({
                status: 400,
                success: false,
                error: "User doesnt exits"
            })
        }

        const validPassword = await bcryptjs.compare(password, user.password)
        if (!validPassword) {
            return NextResponse.json({
                success: false,
                status: 400,
                error: "Check your credentials"
            })
        }

        const tokenData = {
            id: user._id,
            username: user.username
        }

        
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '5d'} );

        const response = NextResponse.json({
            message: "Logged In Success",
            success: true,
            status: 200
        })

        response.cookies.set("authtoken", token, {httpOnly: true})

        return response;


    } catch (error: any) {
        console.log("error :: ");
        console.log(error);
        
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        })
    }



}



