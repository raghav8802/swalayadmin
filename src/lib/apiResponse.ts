import { NextResponse } from 'next/server';

// Define a type for your response structure
export type ResponseType <T>= {
    status: number;
    data: T; // Adjust 'any' as per your specific output type
    success: boolean;
    message: string;
};

// Function to create a standardized response and NextResponse object
export const ApiResponse = <T>(status: number, data: T, success: boolean, message: string) => {
    const responseObject: ResponseType <T> = {
        status,
        data,
        success,
        message,
    };

    return {
        responseObject,
        nextResponse: NextResponse.json(responseObject, { status }),
    };
};

export default ApiResponse; // Export the response function by default