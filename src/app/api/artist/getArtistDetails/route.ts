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
            return NextResponse.json({ status: 400, message: "Artist ID is missing", success: false });
        }

        // Find artist data
        const artistData = await Artist.findOne({ _id: artistId });
        if (!artistData) {
            return NextResponse.json({ status: 404, message: "Artist not found", success: false });
        }

        // Find tracks where the artist is involved in any role (primarySinger, singers, composers, lyricists, producers)
        const tracks = await Track.find({
            $or: [
                { primarySinger: artistId },
                { singers: artistId },
                { composers: artistId },
                { lyricists: artistId },
                { producers: artistId }
            ]
        }).select('albumId songName primarySinger singers composers lyricists producers');

        // Collect album data for each track
        const albums = [];
        for (const track of tracks) {
            const roles = [];

            if (track.primarySinger === artistId) roles.push('Primary Singer');
            if (track.singers?.includes(artistId)) roles.push('Singer');
            if (track.composers?.includes(artistId)) roles.push('Composer');
            if (track.lyricists?.includes(artistId)) roles.push('Lyricist');
            if (track.producers?.includes(artistId)) roles.push('Producer');

            // Find album data using albumId
            const album = await Album.findById(track.albumId).select('title thumbnail');
            
            if (album) {
                albums.push({
                    albumId: album._id,
                    albumName: album.title,
                    thumbnail: album.thumbnail,
                    trackName: track.songName,
                    workAs: roles
                });
            }
        }

        return NextResponse.json({
            message: "Artist found",
            success: true,
            status: 200,
            data: {
                artistData,
                albums // The albums the artist worked on
            }
        });

    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ status: 500, message: error.message, success: false });
    }
}