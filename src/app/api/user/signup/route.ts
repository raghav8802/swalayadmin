import { NextRequest, NextResponse } from "next/server";
<<<<<<< HEAD
import bcryptjs from 'bcryptjs'
// import { sendEmail } from "@/helpers/mailer";
// import User from "@/models/Label";
=======
import bcryptjs from 'bcryptjs';
>>>>>>> 057dd3ca12337cc0f2d7e62d3341f1fc096df2bb
import { connect } from "@/dbConfig/dbConfig";
import Label from "@/models/Label";


export async function POST(request: NextRequest) {

    await connect()

    try {

        const reqBody = await request.json()
        const { username, email, password } = reqBody

        const extingUserVerifiedByEmail = await Label.findOne({ email })
        console.log("extingUserVerifiedByEmail");
        console.log(extingUserVerifiedByEmail);
        
     
        if (extingUserVerifiedByEmail) {
            console.log("email extes");
            
            if (!extingUserVerifiedByEmail.isVerified) {
                console.log("here 3");
                return NextResponse.json({
                    message: "Already exists an account",
                    success: false,
                    status: 400
                })
            }
            else {
                console.log("come hererer");
                
                const hashedPassword = await bcryptjs.hash(password, 12);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1)
                extingUserVerifiedByEmail.password = hashedPassword;
                // extingUserVerifiedByEmail.verifyCode = verifyCode;
                // extingUserVerifiedByEmail.verifyCodeExpiry = expiryDate;
                await extingUserVerifiedByEmail.save()

                console.log("here 2");
            }

        }

        console.log("here 1");

        const hashedPassword = await bcryptjs.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new Label({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save();



        console.log(savedUser);

        console.log("signup api request");
        console.log(reqBody);
        console.log(username, email, password);

<<<<<<< HEAD
        // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })
=======
>>>>>>> 057dd3ca12337cc0f2d7e62d3341f1fc096df2bb

        return NextResponse.json({
            message: "User signup successfully",
            data: reqBody,
            success: true,
            status: 200
        })



    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({
                error: error.message,
                success: false,
                status: 500
            });
        }
        return NextResponse.json({
            error: 'An unknown error occurred',
            success: false,
            status: 500
        });
    }


}





