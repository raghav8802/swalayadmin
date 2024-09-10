import { connect } from '@/dbConfig/dbConfig';
import Artist from '@/models/Artists';  // Ensure this matches your model's filename
import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    await connect();

    try {
        const labelId = request.nextUrl.searchParams.get("labelId");

        if (!labelId) {
            return NextResponse.json({ status: 400, message: "Label ID is missing", success: false });
        }

        // Define filters for different artist types
        const filters = {
            singer: { labelId, isSinger: true },
            lyricist: { labelId, isLyricist: true },
            composer: { labelId, isComposer: true },
            producer: { labelId, isProducer: true },
        };

        // Fetch and format artists categorized by type
        const results: any = {};

        for (const [type, filter] of Object.entries(filters)) {
            const artists = await Artist.find(filter).select('_id artistName');
            // Format the result to use _id as value and artistName as label
            results[type] = artists.map((artist: any) => ({
                value: artist._id.toString(),  // Convert ObjectId to string if needed
                label: artist.artistName
            }));
        }

        return NextResponse.json({
            message: "Artists found",
            success: true,
            status: 200,
            data: results
        });

    } catch (error: any) {
        return NextResponse.json({ status: 500, message: error.message, success: false });
    }
}
