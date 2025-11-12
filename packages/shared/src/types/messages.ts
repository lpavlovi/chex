// Message type definitions for Chrome extension communication

export type EchoMessage = {
	readonly type: "echo";
	readonly message: string;
};

export type UserInfoRequestMessage = {
	readonly type: "userInfo";
};

export type LoginMessage = {
	readonly type: "login";
};

export type LogoutMessage = {
	readonly type: "logout";
};

export type ExtensionMessage =
	| EchoMessage
	| LoginMessage
	| LogoutMessage
	| UserInfoRequestMessage;
