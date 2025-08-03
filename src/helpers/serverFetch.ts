// helpers/serverFetch.ts
export function apiUrl(path: string) {
  // In server components we need an absolute URL
  const host =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL          // https://myapp.com
      : "http://localhost:3000";                // dev / build-start

      console.log('API URL:', host + path); // Debug log
  return `${host}${path}`;
}