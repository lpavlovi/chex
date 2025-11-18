// Message type definitions for Chrome extension communication

export const ACTIONS = ["summarize" , "translate" , "speak"] as const;
export type Action = (typeof ACTIONS)[number];

export type EchoMessage = {
  readonly type: "echo";
  readonly message: string;
};

// TODO: Implement Google Login
export type GoogleLoginMessage = {
  readonly type: "google_login";
};

export type ByokLoginMessage = {
  readonly type: "byok_login";
  readonly apiKey: string;
};

export type LogoutMessage = {
  readonly type: "logout";
};

export type ActionMessage = {
  readonly type: "action";
  readonly actions: Action[];
};

export type WorkerMessage = EchoMessage | ByokLoginMessage | GoogleLoginMessage | LogoutMessage | ActionMessage;
