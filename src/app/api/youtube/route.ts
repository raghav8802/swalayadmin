// Next.js API route - api/youtube/route.ts
import { NextResponse } from 'next/server';

// Define interfaces for type safety
interface UploadMetadata {
  url: string;
  'meta[Label]': string;
  'meta[Title]': string;
  'meta[Album]': string;
  'meta[Artist]': string;
  'meta[ISRC]': string;
}

interface UploadResponse {
  uploadData: any;
  publishData: any;
}

interface CopyrightRequest {
  labelId: string;
  link: string;
}

interface ReleaseClaimRequest {
  release: Array<{
    type: 'claim' | 'video' | 'channel' | 'track';
    id: string | number;
  }>;
}

interface ReleaseClaimResponse {
  id: string | number;
  type: string;
  success: number;
  claim_total?: number;
  error?: {
    code: number;
    reason: string;
    msg: string;
  };
  result?: Array<{
    claim_id: string;
    success: number;
    error?: {
      code: number;
      reason: string;
      msg: string;
    };
  }>;
}

// Validate required fields
function validateInput(data: any): { isValid: boolean; error?: string } {
  const requiredFields = ['trackLink', 'ytLabel', 'ytAlbum', 'ytArtist', 'ytIsrc', 'ytstitle'];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      return { isValid: false, error: `Missing required field: ${field}` };
    }
  }

  // Validate URL format
  try {
    new URL(data.trackLink);
  } catch {
    return { isValid: false, error: 'Invalid track URL format' };
  }

  return { isValid: true };
}

// Helper function to handle the upload process
async function handleUpload(
  trackUrl: string,
  ytLabel: string,
  ytAlbum: string,
  ytArtist: string,
  ytIsrc: string,
  ytstitle: string
): Promise<UploadResponse> {
  const uploadUrl = 'https://swadigi.sourceaudio.com/api/import/upload';
  const publishUrl = 'https://swadigi.sourceaudio.com/api/import/publish';
  
  // Hardcoded API token
  const apiToken = '8945-02225d7a191f7b5bc0bf82de1c8e706d';

  // Define the metadata to be sent
  const postData: UploadMetadata = {
    url: trackUrl,
    'meta[Label]': ytLabel,
    'meta[Title]': ytstitle,
    'meta[Album]': ytAlbum,
    'meta[Artist]': ytArtist,
    'meta[ISRC]': ytIsrc,
  };

  const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    // Upload request
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(postData),
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => null);
      throw new Error(`Upload failed: ${errorData?.error || uploadResponse.statusText}`);
    }

    const uploadData = await uploadResponse.json();

    // Publish request
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Accept': 'application/json',
      },
    });

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json().catch(() => null);
      throw new Error(`Publish failed: ${errorData?.error || publishResponse.statusText}`);
    }

    const publishData = await publishResponse.json();
    return { uploadData, publishData };

  } catch (error) {
    throw error;
  }
}

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper function to handle claim release
async function handleReleaseClaim(releaseData: ReleaseClaimRequest): Promise<ReleaseClaimResponse[]> {
  const releaseUrl = 'https://swadigi.sourceaudio.com/api/contentid/releaseClaim';
  const apiToken = '8945-02225d7a191f7b5bc0bf82de1c8e706d';

  const headers = {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  try {
    const response = await fetch(releaseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(releaseData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Release claim failed: ${errorData?.error || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Define the API route handler
export async function POST(req: Request) {
  try {
    // Parse the incoming data
    const data = await req.json();
    
    // Check if this is a release claim request
    if (data.release && Array.isArray(data.release)) {
      const result = await handleReleaseClaim(data as ReleaseClaimRequest);
      return NextResponse.json({ success: true, result });
    }
    
    // Handle track upload request
    const { trackLink, ytLabel, ytAlbum, ytArtist, ytIsrc, ytstitle } = data;

    // Validate input
    const validation = validateInput(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Process the upload
    const result = await handleUpload(
      trackLink,
      ytLabel,
      ytAlbum,
      ytArtist,
      ytIsrc,
      ytstitle
    );

    // Send a success response back to the frontend
    return NextResponse.json({ 
      success: true, 
      result,
      message: 'Track uploaded and published successfully'
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}
