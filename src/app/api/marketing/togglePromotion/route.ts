import { NextResponse } from "next/server";

import Marketing from "@/models/Marketing";
import { connect } from "@/dbConfig/dbConfig";
import { invalidateCache } from '@/lib/cache';

export async function POST(req: Request) {
  try {
    await connect();

    const { marketingId } = await req.json();

    if (!marketingId) {
      return NextResponse.json(
        { success: false, message: "Marketing ID is required" },
        { status: 400 }
      );
    }

    const marketing = await Marketing.findById(marketingId);
    
    if (!marketing) {
      return NextResponse.json(
        { success: false, message: "Marketing not found" },
        { status: 404 }
      );
    }

    // Toggle the promotion status
    marketing.isSelectedForPromotion = !marketing.isSelectedForPromotion;
    const updatedMarketing = await marketing.save();

    // Invalidate marketing-related caches
    invalidateCache('marketing');

    return NextResponse.json({
      success: true,
      message: `Marketing ${marketing.isSelectedForPromotion ? 'selected for' : 'removed from'} promotion`,
      data: marketing
    });

  } catch (error: any) {
    console.error("Error in togglePromotion:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 