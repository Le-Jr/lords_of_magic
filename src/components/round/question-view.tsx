import { useState } from "react";
import type { FormEvent } from "react";

import type { Question } from "@/lib/questions/schema";
import { strings } from "@/lib/strings";

type QuestionViewProps = {
  question: Question;
  current: number;
  total: number;
  timeLeft: number;
  onAnswer: (result: "correct" | "wrong", selected: string) => void;
};

export function QuestionView({
  question,
  current,
  total,
  timeLeft,
  onAnswer,
}: QuestionViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm text-term-secondary">
          {strings.round.questionLabel(current, total)}
          <span className="mx-2 text-term-border">/</span>
          {question.difficulty}
        </p>
        <p className="text-sm font-bold text-term-primary tabular-nums">
          {strings.round.timeLeft(timeLeft)}
        </p>
      </div>

      <div className="border-2 border-term-border px-4 py-3">
        <p className="text-sm text-term-primary whitespace-pre-wrap">
          {question.question_text}
        </p>
      </div>

      {question.type === "multiple_choice" ? (
        <ChoiceList question={question} onAnswer={onAnswer} />
      ) : (
        <TextInput question={question} onAnswer={onAnswer} />
      )}

      <p className="text-xs text-term-secondary">
        {question.type === "multiple_choice"
          ? strings.round.chooseHint
          : strings.round.typeHint}
      </p>
    </div>
  );
}

function ChoiceList({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: QuestionViewProps["onAnswer"];
}) {
  if (question.type !== "multiple_choice" || question.options === null) {
    return null;
  }

  return (
    <ul className="flex flex-col gap-2">
      {question.options.map((option) => (
        <li key={option}>
          <button
            type="button"
            onClick={() =>
              onAnswer(
                option === question.answer ? "correct" : "wrong",
                option,
              )
            }
            className="group flex w-full items-center gap-2 border-2 border-term-border px-3 py-2 text-left text-sm text-term-primary transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none"
          >
            <span
              aria-hidden="true"
              className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
            >
              {">"}
            </span>
            <span>{option}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function TextInput({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: QuestionViewProps["onAnswer"];
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed === "") {
      return;
    }
    const isCorrect =
      trimmed.toLowerCase() === question.answer.trim().toLowerCase();
    onAnswer(isCorrect ? "correct" : "wrong", trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoComplete="off"
        autoFocus
        className="w-full border-2 border-term-border bg-term-bg px-3 py-2 text-sm text-term-primary placeholder:text-term-secondary focus:border-term-primary focus:outline-none"
      />
      <button
        type="submit"
        disabled={value.trim() === ""}
        className="group flex w-fit items-center gap-2 border-2 border-term-border px-3 py-2 text-sm uppercase text-term-primary transition-none hover:bg-term-primary hover:text-term-bg focus:bg-term-primary focus:text-term-bg focus:outline-none disabled:pointer-events-none disabled:text-term-secondary"
      >
        <span
          aria-hidden="true"
          className="text-term-secondary transition-none group-hover:text-term-bg group-focus:text-term-bg"
        >
          {">"}
        </span>
        {strings.round.submit}
      </button>
    </form>
  );
}
