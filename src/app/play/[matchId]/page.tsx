import { PromptLine } from "@/components/prompt-line";
import { Round } from "@/components/round/round";
import { CATEGORY_SLUG_TO_DISPLAY } from "@/lib/questions/schema";
import { getRoundQuestions, isCategorySlug } from "@/lib/questions/round";
import { createClient } from "@/lib/supabase/server";
import { strings } from "@/lib/strings";
import { getUserStatus } from "@/lib/user-status";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  if (!isCategorySlug(matchId)) {
    return <ErrorScreen message={strings.round.errorMatchNotFound} />;
  }

  const supabase = await createClient();
  const [questions, status] = await Promise.all([
    getRoundQuestions(matchId),
    getUserStatus(supabase),
  ]);

  if (questions.length === 0) {
    return <ErrorScreen message={strings.round.errorNoQuestions} userStatus={status} />;
  }

  return (
    <Round
      questions={questions}
      categorySlug={matchId}
      categoryDisplay={CATEGORY_SLUG_TO_DISPLAY[matchId]}
      userStatus={status}
    />
  );
}

function ErrorScreen({ message, userStatus }: { message: string; userStatus?: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-[40rem] flex-col">
        <PromptLine prompt={strings.play.prompt} userStatus={userStatus} />

        <section className="mt-16">
          <h1 className="font-display text-5xl leading-none text-term-primary">
            {message}
          </h1>
        </section>
      </div>
    </main>
  );
}
