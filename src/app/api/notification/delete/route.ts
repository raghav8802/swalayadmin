import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connect } from "@/dbConfig/dbConfig"; // Adjust the import path if necessary
import Notification from "@/models/notification"; // Adjust the import path if necessary

export async function POST(req: NextRequest) {
    try {
        await connect();
        const notificationId = req.nextUrl.searchParams.get("notificationId")
        
        if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
            return NextResponse.json({
                message: "Invalid notification ID",
                success: false,
                status: 400,
            });
        }

        // Delete the notification by ID
        const result = await Notification.findByIdAndDelete(notificationId);

        if (!result) {
            return NextResponse.json({
                message: "Notification not found",
                success: false,
                status: 404,
            });
        }

        return NextResponse.json({
            message: "Notification deleted successfully",
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
