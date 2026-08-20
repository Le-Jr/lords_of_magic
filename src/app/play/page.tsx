import Link from "next/link";

import { Menu } from "@/components/menu";
import type { MenuLink } from "@/components/menu";
import { PromptLine } from "@/components/prompt-line";
import {
  CATEGORY_SLUG_TO_DISPLAY,
  QUESTION_CATEGORY_SLUGS,
} from "@/lib/questions/schema";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { getUserStatus } from "@/lib/user-status";

const categoryLinks: MenuLink[] = QUESTION_CATEGORY_SLUGS.map((slug) => ({
  href: `/play/${slug}`,
  label: CATEGORY_SLUG_TO_DISPLAY[slug],
}));

export default async function PlayPage() {
  const supabase = await createClient();
  const status = await getUserStatus(supabase);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-[40rem] flex-col">
        <PromptLine prompt={strings.play.prompt} userStatus={status} />

        <section className="mt-16 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-7xl leading-none text-term-primary">
              {strings.play.title}
            </h1>
            <p className="text-sm text-term-secondary">
              {strings.play.tagline}
            </p>
          </div>

          <Menu label="Category menu" links={categoryLinks} />
        </section>

        <hr className="mt-12 w-full border-t border-dashed border-term-border" />

        <Link
          href="/"
          className="mt-6 w-fit px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
        >
          {strings.play.back}
        </Link>

        <p className="mt-4 text-xs text-term-secondary">{strings.play.hint}</p>
      </div>
    </main>
  );
}
