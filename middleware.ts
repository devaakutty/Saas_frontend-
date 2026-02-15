import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/customers");

  const isPaymentPage =
    pathname.startsWith("/payment");

  let isLoggedIn = false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    isLoggedIn = res.status === 200;
  } catch {
    isLoggedIn = false;
  }

  // ❌ Block protected pages if NOT logged in
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // ✅ Block login/register if already logged in
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
