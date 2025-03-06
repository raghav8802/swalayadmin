import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Support from "@/models/support";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { ticketId, status } = await req.json();

    if (!ticketId || !status) {
      return NextResponse.json({ success: false, message: "Missing required fields" });
    }

    const validStatuses = ['pending', 'in-progress', 'resolved'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" });
    }

    const updatedTicket = await Support.findByIdAndUpdate(
      ticketId,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return NextResponse.json({ success: false, message: "Ticket not found" });
    }

    return NextResponse.json({ success: true, data: updatedTicket });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" });
  }
} 