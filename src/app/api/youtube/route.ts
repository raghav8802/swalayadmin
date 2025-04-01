// Next.js API route - api/youtube/route.ts
import { NextResponse } from 'next/server';

// Helper function to handle the upload process
async function handleUpload(trackUrl: string, ytLabel: string, ytAlbum: string, ytArtist: string, ytIsrc: string, ytstitle: string) {
  const uploadUrl = 'https://swadigi.sourceaudio.com/api/import/upload';
  const publishUrl = 'https://swadigi.sourceaudio.com/api/import/publish';

  // Define the metadata to be sent
  const postData = {
    url: trackUrl,
    'meta[Label]': ytLabel,
    'meta[Title]': ytstitle,
    'meta[Album]': ytAlbum,
    'meta[Artist]': ytArtist,
    'meta[ISRC]': ytIsrc,
  };

  try {
    // Upload request
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 8945-02225d7a191f7b5bc0bf82de1c8e706d',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();
    console.log('Upload successful:', uploadData);

    // Publish request
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 8945-02225d7a191f7b5bc0bf82de1c8e706d',
      },
    });

    if (!publishResponse.ok) {
      throw new Error(`Publish failed: ${publishResponse.statusText}`);
    }

    const publishData = await publishResponse.json();
    console.log('Publish successful:', publishData);

    return { uploadData, publishData };

  } catch (error) {
    console.error('Error during upload and publish:', error);
    throw error;
  }
}

// Define the API route handler
export async function POST(req: Request) {
  try {
    // Parse the incoming data
    const { trackLink, ytLabel, ytAlbum, ytArtist, ytIsrc, ytstitle } = await req.json();
    const trackUrl = trackLink;

    // Call the helper function to handle the upload and publish process
    const result = await handleUpload(trackUrl, ytLabel, ytAlbum, ytArtist, ytIsrc, ytstitle);

    // Send a success response back to the frontend
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Handle the error message if it's an instance of Error
      return NextResponse.json({ success: false, error: error.message });
    }
    // Handle unexpected error types
    return NextResponse.json({ success: false, error: 'An unknown error occurred' });
  }
}
