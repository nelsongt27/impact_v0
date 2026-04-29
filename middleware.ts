import { NextResponse, type NextRequest } from "next/server";

// HTTP Basic Auth gate. Active only when DASHBOARD_USER and DASHBOARD_PASS
// are both set in the environment — local dev without those vars stays open.
export function middleware(req: NextRequest) {
  const user = process.env.DASHBOARD_USER;
  const pass = process.env.DASHBOARD_PASS;
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const expected = `Basic ${btoa(`${user}:${pass}`)}`;
    if (auth === expected) return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Axialent Impact"' },
  });
}

export const config = {
  // Apply to everything except Next internals and static asset paths.
  matcher: ["/((?!_next/|favicon|robots|sitemap).*)"],
};
