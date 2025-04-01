import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // const token = jwt.sign(, process.env.TOKEN_SECRET!, {expiresIn: '1d'} );

        // Example usage of req
        // const token = req.cookies.get("authtoken");

        const response = NextResponse.json({
            message: "Logout Success",
            success: true,
            status: 200
        })

        // response.cookies.set("token", token, { httpOnly: true })
        response.cookies.set("authtoken","", { httpOnly: true, expires: new Date(0) })
        // response.cookies.delete('token')
        return response;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("error :: ", error);
            return NextResponse.json({
                error: error.message,
                success: false,
                status: 500
            });
        }
        return NextResponse.json({
            error: 'An unknown error occurred',
            success: false,
            status: 500
        });
    }

}
