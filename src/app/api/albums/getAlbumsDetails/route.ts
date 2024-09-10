import { NextRequest, NextResponse } from 'next/server';
import Album from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';
// import { response } from '@/lib/response'; // Import the response function

export async function GET(req: NextRequest) {
    await connect();

    const albumId = req.nextUrl.searchParams.get("albumId")

    try {
        const album = await Album.findById(albumId)

        if (!album) {
            return NextResponse.json({
                message: "Albums are found",
                success: true,
                status: 404,
                data: album
            })
        }

        return NextResponse.json({
            message: "Albums are found",
            success: true,
            status: 200,
            data: album
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