import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/support';

export async function GET(req: NextRequest) {
  try {
    await connect();

    const searchParams = req.nextUrl.searchParams;
    const labelId = searchParams.get('labelId');

    // Create query object based on whether labelId is provided
    const query = labelId ? { labelId } : {};

    const tickets = await Support.aggregate([
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "in-progress"] }, then: 2 },
                { case: { $eq: ["$status", "resolved"] }, then: 3 }
              ],
              default: 4
            }
          }
        }
      },
      { $sort: { statusOrder: 1, createdAt: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      status: 200,
      data: tickets
    });

  } catch (error: any) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
} 