import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Youtube from '@/models/youtube';
import { connect } from '@/dbConfig/dbConfig';


export async function POST(request: NextRequest) {
    try {
        await connect();

        const body = await request.json();
        const { labelId, link } = body;

        const newYoutube = new Youtube({ labelId, link });

        const result = await newYoutube.save();


        return NextResponse.json({
            message: "Copyright added",
            data: result,
            success: true,
            status: 201
        })



    } catch (error) {
        console.error('Internal server error:', error);
        return NextResponse.json({
            message: "Something went wrong",
            success: false,
            status: 201
        })
    }
    

    

}