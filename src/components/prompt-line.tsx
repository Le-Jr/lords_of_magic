import { strings } from "@/lib/strings";

type PromptLineProps = {
  prompt?: string;
};

export function PromptLine({ prompt = strings.landing.prompt }: PromptLineProps) {
  return (
    <p className="text-sm text-term-primary">
      <span className="select-none">{prompt}</span>
      <span
        aria-hidden="true"
        className="ml-2 inline-block h-[1.1em] w-[0.55em] select-none bg-term-primary align-[-0.05em] animate-cursor-blink"
      />
    </p>
  );
}
