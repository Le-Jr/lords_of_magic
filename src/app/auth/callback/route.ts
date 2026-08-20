import { NextRequest, NextResponse } from "next/server";

import { isPlaceholderNickname } from "@/lib/nickname";
import { createRouteClient } from "@/lib/supabase/server";

function withCookies(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach(({ name, value }) => {
    target.cookies.set(name, value);
  });
  return target;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next")?.startsWith("/")
    ? searchParams.get("next")!
    : "/";

  if (code) {
    const { supabase, response: supabaseResponse } = createRouteClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data } = await supabase.auth.getClaims();

      if (data?.claims.sub) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", data.claims.sub)
          .single();

        if (
          profile &&
          isPlaceholderNickname(profile.nickname, data.claims.sub)
        ) {
          return withCookies(
            NextResponse.redirect(`${origin}/auth/nickname`),
            supabaseResponse,
          );
        }
      }

      return withCookies(
        NextResponse.redirect(`${origin}${next}`),
        supabaseResponse,
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code`);
}
