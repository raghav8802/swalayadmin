import { NextRequest, NextResponse } from "next/server";
import { apiCache, invalidateCache } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pattern, clearAll } = body;

    if (clearAll) {
      // Clear entire cache
      apiCache.clear();
      return NextResponse.json({
        success: true,
        message: "All cache cleared successfully"
      });
    }

    if (pattern) {
      // Clear cache entries matching pattern
      const clearedCount = invalidateCache(pattern);
      return NextResponse.json({
        success: true,
        message: `Cleared ${clearedCount} cache entries matching pattern: ${pattern}`
      });
    }

    return NextResponse.json({
      success: false,
      message: "Please provide either 'pattern' or 'clearAll' parameter"
    }, { status: 400 });

  } catch (error: any) {
    console.error("Error clearing cache:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to clear cache",
      error: error.message
    }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Cache management endpoint is active",
    availableActions: {
      POST: "Clear cache with pattern or clearAll parameter"
    }
  });
}