import Link from "next/link";
import { redirect } from "next/navigation";

import { NicknameForm } from "@/components/nickname-form";
import { PromptLine } from "@/components/prompt-line";
import { isPlaceholderNickname } from "@/lib/nickname";
import { strings } from "@/lib/strings";
import { createClient } from "@/lib/supabase/server";

export default async function NicknamePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims.sub) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", data.claims.sub)
    .single();

  if (!profile || !isPlaceholderNickname(profile.nickname, data.claims.sub)) {
    redirect("/");
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-[40rem] flex-col">
        <PromptLine prompt={strings.nickname.prompt} />

        <section className="mt-16 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-7xl leading-none text-term-primary">
              {strings.nickname.title}
            </h1>
            <p className="text-sm text-term-secondary">
              {strings.nickname.tagline}
            </p>
          </div>

          <NicknameForm
            userId={data.claims.sub}
            defaultNickname={profile.nickname}
          />
        </section>

        <hr className="mt-12 w-full border-t border-dashed border-term-border" />

        <Link
          href="/"
          className="mt-6 w-fit px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
        >
          {strings.nickname.back}
        </Link>

        <p className="mt-4 text-xs text-term-secondary">
          {strings.nickname.hint}
        </p>
      </div>
    </main>
  );
}
