/** @type {import('next').NextConfig} */
const nextConfig = {
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "swalay-music-files.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },

      {
        protocol: "https",
        hostname: "swalay-test-files.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  
  // Add experimental features for better static generation
  experimental: {
    // Enable server components for better performance
    serverComponentsExternalPackages: ['mongoose'],
  },
  
  // Configure static generation behavior
  staticPageGenerationTimeout: 120, // 2 minutes timeout
  
  // Handle build errors gracefully
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  //   eslint: {
  //     ignoreDuringBuilds: true,
  // },

    async headers() {
    return [
      {
        source: '/api/albums/getAlbums',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/albums/getAlbumsDetails',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/track/getTracks',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/shemaroo/getalbums',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/shemaroo/updatealbumstatus',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/api/shemaroo/login',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://shemaroo.swalayplus.in' }, //here will the origin domain of your frontend app
          { key: 'Access-Control-Allow-Methods', value: 'POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  }
};

export default nextConfig;
