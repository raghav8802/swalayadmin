
import { connect } from '@/dbConfig/dbConfig';
import Artist from '@/models/Artists';
import { NextResponse, NextRequest } from 'next/server';
import Track from '@/models/track';
import Album from '@/models/albums';

export async function GET(request: NextRequest) {
    await connect();

    try {
        const artistId = request.nextUrl.searchParams.get("artistId");

        if (!artistId) {
            return NextResponse.json({ status: 400, message: "Artist IDs are missing", success: false });
        }

        // Find artists data
        const artists = await Artist.findById(artistId) // Only select the fields we need

      

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
