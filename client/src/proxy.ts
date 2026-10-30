import { NextRequest, NextResponse } from "next/server";
import { getRouteOwner, isValidRedirectForRole } from "./_core/utils/authUtils";
import { jwtUtils } from "./_core/utils/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  const routeOwner = getRouteOwner(pathname);

  if (routeOwner && !accessToken) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));
  }

  if (accessToken) {
    const decoded = jwtUtils.decodedToken(accessToken);
    const userRole = decoded?.role; 
    const userStatus = decoded?.status;


    // BLOCKED user dashboard
    if (userStatus === "BLOCKED" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/blocked", request.url));
    }

    if (routeOwner && !isValidRedirectForRole(pathname, userRole)) {
      return NextResponse.redirect(new URL("/login", request.url)); 
    }
    
    if (pathname === "/login" || pathname === "/register") {
       return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", 
    "/admin-dashboard/:path*",
      "/login", 
      "/register",
      "/blocked"],
};