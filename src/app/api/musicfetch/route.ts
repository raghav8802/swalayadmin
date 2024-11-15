import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Database connection
import Track from "@/models/track"; // Import Track model

export async function POST(request: NextRequest) {
    try {
        await connect(); // Connect to MongoDB
        const reqBody = await request.json();
        const isrc = reqBody.isrc as string;

        console.log("ISRC received:", isrc);

        const api_url = `https://api.musicfetch.io/isrc?isrc=${isrc}`;
        
        const fileDetailResponse = await axios.get(api_url, {
            headers: {
                'x-token': `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhY2NvdW50SWQiOiJhY2NvdW50XzMzc3FtM1A4VVU0UzJPeTBBYWFnZWciLCJpYXQiOjE3MTAwOTA1OTl9.LjrKauR_-T8MPG5IiLmBG_MFF3laYhl0kBvsTVbsbng`,
                Accept: "application/json",
            },
        });

        const fileDetails = fileDetailResponse.data.result;

        // Only format the platform links
        const platformLinks = {
            shazam: fileDetails.services.shazam?.link || null,
            amazonMusic: fileDetails.services.amazonMusic?.link || null,
            youtubeMusic: fileDetails.services.youtubeMusic?.link || null,
            amazon: fileDetails.services.amazon?.link || null,
            spotify: fileDetails.services.spotify?.link || null,
            appleMusic: fileDetails.services.appleMusic?.link || null,
            youtube: fileDetails.services.youtube?.link || null,
            wynkMusic: fileDetails.services.wynkMusic?.link || null,
        };
        

        console.log("Platform links to save:", platformLinks);

        // Save platform links to MongoDB
        const track = await Track.findOneAndUpdate(
            { isrc },
            { $set: { platformLinks } },
            { new: true, upsert: true }
        );

        return NextResponse.json(
            {
                data: track,
                success: true,
                status: 200,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.log("Error:", error.message);

        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return NextResponse.json(
                {
                    error: "File details not found for the provided ISRC.",
                    success: false,
                    status: 404,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                error: error.message || "An unknown error occurred",
                success: false,
                status: 500,
            },
            { status: 500 }
        );
    }
}
