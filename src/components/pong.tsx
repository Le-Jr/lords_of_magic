type PongProps = {
  /** 0..1 progress fraction; renders the ball statically instead of bouncing. */
  progress?: number;
};

export function Pong({ progress }: PongProps) {
  const isProgress = progress !== undefined;
  const bounded = Math.min(Math.max(progress ?? 0, 0), 1);
  const left = `calc(${bounded * 100}% + ${0.75 - bounded * 2.5}rem)`;

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[2/1] w-full select-none border-2 border-term-border"
    >
      <span className="absolute top-1/2 left-1 h-8 w-1.5 -translate-y-1/2 bg-term-primary" />
      <span className="absolute top-1/2 right-1 h-8 w-1.5 -translate-y-1/2 bg-term-primary" />
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 bg-term-primary ${
          isProgress ? "" : "animate-pong-bounce"
        }`}
        style={isProgress ? { left } : undefined}
      />
    </div>
  );
}
