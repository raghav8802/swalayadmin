import { connect } from '@/dbConfig/dbConfig';
import Label from '@/models/Label';
import Subscription from '@/models/Subscription';
import ApiResponse from '@/lib/apiResponse';


export const revalidate = 0;


export async function GET() {
  try {
    await connect();

 // 1. Fetch all subscriptions
    const subscriptions = await Subscription.find({}).sort({ startDate: -1 }).lean();

    // 2. For each subscription, find the corresponding label
    const results = await Promise.all(
      subscriptions.map(async (subscription) => {
        const label = await Label.findById(subscription.userId).select('lable username');
        return {
          _id: subscription._id,
          lable: label ? (label.lable || label.username) : 'Unknown',
          subscriptionPlan: subscription.planName || 'no plan',
          subscriptionStatus: subscription.status || 'Deactive',
          subscriptionStartDate: subscription.startDate || null,
          subscriptionEndDate: subscription.endDate || null,
          subscriptionprice: subscription.price || 0,
          subscriptionpaymentId: subscription.paymentId || 'N/A',
        };
      })
    );

    return ApiResponse(200, results, true, 'Labels with subscriptions fetched successfully').nextResponse;
  } catch (error: any) {
    console.error('Error fetching labels:', error);
    return ApiResponse(500, null, false, 'Error fetching labels').nextResponse;
  }
} 