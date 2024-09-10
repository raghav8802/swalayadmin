import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import BankData from '@/models/Bank';

export async function POST(request: NextRequest) {
    try {
        await connect();

        const body = await request.json();

        const { labelId, accountDetails } = body;

        let bankDetails = await BankData.findOneAndUpdate(
            { labelId },
            { ...accountDetails }, // Update with the properties of accountDetails
            { new: true, runValidators: true }
        );

        if (bankDetails) {
            return NextResponse.json({
                message: "Bank details updated",
                data: bankDetails,
                success: true,
                status: 201
            });
        } else {
            bankDetails = new BankData({
                labelId, ...accountDetails // Create new entry with account details spread into the document
            });
            const savedBankDetails = await bankDetails.save();

            return NextResponse.json({
                message: "Bank details added",
                data: savedBankDetails,
                success: true,
                status: 201
            });
        }
    } catch (error) {

        return NextResponse.json({
            message: "Internal server error",
            success: false,
            status: 500
        });
    }



}
