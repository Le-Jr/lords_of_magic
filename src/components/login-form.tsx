"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { strings } from "@/lib/strings";

type Provider = "google" | "discord";

const GOOGLE_ICON_PATH =
  "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z";

const DISCORD_ICON_PATH =
  "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z";

type ProviderIconProps = {
  provider: Provider;
};

function ProviderIcon({ provider }: ProviderIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[1em] w-[1em] shrink-0 fill-current"
    >
      <path d={provider === "google" ? GOOGLE_ICON_PATH : DISCORD_ICON_PATH} />
    </svg>
  );
}

type OAuthButtonProps = {
  provider: Provider;
  label: string;
  onSignIn: (provider: Provider) => void;
};

function OAuthButton({ provider, label, onSignIn }: OAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSignIn(provider)}
      className="group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
    >
      <span
        aria-hidden="true"
        className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
      >
        {">"}
      </span>
      <ProviderIcon provider={provider} />
      <span>{label}</span>
    </button>
  );
}

type LoginFormProps = {
  errorParam?: string;
};

export function LoginForm({ errorParam }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: Provider) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(strings.login.errorGeneric);
    }
  };

  const errorMessage =
    errorParam === "auth-code" ? strings.login.errorAuthCode : error;

  return (
    <div className="flex flex-col gap-1">
      <OAuthButton
        provider="google"
        label={strings.login.google}
        onSignIn={handleSignIn}
      />
      <OAuthButton
        provider="discord"
        label={strings.login.discord}
        onSignIn={handleSignIn}
      />
      {errorMessage ? (
        <p className="mt-4 text-sm font-bold text-term-primary">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
