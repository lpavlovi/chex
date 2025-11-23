// Sample language options as the language ISO strings
export const LANGUAGE_OPTIONS = ["en", "de", "fr"] as const;

export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number];

export const ACTIONS = ["summarize", "translate", "speak"] as const;

export type ActionOption = (typeof ACTIONS)[number];

export type SpeakAction = {
  type: "speak";
  language: LanguageOption;
};

export type SummarizeAction = {
  type: "summarize";
};

export type TranslateAction = {
  type: "translate";
  language: LanguageOption;
};

export type Action = SpeakAction | SummarizeAction | TranslateAction;

export type EchoMessage = {
  readonly type: "echo";
  readonly message: string;
};

// TODO: Implement Google Login
export type GoogleLoginMessage = {
  readonly type: "google_login";
};

export type SaveKeyMessage = {
  readonly type: "save_key";
  readonly apiKey: string;
  readonly modelId: string;
};

export type LogoutMessage = {
  readonly type: "logout";
};

export type ActionMessage = {
  readonly type: "action";
  readonly actions: Action[];
  readonly contents: string;
};

export type WorkerMessage =
  | EchoMessage
  | SaveKeyMessage
  | GoogleLoginMessage
  | LogoutMessage
  | ActionMessage;
