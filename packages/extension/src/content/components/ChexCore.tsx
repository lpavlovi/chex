import { useUserInfo } from "../context/user/hooks";
import { OptionChain } from "./OptionChain";

export function ChexCore() {
  const [userInfo, _] = useUserInfo();
  const isLoggedIn = () => userInfo.status === "LOGGED_IN";
  return (
    <div>
      <OptionChain isLoggedIn={isLoggedIn()}></OptionChain>
    </div>
  );
}
