import { JSX } from "solid-js";
import { css } from "solid-styled-components";

const infoPanelCss = css`
  background: #f5f5f7;
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 18px 16px;
  width: min(42vw, 480px);
`;

export function InfoPanel(props: { children?: JSX.Element }) {
  return <div class={infoPanelCss}>{props.children}</div>;
}
