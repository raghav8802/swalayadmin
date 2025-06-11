import { NextRequest, NextResponse } from 'next/server';

import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
// import { response } from '@/lib/response'; // Import the response function

export async function GET(req: NextRequest) {
    await connect();


    try {
        // const albums = await Album.find({ status: 2 });
        const albums = await Album.find({ status: 2 }).sort({ _id: -1 });

        if (!albums) {
            return NextResponse.json({
                message: "Albums are found",
                success: false,
                status: 404,
            })
        }

        return NextResponse.json({
            message: "Albums are found admin",
            success: true,
            status: 200,
            data: albums
        })
    } catch (error) {
        console.error('Internal Server Error:', error);

        return NextResponse.json({
            message: "Internal server down",
            success: false,
            status: 500,
        })

    }
}