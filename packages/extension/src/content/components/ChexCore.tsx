import { useUserInfo } from "../context/user/hooks";
import { OptionChain } from "./OptionChain";

export function ChexCore() {
  const [userInfo, _] = useUserInfo();
  console.log(`ChexCore - userInfo - ${userInfo.status} ${userInfo.user.email}`);
  console.log(userInfo);
  console.log("are we rendering the ChexCore again?");

  const isLoggedIn = () => userInfo.status === "LOGGED_IN";

  return (
    <div>
      <span>{isLoggedIn() ? "You are logged in" : "You are not logged in"}</span>
      <OptionChain></OptionChain>
    </div>
  );

}
