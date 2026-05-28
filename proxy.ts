import { NextRequest, NextResponse } from "next/server";

import {
  deleteSessionResponseCookies,
  getAccessToken,
  getRefreshToken,
  setSessionResponseCookies,
} from "@/lib/auth/session";
import { bootEnv } from "@/lib/config/bootConfig";
import type { LoginResponse } from "@/types/auth";

const publicRoutes = ["/login"];

async function refreshSession(refreshToken: string) {
  try {
    const response = await fetch(
      `${bootEnv.AUTHENTICATOR_SERVICE_URL}/api/v1/users/refresh`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      },
    );

    if (!response.ok) return null;

    const body = (await response.json()) as LoginResponse;
    return body.data;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    const session = await refreshSession(refreshToken);

    if (session) {
      const response = isPublicRoute
        ? NextResponse.redirect(new URL("/", request.nextUrl))
        : NextResponse.next();

      setSessionResponseCookies(response, session);
      return response;
    }

    const response = isPublicRoute
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.nextUrl));

    deleteSessionResponseCookies(response);
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
