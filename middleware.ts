import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get("token")?.value;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/customers");

  const isPaymentPage =
    pathname.startsWith("/payment");

  const isLoggedIn = !!token;

  // ❌ Not logged in → block protected pages
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // ✅ Logged in → block login/register
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // ✅ Always allow payment page
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/invoices/:path*",
    "/customers/:path*",
    "/payment/:path*",
    "/login",
    "/register",
  ],
};
