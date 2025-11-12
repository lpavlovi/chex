import { useUserInfo } from "../context/user/hooks";
import { OptionChain } from "./OptionChain";

export function ChexCore() {
  const [userInfo, _] = useUserInfo();
  console.log(`ChexCore - userInfo - ${userInfo.status} ${userInfo.user.email}`);
  console.log(userInfo);
  console.log("are we rendering the ChexCore again?");

  return (
    <div>
      <span></span>
      <OptionChain></OptionChain>
    </div>
  );

}
