import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND = "https://ai-dental-receptionist-backend.onrender.com";
const LANDING_PAGE_BASE = "https://mysmileconsult.co";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Only handle requests to *.mysmileconsult.co (excluding the base domain itself)
  // e.g. implants.radiantdental.com.mysmileconsult.co → subdomain = "implants.radiantdental.com"
  const isSubdomain =
    hostname.endsWith(".mysmileconsult.co") &&
    !hostname.startsWith("www.") &&
    hostname !== "mysmileconsult.co" &&
    hostname !== "www.mysmileconsult.co";

  if (!isSubdomain) {
    return NextResponse.next(); // Let the normal routing handle it
  }

  // Extract subdomain (e.g. "implants.radiantdental" from "implants.radiantdental.mysmileconsult.co")
  const subdomain = hostname
    .replace(".mysmileconsult.co", "")
    .replace(/^www\./, "");

  if (!subdomain) {
    return NextResponse.next();
  }

  try {
    // Call the backend to resolve subdomain → tenant/procedure
    const res = await fetch(
      `${BACKEND}/marketing/config/subdomain/${encodeURIComponent(subdomain)}`,
      { next: { revalidate: 60 } } // cache for 60s
    );

    if (res.status === 404) {
      // No tenant mapped to this subdomain — show a friendly not-found
      return new NextResponse(
        `<html><body style="background:#0a1628;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:20px">
          <div>
            <div style="font-size:64px;margin-bottom:16px">🦷</div>
            <h1 style="font-size:24px;font-weight:800;margin-bottom:8px">Page not found</h1>
            <p style="color:rgba(255,255,255,0.5);margin-bottom:24px">No landing page is connected to this subdomain yet.</p>
            <a href="https://iamclara.ai" style="color:#2dd4bf;font-size:14px">Powered by Clara AI</a>
          </div>
        </html>`,
        { headers: { "content-type": "text/html" }, status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.next(); // Fail gracefully — don't break the site
    }

    const data = await res.json();
    const { tenant_id, procedure_id } = data;

    // Redirect to the proper landing page URL with the resolved tenant + procedure
    const targetUrl = `${LANDING_PAGE_BASE}/p/${tenant_id}/${procedure_id}`;
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.href = targetUrl;

    // Preserve query params (UTM, etc.)
    return NextResponse.redirect(redirectUrl, 302);
  } catch (err) {
    // Network error — fail gracefully
    console.error("[Clara Subdomain] Resolution error:", err);
    return NextResponse.next();
  }
}

export const config = {
  // Only run this middleware for subdomain requests
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - static files
     * - favicon
     * - Next.js internals
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
