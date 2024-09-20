// src/app/api/support/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/support';

export async function GET(req: NextRequest) {
  try {
    await connect();

    // Check for existing support requests with the same labelId
    const existingSupportRequests = await Support.find();

    return NextResponse.json({
      message: "Thank you! We will reach out to you soon.",
      success: true,
      status: 201,
      data: existingSupportRequests
    });

  } catch (error: any) {
    console.error('Error creating support request:', error);
    
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
}
