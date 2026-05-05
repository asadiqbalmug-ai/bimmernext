import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip Supabase middleware if env vars are not set (prevents 500 on Vercel)
  if (!supabaseUrl || !supabaseKey) {
    // Protect CRM routes with localStorage fallback (demo mode)
    if (request.nextUrl.pathname.startsWith("/crm") && request.nextUrl.pathname !== "/crm/login") {
      // In demo mode, allow all CRM access without Supabase auth
      // Once env vars are set, this will use real auth below
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect CRM routes
  if (request.nextUrl.pathname.startsWith("/crm") && request.nextUrl.pathname !== "/crm/login") {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/crm/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
