import { connect } from "@/dbConfig/dbConfig";
import {  NextResponse } from "next/server";
import Lead from "@/models/leadModel";

connect();

export async function GET() {
    try {
        // Fetch all leads from the database
        const leads = await Lead.find({})
            .sort({ createdAt: -1 }); // Sort by newest first

        return NextResponse.json({
            success: true,
            message: "Leads fetched successfully",
            data: leads
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
} 