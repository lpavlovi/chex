import { createSignal } from "solid-js";
import { useUserInfo } from "../context/user/hooks";
import { InfoPanel } from "./InfoPanel";
import { OptionChain } from "./OptionChain";

export function ChexCore() {
  const [info, setInfo] = createSignal<string | null>(null);
  const [userInfo, _] = useUserInfo();
  const isLoggedIn = () => userInfo.status === "LOGGED_IN";
  return (
    <>
      <div>
        <OptionChain isLoggedIn={isLoggedIn()} setInfo={setInfo}></OptionChain>
      </div>
      {info() && <InfoPanel>{info()}</InfoPanel>}
    </>
  );
}
