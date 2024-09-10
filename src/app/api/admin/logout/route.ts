import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // const token = jwt.sign(, process.env.TOKEN_SECRET!, {expiresIn: '1d'} );


        const response = NextResponse.json({
            message: "Logout Success",
            success: true,
            status: 200
        })

        // response.cookies.set("token", token, { httpOnly: true })
        response.cookies.set("authtoken","", { httpOnly: true, expires: new Date(0) })
        // response.cookies.delete('token')
        return response;

    } catch (error: any) {
        console.log("error :: ");
        console.log(error);
        return NextResponse.json({
            error: error.message,
            success: false,
            status: 500
        })

    }

}
