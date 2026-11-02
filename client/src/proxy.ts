import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isValidRedirectForRole,
  UserRole,
} from "./_core/utils/authUtils";
import { jwtUtils } from "./_core/utils/jwt";

const readRole = (token?: string): UserRole | null => {
  if (!token) return null;
  const decoded = jwtUtils.decodedToken(token);
  if (!decoded) return null;
  if (typeof decoded.exp === "number" && decoded.exp * 1000 < Date.now()) return null; 
  return decoded.role === "ADMIN" || decoded.role === "USER" ? decoded.role : null;
};

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const routeOwner = getRouteOwner(pathname);
  if (!routeOwner) return NextResponse.next(); 

  const token = request.cookies.get("accessToken")?.value;
  const role = readRole(token);

  if (!role) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    const response = NextResponse.redirect(url);
    if (token) response.cookies.delete("accessToken");
    return response;
  }

  if (!isValidRedirectForRole(pathname, role)) {
    return NextResponse.redirect(new URL(getDefaultDashboardRoute(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin-dashboard/:path*"],
};