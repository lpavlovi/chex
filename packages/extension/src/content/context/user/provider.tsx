import { onMount, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { DEFAULT_USER_INFO_VALUE, UserContext } from "./entity";
import type { UserInfo, UserInfoContext } from "./entity";

export function UserProvider(props: any) {
  const [value, setValue] = createStore(DEFAULT_USER_INFO_VALUE);

  const userInfoContext: UserInfoContext = [
    value,
    {
      login(userInfo: UserInfo) {
        setValue("user", userInfo);
        setValue("status", "LOGGED_IN");
      },
      logout() {
        setValue("user", {
          name: null,
          email: null,
          isLoggedIn: false,
        });
        setValue("status", "LOGGED_OUT");
      },
    },
  ];

  // setup the user info
  onMount(() => {
    console.log("UserProvider - onMount - Setting up the user context");
    setTimeout(() => {
      console.log("UserProvider - onMount - delayed login simulation")
      const fakeUserInfo: UserInfo = { isLoggedIn: true, name: "FakeLuka", email: "fake@luka.com" };
      const [_, { login }] = userInfoContext;
      login(fakeUserInfo);
    }, 2000)
  });

  return (
    <UserContext.Provider value={userInfoContext}>
      {props.children}
    </UserContext.Provider>
  )
};
