import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
import Admin from "@/models/admin";
import Employee from "@/models/Employee";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    console.log("reqBody z :: ");
    console.log(reqBody);

    const { email, role } = reqBody;
    const password = "SwaLay@123";

    const EmployeeProfile = await Employee.findOne({
      $or: [{ email: email }, { officialEmail: email }],
    });

    // check emplaoye have profile with this email 
    if (EmployeeProfile) {

      const existingUserVerifiedByEmail = await Admin.findOne({ email });
      console.log("extingUserVerifiedByEmail");
      console.log(existingUserVerifiedByEmail);
      if (existingUserVerifiedByEmail) {
        // update user type in admin
        const updateUserTypeResponse = await Admin.findOneAndUpdate(
          { email }, // Find by email
          { $set: { usertype: role } }, // Update usertype to role
          { new: true } // Return the updated document
        );
        if (updateUserTypeResponse) {
          return NextResponse.json({
            message: "The employee's assigned role has been updated",
            data: reqBody,
            success: true,
            status: 200,
          });
        }
      } else {
        // add new employee to admin
        const hashedPassword = await bcryptjs.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        const newUser = new Admin({
          username: EmployeeProfile.fullName,
          email,
          password: hashedPassword,
          usertype: role,
        });

        const savedUser = await newUser.save();
        if (savedUser) {
          return NextResponse.json({
            message: "Roled Assigned Successfully",
            data: [],
            success: true,
            status: 200,
          });
        }
      }
    } else {
      return NextResponse.json({
        message: "No Employee found with this email",
        data: [],
        success: false,
        status: 400,
      });
    }

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      message: error.message,
      success: false,
      status: 500,
    });
  }
}
