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

  console.log(`[middleware] ${request.method} ${path} | isLogin=${isLogin}`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log("[middleware] Supabase non configuré — variables manquantes dans Vercel");
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

  const hasUser = Boolean(user);
  const owner = isOwner(user?.email);

  // Diagnostic — aucun email, token ou clé n'est loggé
  console.log(
    `[middleware] getUser → hasUser=${hasUser} | isOwner=${owner}` +
    ` | cookies=[${request.cookies.getAll().map((c) => c.name).join(", ") || "aucun"}]`
  );

  if (!isLogin && !owner) {
    console.log("[middleware] Accès refusé → redirect /admin/login");
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && owner) {
    console.log("[middleware] Déjà authentifié → redirect /admin");
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  console.log("[middleware] Laisse passer → NextResponse.next()");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
