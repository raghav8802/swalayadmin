import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Label from '@/models/Label';
import Subscription from '@/models/Subscription';
import ApiResponse from '@/lib/apiResponse';

export async function GET() {
  try {
    await connect();

    const labels = await Label.find({}).select('_id lable username').sort({ createdAt: -1 });

    // Fetch subscriptions for each label
    const results = await Promise.all(labels.map(async (label) => {
      // Find the latest subscription for this label
      const subscription = await Subscription.findOne({ userId: label._id })
        .sort({ startDate: -1 });

      return {
        _id: label._id,
        lable: label.lable || label.username,
        subscriptionPlan: subscription?.planName || 'no plan ',
        subscriptionStatus: subscription?.status || 'Deactive',
        subscriptionStartDate: subscription?.startDate || null,
        subscriptionEndDate: subscription?.endDate || null,
        subscriptionprice: subscription?.price || 0,
        subscriptionpaymentId: subscription?.paymentId || 'N/A',
      };
    }));  

    return ApiResponse(200, results, true, 'Labels with subscriptions fetched successfully').nextResponse;
  } catch (error: any) {
    console.error('Error fetching labels:', error);
    return ApiResponse(500, null, false, 'Error fetching labels').nextResponse;
  }
} 