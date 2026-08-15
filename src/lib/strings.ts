export const strings = {
  landing: {
    prompt: "C:\\LORDS_OF_LOGIC",
    title: "LORDS OF LOGIC",
    tagline: "dev trivia for software developers",
    description: [
      "// a quiz game for software developers.",
      "// fast, short rounds — 3 to 7 minutes.",
      "// web stack, platforms, and dev best practices.",
    ],
    play: "PLAY",
    ranking: "RANKING",
    login: "LOGIN",
    hint: "// press TAB to enter the menu — ARROW KEYS to select, ENTER to run",
    version: "LORDS OF LOGIC v0.1.0",
  },
  login: {
    prompt: "C:\\LORDS_OF_LOGIC\\LOGIN>",
    title: "LOGIN",
    tagline: "authenticate to start playing",
    google: "SIGN IN WITH GOOGLE",
    discord: "SIGN IN WITH DISCORD",
    back: "< BACK",
    hint: "// pick a provider — google or discord only",
    errorGeneric: "ERROR: SIGN-IN FAILED",
    errorAuthCode: "ERROR: AUTH CODE EXCHANGE FAILED",
  },
} as const;
