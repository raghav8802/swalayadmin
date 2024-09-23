import { connect } from "@/dbConfig/dbConfig"; // Assuming this is your database connection file
import Label from "@/models/Label"; // Import the Label model
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Connect to the database
    await connect();

    try {
        // Fetch all labels from the database
        const labels = await Label.find().select('-password -verifyCode -verifyCodeExpiry').sort({_id: -1});

        

        // If no labels found, return a message
        if (!labels.length) {
            return NextResponse.json({
                status: 404,
                message: "No labels found",
                success: false,
            });
        }

        // Return the fetched labels
        return NextResponse.json({
            status: 200,
            data: labels,
            message: "Labels fetched successfully",
            success: true,
        });
    } catch (error) {
        // Handle any errors
        return NextResponse.json({
            status: 500,
            message: "An error occurred while fetching labels",
            success: false,
        });
    }
    
}
