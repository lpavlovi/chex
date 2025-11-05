// Message type definitions for Chrome extension communication

export type EchoMessage = {
  readonly type: "echo";
  readonly message: string;
};

export type LoginMessage = {
  readonly type: "login";
  readonly token: string;
};

export type LogoutMessage = {
  readonly type: "logout";
};

export type ExtensionMessage = EchoMessage | LoginMessage | LogoutMessage;
