import { createContext } from "solid-js";

export type UserInfo =
  | { apiKey: string; isLoggedIn: true }
  | { apiKey: null; isLoggedIn: false };

export type UserInfoAppStatus = "LOGGED_IN" | "LOGGED_OUT" | "LOADING";

export type UserInfoValue = { user: UserInfo; status: UserInfoAppStatus };
export type UserInfoFunctions = {
  clearApiKey: () => void;
};

export type UserInfoContext = [UserInfoValue, UserInfoFunctions];

export const DEFAULT_USER_INFO_VALUE: UserInfoValue = {
  user: {
    apiKey: null,
    isLoggedIn: false,
  },
  status: "LOADING",
};

export const UserContext = createContext<UserInfoContext>([
  DEFAULT_USER_INFO_VALUE,
  {
    clearApiKey: () => {},
  },
]);
