import { NextRequest, NextResponse } from "next/server";

import * as session from "@/lib/auth/session";

const publicRoutes = ["/login"];

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const accessToken = await session.getAccessToken();
  const refreshToken = await session.getRefreshToken();

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    const sessionRefreshed = await session.refreshSession(refreshToken);

    if (sessionRefreshed) {
      const response = isPublicRoute
        ? NextResponse.redirect(new URL("/", request.nextUrl))
        : NextResponse.next();

      session.setSessionResponseCookies(response, sessionRefreshed);
      return response;
    }

    const response = isPublicRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.nextUrl));

    session.deleteSessionResponseCookies(response);
    return response;
  }

  if (!isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
