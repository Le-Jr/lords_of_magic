import type { Question } from "@/lib/questions/schema";
import { scoreQuestion } from "@/lib/scoring";
import type { AnswerResult } from "@/lib/scoring";
import { strings } from "@/lib/strings";

type FeedbackViewProps = {
  question: Question;
  result: AnswerResult;
  selected: string | null;
  current: number;
  total: number;
  score: number;
  isLast: boolean;
  onNext: () => void;
};

export function FeedbackView({
  question,
  result,
  selected,
  current,
  total,
  score,
  isLast,
  onNext,
}: FeedbackViewProps) {
  const points = scoreQuestion(question.difficulty, result);
  const label =
    result === "correct"
      ? strings.round.correct
      : result === "wrong"
        ? strings.round.wrong
        : strings.round.noAnswer;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-term-secondary">
          {strings.round.questionLabel(current, total)}
          <span className="mx-2 text-term-border">/</span>
          {question.difficulty}
        </p>
        <p className="text-sm font-bold text-term-primary tabular-nums">
          {strings.round.scoreSoFar} {score}
        </p>
      </div>

      <p className="text-sm font-bold text-term-primary">
        {label} {strings.round.points(points)}
      </p>

      {selected !== null ? (
        <p className="text-sm text-term-primary">
          {strings.round.yourAnswer} {selected}
        </p>
      ) : null}

      {result !== "correct" ? (
        <p className="text-sm text-term-primary">
          {strings.round.correctAnswer} {question.answer}
        </p>
      ) : null}

      <div className="border-2 border-term-border px-4 py-3">
        <p className="text-xs text-term-secondary whitespace-pre-wrap">
          {"// "}
          {question.explanation}
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="group flex w-fit items-center gap-2 px-2 py-1 text-sm uppercase text-term-primary whitespace-nowrap transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
      >
        <span
          aria-hidden="true"
          className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
        >
          {">"}
        </span>
        {isLast ? strings.round.endRound : strings.round.next}
      </button>
    </div>
  );
}
