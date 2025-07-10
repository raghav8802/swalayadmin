import { connect } from '@/dbConfig/dbConfig';
import Artist from '@/models/Artists';
import { NextResponse, NextRequest } from 'next/server';
import Track from '@/models/track';
import Album from '@/models/albums';

export async function GET(request: NextRequest) {
    await connect();

    try {
        const artistIds = request.nextUrl.searchParams.get("artistIds");

        if (!artistIds) {
            return NextResponse.json({ status: 400, message: "Artist IDs are missing", success: false });
        }

        const artistIdArray = artistIds.split(',');

        // Find artists data
        const artists = await Artist.find({ _id: { $in: artistIdArray } })
            .select('_id name'); // Only select the fields we need

        if (!artists.length) {
            return NextResponse.json({ status: 404, message: "No artists found", success: false });
        }

        return NextResponse.json({
            message: "Artists found",
            success: true,
            status: 200,
            data: artists
        });

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ status: 500, message: error.message, success: false });
    }
}
