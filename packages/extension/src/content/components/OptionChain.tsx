import { css } from "solid-styled-components";
import { Motion } from "solid-motionone";
import { useUserInfo } from "../context/user/hooks";

const OPTIONS = ["Summarize", "Translate", "Speak"];

const optionButtonClass = css`
  width: 100%;
  padding: 12px 6px;
  background: linear-gradient(135deg, #212121 0%, #383838 100%);
  border-radius: 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  line-height: 1;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.18),
    0 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  cursor: pointer;
`;

function Option({
  index,
  option,
  onClick,
}: {
  index: number;
  option: string;
  onClick?: () => void;
}) {
  return (
    <Motion.button
      class={optionButtonClass}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8, x: 80 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 80 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
        easing: "ease-out",
      }}
    >
      {option}
    </Motion.button>
  );
}

export const OptionChain = () => {
  const [userInfo, { login, logout }] = useUserInfo();
  console.log(`OptionChain - userInfo - ${userInfo.status} ${userInfo.user.email}`);
  console.log(userInfo);
  console.log("are we rendering the OptionChain again?");

  const isLoggedIn = userInfo.status === "LOGGED_IN";

  const handleOptionClick = (option: string) => {
    console.log(`Clicked option: ${option}`);
    // Add your option handling logic here
  };

  const handleLoginClick = () => {
    console.log("Login clicked");
  };

  return (
    <div>
      <span>{userInfo.status}</span>
      <Option index={0} option={userInfo.status} />
      {!isLoggedIn ? (
        <Option index={1} option={"Login"} onClick={handleLoginClick} />
      ) : (
        OPTIONS.map((option, index) => {
          return (
            <Option
              index={index}
              option={option}
              onClick={() => handleOptionClick(option)}
            />
          );
        })
      )}
    </div>
  );
};
