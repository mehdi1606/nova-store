import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isOwner,
} from "@/lib/supabase/config";

/**
 * Guards the /admin area and keeps the owner session fresh. Runs ONLY on
 * /admin routes (see matcher), so the public site is never touched. If Supabase
 * isn't configured yet, admin simply redirects to login.
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isLogin = path === "/admin/login";

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return isLogin ? NextResponse.next() : NextResponse.redirect(loginUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const owner = isOwner(user?.email);

  if (!isLogin && !owner) return NextResponse.redirect(loginUrl);

  if (isLogin && owner) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
