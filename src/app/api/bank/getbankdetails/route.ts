import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import BankData from '@/models/Bank';


export async function GET(request: NextRequest) {
    try {
        await connect();

        const { searchParams } = new URL(request.url);
        const labelId = searchParams.get('labelid');

        if (!labelId) {
            return NextResponse.json({
                message: "Labelid required",
                success: false,
                status: 400
            });
        }

        const bankDetails = await BankData.findOne({ labelId });

        if (!bankDetails) {
            return NextResponse.json({
                message: "Bank details not found",
                success: false,
                status: 404
            });
        }

        return NextResponse.json({
            message: "Bank details found",
            data: bankDetails,
            success: true,
            status: 200
        });

    } catch (error) {
        
        console.error('Error fetching bank details:', error);
        return NextResponse.json({
            message: "Internal server error",
            success: true,
            status: 500
        });

    }
}