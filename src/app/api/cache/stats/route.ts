import { NextResponse } from "next/server";
import { getCacheStats } from "@/lib/cache";

export async function GET() {
  try {
    const stats = getCacheStats();
    
    return NextResponse.json({
      success: true,
      message: "Cache statistics retrieved successfully",
      data: {
        ...stats,
        hitRatio: stats.size > 0 ? ((stats.size / stats.maxSize) * 100).toFixed(2) + '%' : '0%',
        memoryUsageKB: (stats.totalMemoryUsage / 1024).toFixed(2) + ' KB'
      }
    });
  } catch (error: any) {
    console.error("Error getting cache stats:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to retrieve cache statistics",
      error: error.message
    }, { status: 500 });
  }
}