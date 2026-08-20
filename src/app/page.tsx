import { Menu } from "@/components/menu";
import type { MenuItem } from "@/components/menu";
import { Pong } from "@/components/pong";
import { PromptLine } from "@/components/prompt-line";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { getUserStatus } from "@/lib/user-status";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const status = await getUserStatus(supabase);

  const authLink: MenuItem = data.user
    ? { action: "/auth/logout", label: strings.landing.logout }
    : { href: "/login", label: strings.landing.login };

  const settingsLink: MenuItem | null = data.user
    ? { href: "/settings", label: strings.settings.title }
    : null;

  const menuLinks: MenuItem[] = [
    { href: "/play", label: strings.landing.play },
    { href: "/ranking", label: strings.landing.ranking },
    ...(settingsLink ? [settingsLink] : []),
    authLink,
  ];
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-[40rem] flex-col">
        <PromptLine userStatus={status} />

        <section className="mt-16 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-7xl leading-none text-term-primary">
              {strings.landing.title}
            </h1>
            <p className="text-sm text-term-secondary">
              {strings.landing.tagline}
            </p>
          </div>

          <Pong />

          <div className="flex flex-col gap-1 text-xs text-term-secondary">
            {strings.landing.description.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>

        <nav className="mt-12">
          <Menu label="Main menu" links={menuLinks} />
        </nav>

        <hr className="mt-12 w-full border-t border-dashed border-term-border" />

        <footer className="mt-6 flex flex-col gap-1 text-xs text-term-secondary">
          <p>{strings.landing.version}</p>
          <p>{strings.landing.hint}</p>
        </footer>
      </div>
    </main>
  );
}
