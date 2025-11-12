import { createContext } from "solid-js";

export type UserInfo =
  | { name: string; email: string; isLoggedIn: true }
  | { name: null; email: null; isLoggedIn: false };

export type UserInfoAppStatus = "LOGGED_IN" | "LOGGED_OUT" | "LOADING";

export type UserInfoValue = { user: UserInfo; status: UserInfoAppStatus };
export type UserInfoFunctions = {
  login: (userInfo: UserInfo) => void;
  logout: () => void;
};

export type UserInfoContext = [UserInfoValue, UserInfoFunctions];

export const DEFAULT_USER_INFO_VALUE: UserInfoValue = {
  user: {
    name: null,
    email: null,
    isLoggedIn: false,
  },
  status: "LOADING",
};

export const UserContext = createContext<UserInfoContext>([
  DEFAULT_USER_INFO_VALUE,
  {
    login: () => {},
    logout: () => {},
  },
]);
