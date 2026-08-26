import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "fr"] as const;
const defaultLocale = "en";

function localeFromPath(pathname: string) {
  const segment = pathname.split("/")[1];
  return locales.find((locale) => locale === segment);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = localeFromPath(pathname);

  if (locale) {
    let rest = pathname.slice(locale.length + 1) || "/";
    if (!rest.startsWith("/")) rest = `/${rest}`;

    const nested = localeFromPath(rest);
    if (nested) {
      const after = rest.slice(nested.length + 1) || "/";
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${after === "/" ? "" : after}`;
      return NextResponse.redirect(url);
    }

    const url = request.nextUrl.clone();
    url.pathname = rest;
    const headers = new Headers(request.headers);
    headers.set("x-locale", locale);
    const response = NextResponse.rewrite(url, { request: { headers } });
    response.cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });
    return response;
  }

  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  const next = locales.find((locale) => locale === cookie) ?? defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${next}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
