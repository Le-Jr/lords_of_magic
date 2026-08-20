import { strings } from "@/lib/strings";

type PromptLineProps = {
  prompt?: string;
  userStatus?: string;
};

export function PromptLine({
  prompt = strings.landing.prompt,
  userStatus,
}: PromptLineProps) {
  const guest = userStatus === "GUEST";
  const base = userStatus ? prompt.replace(/>$/, "") : prompt;

  return (
    <p className="text-sm text-term-primary">
      <span className="select-none">
        {base}
        {userStatus ? (
          <>
            {" "}
            <span className="text-term-secondary">[{userStatus}]</span>
            {guest ? ">" : ""}
          </>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className="ml-2 inline-block h-[1.1em] w-[0.55em] select-none bg-term-primary align-[-0.05em] animate-cursor-blink"
      />
    </p>
  );
}
