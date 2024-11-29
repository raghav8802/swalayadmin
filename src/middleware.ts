import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname.toLowerCase(); // Ensure case-insensitivity

  // Allow API routes and static files to bypass checks
  if (path.startsWith("/_next") || path.startsWith("/api") || path === "/favicon.ico") {
    return NextResponse.next();
  }

  // Define public and role-based paths publick path
  const isPublicPath =
    path === "/register" ||
    path === "/signin" ||
    path === "/verifyemail" ||
    path === "/forgotpassword";

  const roleAllowedPaths = {
    customerSupport: ["/", "/albums", "/copyrights", "/labels", "/support"],
    contentDeployment: ["/", "/albums", "/copyrights", "/artists", "/support"],
    ANR: ["/", "/albums", "/marketing", "/artists", "/notifications"],
  };

  // Get the token
  const token = request.cookies.get("authtoken")?.value || "";

  // If it's a public path, allow access without token or role validation
  if (isPublicPath) {
    return NextResponse.next();
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
      const { payload } = await jwtVerify(token, secret);

      const { usertype } = payload as { usertype: string };

      // Admin has unrestricted access
      if (usertype === "admin") {
        return NextResponse.next();
      }

      // Validate access for other roles
      const allowedPaths = roleAllowedPaths[usertype as keyof typeof roleAllowedPaths];

      if (allowedPaths) {
        // Check if the current path is included in allowed paths or starts with one of the allowed parent paths
        const hasAccess = allowedPaths.some((allowedPath) => {
          // If the path is an exact match or the path starts with the allowed path
          return path === allowedPath || path.startsWith(allowedPath + "/");
        });

        if (!hasAccess) {
          // Redirect to home if the user tries to access an unauthorized path
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      // If everything checks out, allow access
      return NextResponse.next();

    } catch (error: any) {
      console.error("Token verification failed:", error.message);
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  } else {
    console.log("No token found. Redirecting to sign-in.");
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

// Middleware configuration
export const config = {
  matcher: [
    "/signin",
    "/register",
    "/verifyemail",
    "/forgotpassword",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
