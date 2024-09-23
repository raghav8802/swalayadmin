import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig"; // Adjust the import path if necessary
import Label from "@/models/Label";

export async function POST(req: NextRequest) {
    try {
        await connect();
        // const labelId = req.nextUrl.searchParams.get("labelId")
        const {labelId} = await req.json()
        // let {labelId} = reqbody;
        
        if (!labelId || !mongoose.Types.ObjectId.isValid(labelId)) {
            return NextResponse.json({
                message: "Invalid label ID",
                success: false,
                status: 400,
            });
        }

        // Delete the notification by ID
        const result = await Label.findByIdAndDelete(labelId);

        if (!result) {
            return NextResponse.json({
                message: "Label not found",
                success: false,
                status: 404,
            });
        }

        return NextResponse.json({
            message: "Label deleted successfully",
            success: true,
            status: 200,
        });
    } catch (error: any) {
        console.error("Error deleting notification:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false,
            status: 500,
        });
    }
}
