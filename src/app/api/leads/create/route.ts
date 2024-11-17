import { NextResponse } from "next/server";
import { connect} from "@/dbConfig/dbConfig";
import Lead from "@/models/leadModel";

export async function POST(req: Request) {
  try {
    await connect();
    
    const body = await req.json();
    console.log("Received data:", body);

    // Validate only essential fields
    if (!body.name || !body.email || !body.contactNo || !body.labelName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new lead
    const lead = await Lead.create(body);

    return NextResponse.json(
      { success: true, data: lead },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
} 