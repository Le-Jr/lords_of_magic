"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { strings } from "@/lib/strings";

type Provider = "google" | "discord";

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
