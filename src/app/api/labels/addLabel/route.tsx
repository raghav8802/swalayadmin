import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'

// import User from "@/models/Label";
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";
import fetch from 'node-fetch';


export async function POST(request: NextRequest) {

    await connect()

    try {

        const reqBody = await request.json()
     
        const { username, email, contact, lable, usertype, state } = reqBody        
   
        const password = '123456SwaLay';

        const extingUserVerifiedByEmail = await Label.findOne({ email })

        if (extingUserVerifiedByEmail) {
            
            if (!extingUserVerifiedByEmail.isVerified) {
                console.log("here 3");
                return NextResponse.json({
                    message: "Already exists an account",
                    success: false,
                    status: 400
                })
            }
            else {
                
                const hashedPassword = await bcryptjs.hash(password, 12);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1)
                extingUserVerifiedByEmail.password = hashedPassword;
                // extingUserVerifiedByEmail.verifyCode = verifyCode;
                // extingUserVerifiedByEmail.verifyCodeExpiry = expiryDate;
                await extingUserVerifiedByEmail.save()

            }

        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new Label({
            username,
            email,
            password: hashedPassword,
            contact,
            usertype,
            lable: lable, state 

        })

        const savedUser = await newUser.save();

        // mail send to user is here 
        // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

        return NextResponse.json({
            message: "User signup successfully",
            data: reqBody,
            success: true,
            status: 200
        })



    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        })
    }


}
