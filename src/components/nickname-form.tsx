"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

import { NICKNAME_MAX_LENGTH } from "@/lib/nickname";
import { createClient } from "@/lib/supabase/client";
import { strings } from "@/lib/strings";

type NicknameFormProps = {
  userId: string;
  defaultNickname: string;
};

export function NicknameForm({ userId, defaultNickname }: NicknameFormProps) {
  const [nickname, setNickname] = useState(defaultNickname);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const saveNickname = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(strings.nickname.errorRequired);
      return;
    }
    if (trimmed.length > NICKNAME_MAX_LENGTH) {
      setError(strings.nickname.errorTooLong);
      return;
    }

    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ nickname: trimmed })
      .eq("id", userId);

    if (error) {
      setError(
        error.code === "23505"
          ? strings.nickname.errorTaken
          : strings.nickname.errorFailed,
      );
      setPending(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void saveNickname(nickname);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <label
          htmlFor="nickname"
          className="text-sm uppercase text-term-secondary"
        >
          {strings.nickname.inputLabel}
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          maxLength={NICKNAME_MAX_LENGTH}
          onChange={(event) => setNickname(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={pending}
          autoComplete="off"
          spellCheck={false}
          className="w-full min-w-0 flex-1 border-2 border-term-border bg-term-bg px-2 py-1 font-body text-sm text-term-primary caret-term-primary transition-none focus:border-term-primary focus:bg-term-primary focus:text-term-bg focus:caret-term-bg focus:outline-none disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => void saveNickname(nickname)}
          disabled={pending}
          className="group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none disabled:opacity-50"
        >
          <span
            aria-hidden="true"
            className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
          >
            {">"}
          </span>
          <span>{strings.nickname.confirm}</span>
        </button>
        <button
          type="button"
          onClick={() => void saveNickname(defaultNickname)}
          disabled={pending}
          className="group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none disabled:opacity-50"
        >
          <span
            aria-hidden="true"
            className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
          >
            {">"}
          </span>
          <span>{strings.nickname.keepDefault}</span>
        </button>
      </div>

      {error ? (
        <p className="text-sm font-bold text-term-primary">{error}</p>
      ) : null}
    </div>
  );
}
