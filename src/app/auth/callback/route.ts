import { NextResponse } from "next/server";

import { isPlaceholderNickname } from "@/lib/nickname";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next")?.startsWith("/")
    ? searchParams.get("next")!
    : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data } = await supabase.auth.getClaims();

      if (data?.claims.sub) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname")
          .eq("id", data.claims.sub)
          .single();

        if (profile && isPlaceholderNickname(profile.nickname, data.claims.sub)) {
          return NextResponse.redirect(`${origin}/auth/nickname`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-code`);
}
