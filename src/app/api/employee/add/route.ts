import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { connect } from "@/dbConfig/dbConfig";
// import User from "@/models/Label";
// import Label from "@/models/Label"
import Admin from "@/models/admin";
import Employee from "@/models/Employee";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    console.log(reqBody);
    

    const {
      name,
      email,
      officialEmail,
      userType,
      role,
      phone,
      address,
      dob,
      aadhar,
      pan,
      bankAccount,
      ifsc,
      bank,
      branch,
      joiningDate,
      department,
      manager,
      managerContact,
      status,
    } = reqBody;

    const extingEmployeeByEmail = await Employee.findOne({ personalEmail: email });

    if (extingEmployeeByEmail) {
         //! then update role

         const result = await Employee.findByIdAndUpdate(extingEmployeeByEmail._id, {

            fullName:  name,
            personalEmail: email,
            officialEmail,
            phoneNumber: phone,
            address,
            dateOfBirth: dob,
            aadharCardNumber: aadhar,
            panCardNumber: pan,
            bankAccountNumber: bankAccount,
            ifscCode: ifsc, 
            bank, branch ,
            joiningDate, 
            role,
            department,
            manager: {
                name: manager,
                contact: managerContact
            },
            status


         })

      return NextResponse.json({
        message: "Employee data updated",
        data: [],
        success: true,
        status: 200,
      });
    } else {
      //! add new user

      const newEmployee = new Employee({
        fullName: name,
        personalEmail: email,
        officialEmail,
        phoneNumber: phone,
        address,
        dateOfBirth: dob,
        aadharCardNumber: aadhar,
        panCardNumber: pan,
        bankAccountNumber: bankAccount,
        ifscCode: ifsc,
        bank,
        branch,
        joiningDate,
        role,
        department,
        manager: {
          name: manager,
          contact: managerContact,
        },
        status,
      });

      const savedEmployee = await newEmployee.save();

      return NextResponse.json({
        message: "Employee added successfully",
        data: savedEmployee,
        success: true,
        status: 201,
      });

    }

    // // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })
  } catch (error: any) {
    console.log("error.message");
    console.log(error.message);
    
    return NextResponse.json({
      error: error.message,
      success: false,
      status: 500,
    });
  }
}
