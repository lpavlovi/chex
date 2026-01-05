import { createMemo, For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { css } from "solid-styled-components";
import { useAppState } from "../context/state/hooks";
import { DOMElement } from "solid-js/jsx-runtime";

const svgCss = css`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const OUTLINE_COLORS = [
  "#FF595E", // Tomato
  "#FF924C", // Orange
  "#FFCA3A", // Yellow
  "#C5CA30", // Pear
  "#8AC926", // Lime
  "#36949D", // Teal
  "#1982C4", // Blue
  "#4267AC", // Royal Blue
  "#6A4C93", // Violet
  "#9D4EDD", // Purple
  "#E040FB", // Magenta
  "#F15BB5", // Pink
  "#00BBF9", // Cyan
  "#00F5D4", // Aquamarine
  "#90BE6D", // Sage Green
];

const pathCss = css`
  fill: none;
  stroke: var(--outline-color, #FF6B35);
  stroke-width: 2px;
  stroke-dasharray: 30 10;
  animation: dash-rotate 1s linear infinite;
`;

const keyframesStyle = `
  @keyframes dash-rotate {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: var(--perimeter);
    }
  }
`;

/**
 * Generates the SVG path string (d attribute) for a given DOMRect object with rounded corners.
 * @param {object} rect - The DOMRect object ({x, y, width, height, top, right, bottom, left}).
 * @param {number} radius - The corner radius in pixels (default: 8).
 * @returns {string} The SVG path string with rounded corners.
 */
function generateRectPath(rect: DOMRect, radius: number = 8): string {
  const x1 = rect.left + window.scrollX - 5;
  const y1 = rect.top + window.scrollY - 5;
  const x2 = rect.right + window.scrollX + 5;
  const y2 = rect.bottom + window.scrollY + 5;

  // Ensure radius doesn't exceed half the width or height
  const maxRadius = Math.min((x2 - x1) / 2, (y2 - y1) / 2);
  const r = Math.min(radius, maxRadius);

  // Start at top-left, just after the curve
  // Top edge: line to top-right, just before the curve
  // Top-right corner: quadratic curve
  // Right edge: line to bottom-right, just before the curve
  // Bottom-right corner: quadratic curve
  // Bottom edge: line to bottom-left, just before the curve
  // Bottom-left corner: quadratic curve
  // Left edge: line to top-left, just before the curve
  // Top-left corner: quadratic curve back to start
  // Z (Close path)

  return (
    `M ${x1 + r} ${y1} ` +
    `L ${x2 - r} ${y1} ` +
    `Q ${x2} ${y1} ${x2} ${y1 + r} ` +
    `L ${x2} ${y2 - r} ` +
    `Q ${x2} ${y2} ${x2 - r} ${y2} ` +
    `L ${x1 + r} ${y2} ` +
    `Q ${x1} ${y2} ${x1} ${y2 - r} ` +
    `L ${x1} ${y1 + r} ` +
    `Q ${x1} ${y1} ${x1 + r} ${y1} Z`
  );
}

function Outline(props: { elem: DOMElement }) {
  const color = createMemo(() => {
    const randomIndex = Math.floor(Math.random() * OUTLINE_COLORS.length);
    return OUTLINE_COLORS[randomIndex];
  });

  // Calculate perimeter of the actual drawn path (accounting for the ±5px offsets)
  // const width = props.rect.width + 10; // +5 on each side
  // const height = props.rect.height + 10; // +5 on each side
  // const actualPerimeter = 2 * width + 2 * height;

  // Round up to nearest multiple of dash pattern period (14px dash + 14px gap = 28px)
  // This ensures smooth looping animation without choppy transitions
  // const DASH_PATTERN_PERIOD = 280; // 14px dash + 14px gap
  // const perimeterPx = Math.ceil(actualPerimeter / DASH_PATTERN_PERIOD) * DASH_PATTERN_PERIOD;

  // actually, I'll just keep it simple
  const perimeterPx = 40;

  // Calculate document dimensions to ensure SVG covers entire scrollable area
  // This ensures paths with coordinates beyond the viewport are visible
  const docWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth,
    window.innerWidth
  );
  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight
  );
  const viewBox = `0 0 ${docWidth} ${docHeight}`;

  return (
    <svg class={svgCss} viewBox={viewBox} width={docWidth} height={docHeight}>
      <style>{keyframesStyle}</style>
      <path
        d={generateRectPath(props.elem.getBoundingClientRect())}
        class={pathCss}
        style={{
          "--perimeter": `${perimeterPx}px`,
          "--outline-color": color(),
        }}
      />
    </svg>
  );
}

export function Portal(props: { children?: JSX.Element }) {
  const [appState] = useAppState();

  return (
    <>
      <Show when={appState.name === "VISUAL" && appState.hover}>
        {(hover) => <Outline elem={hover()} />}
      </Show>
      <Show when={appState.name === "VISUAL" && appState.selection}>
        {(selection) => (
          <For each={selection()}>{(elem) => <Outline elem={elem} />}</For>
        )}
      </Show>
      {props.children}
    </>
  );
}
