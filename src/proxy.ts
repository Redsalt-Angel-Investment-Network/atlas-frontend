import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "./utils/apiClient";


const locales = ["en", "fr"] as const;
const defaultLocale = "en";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/password-reset",
];

function localeFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return locales.find((locale) => locale === segment);
}

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = localeFromPath(pathname);

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const accessToken = request.cookies.get("accessToken")?.value;

  const hasValidToken = Boolean(
    accessToken && !isTokenExpired(accessToken)
  );

  /*
   * =========================================================
   * LOCALE PATH
   * =========================================================
   *
   * /en/login
   * /fr/dashboard
   * /en/leaves
   */

  if (locale) {
    let rest = pathname.slice(locale.length + 1) || "/";

    if (!rest.startsWith("/")) {
      rest = `/${rest}`;
    }

    /*
     * Prevent duplicated locales:
     *
     * /en/en/dashboard → /en/dashboard
     * /fr/fr/login     → /fr/login
     */
    const nested = localeFromPath(rest);

    if (nested) {
      const after = rest.slice(nested.length + 1) || "/";

      const url = request.nextUrl.clone();

      url.pathname = `/${locale}${after === "/" ? "" : after}`;

      return NextResponse.redirect(url);
    }

    /*
     * =======================================================
     * AUTH GUARD
     * =======================================================
     */

    const publicPage = isPublicPath(rest);

    // Not authenticated → protected page
    if (!hasValidToken && !publicPage) {
      const url = request.nextUrl.clone();

      url.pathname = `/${locale}/login`;

      return NextResponse.redirect(url);
    }

    // Authenticated → auth page
    if (hasValidToken && publicPage) {
      const url = request.nextUrl.clone();

      url.pathname = `/${locale}/dashboard`;

      return NextResponse.redirect(url);
    }

    /*
     * =======================================================
     * INTERNAL REWRITE
     * =======================================================
     *
     * /en/dashboard → /dashboard
     * /fr/leaves    → /leaves
     */

    const url = request.nextUrl.clone();

    url.pathname = rest;

    const headers = new Headers(request.headers);

    headers.set("x-locale", locale);

    const response = NextResponse.rewrite(url, {
      request: {
        headers,
      },
    });

    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      sameSite: "lax",
    });

    return response;
  }

  /*
   * =========================================================
   * MISSING LOCALE
   * =========================================================
   *
   * /dashboard → /en/dashboard
   * /login     → /en/login
   */

  const cookie = request.cookies.get("NEXT_LOCALE")?.value;

  const next =
    locales.find((locale) => locale === cookie) ?? defaultLocale;

  const rest = pathname === "/" ? "" : pathname;

  /*
   * We need to check auth here too because someone can directly
   * visit /dashboard instead of /en/dashboard.
   */

  const publicPage = isPublicPath(pathname);

  if (!hasValidToken && !publicPage) {
    const url = request.nextUrl.clone();

    url.pathname = `/${next}/login`;

    return NextResponse.redirect(url);
  }

  if (hasValidToken && publicPage) {
    const url = request.nextUrl.clone();

    url.pathname = `/${next}/dashboard`;

    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();

  url.pathname = `/${next}${rest}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};