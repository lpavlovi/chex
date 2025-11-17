import { createStore } from "solid-js/store";
import { DEFAULT_USER_INFO_VALUE, UserContext } from "./entity";
import type { UserInfoContext, UserInfoValue } from "./entity";
import { onMount } from "solid-js";

export function UserProvider(props: any) {
  const [value, setValue] = createStore<UserInfoValue>(DEFAULT_USER_INFO_VALUE);

  const userInfoContext: UserInfoContext = [
    value,
    {
      clearApiKey() {
        setValue({
          user: {
            apiKey: null,
            isLoggedIn: false,
          },
          status: "LOGGED_OUT",
        });
      },
    },
  ];

  onMount(() => {
    // set the API Key of the user to "abcdefg"
    setValue({
      user: {
        apiKey: "abcdefg",
        isLoggedIn: true,
      },
      status: "LOGGED_IN",
    });
  });

  return (
    <UserContext.Provider value={userInfoContext}>
      {props.children}
    </UserContext.Provider>
  );
}
