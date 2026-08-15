import Link from "next/link";

import { strings } from "@/lib/strings";

type ResultViewProps = {
  score: number;
  xp: number;
  playAgainHref: string;
};

export function ResultView({ score, xp, playAgainHref }: ResultViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-6xl leading-none text-term-primary">
          {strings.round.endTitle}
        </h1>
        <p className="text-xs text-term-secondary">{strings.round.hint}</p>
      </div>

      <div className="flex flex-col gap-1 border-2 border-term-border px-4 py-3 text-sm">
        <p className="flex items-baseline justify-between gap-8 text-term-primary">
          <span>{strings.round.totalScore}</span>
          <span className="font-bold tabular-nums">{score}</span>
        </p>
        <p className="flex items-baseline justify-between gap-8 text-term-primary">
          <span>{strings.round.xpEarned}</span>
          <span className="font-bold tabular-nums">{xp}</span>
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <Link
          href={playAgainHref}
          className="group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
        >
          <span
            aria-hidden="true"
            className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
          >
            {">"}
          </span>
          {strings.round.playAgain}
        </Link>
        <Link
          href="/play"
          className="group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
        >
          <span
            aria-hidden="true"
            className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
          >
            {">"}
          </span>
          {strings.round.backToLobby}
        </Link>
      </div>
    </div>
  );
}
