const OPTIONS = ["Summarize", "Translate", "Speak"];

import { styled } from "solid-styled-components";

const Option = styled("div")`
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
    0 2px 4px rgba(0, 0, 0, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
  
  /* Animation properties */
  opacity: 0;
  transform: translateX(20px);
  animation: slideInFromRight 0.4s ease-out forwards;
  
  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;


export const OptionChain = () => {
  return (
    <div>
      {OPTIONS.map((option, index) => {
        return <Option>{option}</Option>;
      })}
    </div>
  );
};