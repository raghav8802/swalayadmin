import { NextRequest, NextResponse } from 'next/server';

import Album, { AlbumStatus } from '@/models/albums';
import { connect } from '@/dbConfig/dbConfig';

export async function GET(req: NextRequest) {
    await connect();

    // Extract query parameters
    const status = req.nextUrl.searchParams.get("status");
    const limit = req.nextUrl.searchParams.get("limit");

    // Build the query object
    let query: any = {};

    

    if (status && status !== "All") {
        // Convert status string to corresponding AlbumStatus enum value
        const statusEnumValue = AlbumStatus[status as keyof typeof AlbumStatus];
        if (statusEnumValue !== undefined) {
            query.status = statusEnumValue;
        } else {
            return NextResponse.json({
                message: `Invalid status value: ${status}`,
                success: false,
                status: 400,
            });
        }
    }

    try {
        // Fetch albums based on query and apply limit if provided
        const albums = await Album.find(query).limit(limit ? parseInt(limit) : 0).sort({ _id: -1 });

        if (!albums || albums.length === 0) {
            return NextResponse.json({
                message: "No albums found",
                success: true,
                status: 404,
            });
        }

        return NextResponse.json({
            message: "Albums are found",
            success: true,
            status: 200,
            data: albums,
        });
    } catch (error) {
        console.error('Internal Server Error:', error);

        return NextResponse.json({
            message: "Internal server down",
            success: false,
            status: 500,
        });
    }
}
