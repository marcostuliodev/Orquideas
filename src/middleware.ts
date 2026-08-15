import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/acervo", "/calendario", "/clima", "/mudas", "/conta"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (isProtected) {
    const token = req.cookies.get("orchid_session")?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/acervo/:path*",
    "/calendario/:path*",
    "/clima/:path*",
    "/mudas/:path*",
    "/conta/:path*",
  ],
};
