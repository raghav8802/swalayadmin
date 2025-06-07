import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/support";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { ticketId, reply } = await req.json();

    if (!ticketId || !reply) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    const updatedTicket = await Support.findByIdAndUpdate(
      ticketId,
      { reply },
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json({ success: false, message: "Ticket not found" });
    }

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch  {
    return NextResponse.json({ success: false, message: "Server error" });
  }
} 