import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Label from '@/models/Label';


export async function GET(req: NextRequest) {
    await connect();

    const labelId = req.nextUrl.searchParams.get("labelId")

    console.log("labelId : ", labelId);
    

    try {
        const data = await Label.findById(labelId)

        if (!labelId) {
            return NextResponse.json({
                message: "please provide labelid",
                success: true,
                status: 404,
            })
        }

        return NextResponse.json({
            message: "Albums are found",
            success: true,
            status: 200,
            data: data
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