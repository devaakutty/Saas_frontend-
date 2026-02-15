import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/invoices") ||
    pathname.startsWith("/customers");

  const isPaymentPage =
    pathname.startsWith("/payment"); // 🔥 ADD HERE

  let isLoggedIn = false;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    isLoggedIn = res.status === 200;
  } catch {
    isLoggedIn = false;
  }

  // ❌ Not logged in → block protected pages
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // 🚫 DO NOT block payment page
  // Payment page must work even if user not logged in yet

  // ✅ Logged in → block only login/register
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/invoices/:path*",
    "/customers/:path*",
    "/payment/:path*", // 🔥 VERY IMPORTANT
    "/login",
    "/register",
  ],
};
