import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/services", "/support", "/login", "/signup"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith("/api/auth"))

  // If trying to access protected route without session
  if (!sessionCookie && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If logged in and trying to access login/signup, redirect to dashboard
  if (sessionCookie && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth).*)"],
}
