import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Support from '@/models/Support';
import SupportReply from '@/models/SupportReply';

export async function GET() {
  try {
    await connect();

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

    // Get replies for each ticket
    const ticketsWithReplies = await Promise.all(
      tickets.map(async (ticket) => {
        const replies = await SupportReply.find({ supportId: ticket._id })
          .sort({ createdAt: 1 });
        
        // Calculate unread replies (user replies that are not read)
        const unreadReplies = replies.filter(reply => 
          reply.senderType === 'user' && !reply.isRead
        ).length;
        
        return {
          ...ticket,
          replies,
          replyCount: replies.length,
          unreadReplies
        };
      })
    );

    return NextResponse.json({
      success: true,
      status: 200,
      data: ticketsWithReplies
    });

  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return NextResponse.json({
      message: "Internal server error",
      success: false,
      status: 500,
    });
  }
} 