import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Label from '@/models/Label';

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  if (!query) {
    return NextResponse.json({ success: false, data: [], message: 'No query provided' });
  }

  // Case-insensitive, partial match on username, lable, or email
  const regex = new RegExp(query, 'i');
  const labels = await Label.find({
    $or: [
      { username: regex },
      { lable: regex },
      { email: regex },
    ],
  }).select('_id username lable email usertype');

  return NextResponse.json({ success: true, data: labels });
} 