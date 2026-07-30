import { NextResponse, type NextRequest } from "next/server";
import { getAuth0 } from "./lib/auth0";

export async function middleware(request: NextRequest) {
  const auth0 = getAuth0();
  if (!auth0) return NextResponse.next();
  return auth0.middleware(request);
}

export const config = {
  // Auth0 mounts /auth/login, /auth/logout and /auth/callback here. Static
  // assets and published pieces don't need to touch the session.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
