// Message type definitions for Chrome extension communication

export const ACTIONS = ["summarize", "translate", "speak"] as const;
export type ActionOption = (typeof ACTIONS)[number];
export type Action = {
  type: ActionOption;
  contents: string;
};

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
};

export type WorkerMessage =
  | EchoMessage
  | SaveKeyMessage
  | GoogleLoginMessage
  | LogoutMessage
  | ActionMessage;
