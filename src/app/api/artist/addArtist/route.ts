import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
// import { writeFile, mkdir } from 'fs/promises';
// import path from 'path';
import Artist from '@/models/Artists';



export async function POST(request: NextRequest) {



  console.log("in artist --");
  try {
    await connect();  // Connect to the database

    console.log("in artist ");

    const reqBody = await request.json()
    console.log(reqBody)


    // Validate required fields
    if (!reqBody.artistName) {
      return NextResponse.json({
        message: "Artist name required",
        success: false,
        status: 400
      })
    }


    // Create and save the new artist
    const newartist = new Artist(reqBody);
    const savedartist = await newartist.save();
    console.log("saved artist data")

    return NextResponse.json({
      message: "Artist name required",
      data: reqBody,
      success: true,
      status: 201
    })


  } catch (error: any) {
    console.error('Error creating artist:', error);
    return NextResponse.json({
      error: error.message || 'An unknown error occurred',
      success: false,
      status: 500
    }, { status: 500 });
  }


}