import Link from "next/link";

import { PromptLine } from "@/components/prompt-line";
import { getRankingPage, RANKING_PAGE_SIZE } from "@/lib/ranking";
import type { RankingRow } from "@/lib/ranking";
import { strings } from "@/lib/strings";
import { titleFromXp } from "@/lib/titles";

type RankingPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function RankingPage({ searchParams }: RankingPageProps) {
  const params = await searchParams;
  const rawPage = Array.isArray(params.page) ? params.page[0] : params.page;
  const requestedPage = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  const { rows, total, totalPages, page } = await getRankingPage(requestedPage);

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-[40rem] flex-col">
        <PromptLine prompt={strings.ranking.prompt} />

        <section className="mt-16 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <h1 className="font-display text-7xl leading-none text-term-primary">
              {strings.ranking.title}
            </h1>
            <p className="text-sm text-term-secondary">
              {strings.ranking.tagline}
            </p>
          </div>

          {total === 0 ? (
            <p className="text-sm text-term-primary">{strings.ranking.empty}</p>
          ) : (
            <RankingTable page={page} rows={rows} />
          )}
        </section>

        <hr className="mt-12 w-full border-t border-dashed border-term-border" />

        <nav
          aria-label={strings.ranking.title}
          className="mt-6 flex items-center justify-between gap-4"
        >
          {page > 1 ? (
            <Link
              href={`/ranking?page=${page - 1}`}
              className="px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
            >
              {strings.ranking.previous}
            </Link>
          ) : (
            <span className="px-2 py-1 text-sm uppercase text-term-secondary whitespace-nowrap">
              {strings.ranking.previous}
            </span>
          )}

          <p className="text-sm text-term-secondary tabular-nums">
            {strings.ranking.page(page, totalPages)}
          </p>

          {page < totalPages ? (
            <Link
              href={`/ranking?page=${page + 1}`}
              className="px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
            >
              {strings.ranking.next}
            </Link>
          ) : (
            <span className="px-2 py-1 text-sm uppercase text-term-secondary whitespace-nowrap">
              {strings.ranking.next}
            </span>
          )}
        </nav>

        <Link
          href="/"
          className="mt-4 w-fit px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
        >
          {strings.ranking.back}
        </Link>
      </div>
    </main>
  );
}

function RankingTable({ page, rows }: { page: number; rows: RankingRow[] }) {
  const offset = (page - 1) * RANKING_PAGE_SIZE;

  return (
    <table className="w-full border-2 border-term-border">
      <thead>
        <tr className="border-b border-dashed border-term-border text-xs uppercase text-term-secondary">
          <th scope="col" className="px-4 py-2 text-left font-normal">
            {strings.ranking.rank}
          </th>
          <th scope="col" className="px-4 py-2 text-left font-normal">
            {strings.ranking.player}
          </th>
          <th scope="col" className="px-4 py-2 text-left font-normal">
            {strings.ranking.titleCol}
          </th>
          <th scope="col" className="px-4 py-2 text-right font-normal">
            {strings.ranking.xp}
          </th>
          <th scope="col" className="px-4 py-2 text-right font-normal">
            {strings.ranking.matches}
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.nickname}-${offset + index}`}>
            <td className="px-4 py-2 text-sm text-term-secondary tabular-nums">
              {offset + index + 1}
            </td>
            <td className="px-4 py-2 text-sm text-term-primary">{row.nickname}</td>
            <td className="px-4 py-2 text-sm text-term-primary">
              {titleFromXp(row.xp_total)}
            </td>
            <td className="px-4 py-2 text-sm text-term-primary tabular-nums text-right">
              {row.xp_total}
            </td>
            <td className="px-4 py-2 text-sm text-term-primary tabular-nums text-right">
              {row.matches_played}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
