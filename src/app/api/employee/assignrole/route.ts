import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';
import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/Label";
// import Label from "@/models/Label"
import Admin from "@/models/admin";
import Employee from "@/models/Employee";




export async function POST(request: NextRequest) {

    await connect()

    try {

        const reqBody = await request.json()
        console.log("reqBody z :: ");
        console.log(reqBody);
        
        const { name, email, role } = reqBody

        // const extingUserVerifiedByEmail = await Admin.findOne({ email })
        // console.log("extingUserVerifiedByEmail");
        // console.log(extingUserVerifiedByEmail);
        
        
        // const password = "SwaLay@123";
     
        // if (extingUserVerifiedByEmail) {

        //     //! then update role 

        //     console.log("email extes");
            
        //     if (!extingUserVerifiedByEmail.isVerified) {
        //         console.log("here 3");
        //         return NextResponse.json({
        //             message: "Already exists an account",
        //             success: false,
        //             status: 400
        //         })
        //     }
        //     else {

        //         //! add new user
        //         console.log("come hererer");
                
        //         const hashedPassword = await bcryptjs.hash(password, 12);
        //         const expiryDate = new Date();
        //         expiryDate.setHours(expiryDate.getHours() + 1)
        //         extingUserVerifiedByEmail.password = hashedPassword;
        //         // extingUserVerifiedByEmail.verifyCode = verifyCode;
        //         // extingUserVerifiedByEmail.verifyCodeExpiry = expiryDate;
        //         await extingUserVerifiedByEmail.save()

        //         console.log("here 2");
        //     }

        // }

        // console.log("here 1");

        // const hashedPassword = await bcryptjs.hash(password, 10)
        // const expiryDate = new Date()
        // expiryDate.setHours(expiryDate.getHours() + 1)

        // const newUser = new Admin({
        //     username: name,
        //     email,
        //     password: hashedPassword,
        //     usertype: role
        // })

        // const savedUser = await newUser.save();



        
        // console.log("signup api request");
        // console.log(savedUser);

        // // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })

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





