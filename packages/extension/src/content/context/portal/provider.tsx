import { createStore, produce } from "solid-js/store";
import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import { css } from "solid-styled-components";
import { DEFAULT_PORTAL_VALUE, PortalContext } from "./entity";
import type { PortalInfoContext, PortalInfo } from "./entity";

const svgCss = css`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`;

const pathCss = css`
  fill: none;
  stroke-width: 2px;
  stroke-dasharray: 30 10;
  animation: dash-rotate 1s linear infinite;
`;

const turquoiseStrokeClass = css`
  stroke:rgb(31, 174, 160);
`;

const deepGreenStrokeClass = css`
  stroke:rgb(32, 177, 32);
`;

const purpleStrokeClass = css`
  stroke:rgb(174, 74, 255);
`;

const grayStrokeClass = css`
  stroke: gray;
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
 * Converts a viewport-relative DOMRect to document coordinates.
 * Since stored DOMRects are viewport-relative snapshots, we need to convert them
 * to document coordinates using the current scroll position.
 */
function convertToDocumentCoords(rect: DOMRect, currentScrollX: number, currentScrollY: number): DOMRect {
  return new DOMRect(
    rect.left + currentScrollX,
    rect.top + currentScrollY,
    rect.width,
    rect.height
  );
}

/**
 * Generates the SVG path string (d attribute) for a given DOMRect object with rounded corners.
 * @param {object} rect - The DOMRect object in document coordinates.
 * @param {number} radius - The corner radius in pixels (default: 8).
 * @returns {string} The SVG path string with rounded corners.
 */
function generateRectPath(rect: DOMRect, radius: number = 8): string {
  const x1 = rect.left - 5;
  const y1 = rect.top - 5;
  const x2 = rect.right + 5;
  const y2 = rect.bottom + 5;

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

function PortalsRenderer(props: { portalInfo: PortalInfo }) {
  const perimeterPx = 40;
  const [scrollX, setScrollX] = createSignal(window.scrollX);
  const [scrollY, setScrollY] = createSignal(window.scrollY);

  // Update scroll position on scroll events
  onMount(() => {
    const handleScroll = () => {
      setScrollX(window.scrollX);
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
    });
  });

  // Calculate document dimensions to ensure SVG covers entire scrollable area
  const docWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth,
    window.innerWidth,
  );
  const docHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    window.innerHeight,
  );
  const viewBox = `0 0 ${docWidth} ${docHeight}`;

  const hasContent = () => props.portalInfo.hover !== null || props.portalInfo.selected.length > 0;

  return (
    <Show when={hasContent()}>
      <svg class={svgCss} viewBox={viewBox} width={docWidth} height={docHeight}>
        <style>{keyframesStyle}</style>
        {/* Hover outline */}
        <Show when={props.portalInfo.hover !== null}>
          {(() => {
            const docRect = convertToDocumentCoords(props.portalInfo.hover!, scrollX(), scrollY());
            return (
              <path
                d={generateRectPath(docRect)}
                class={`${pathCss} ${grayStrokeClass}`}
                style={{ "--perimeter": `${perimeterPx}px` }}
              />
            );
          })()}
        </Show>
        {/* Selected outlines */}
        <For each={props.portalInfo.selected}>
          {(rect, index) => {
            const getStrokeClass = () => {
              const idx = index();
              if (idx === 0) return turquoiseStrokeClass;
              if (idx === 1) return deepGreenStrokeClass;
              return purpleStrokeClass;
            };
            const docRect = convertToDocumentCoords(rect, scrollX(), scrollY());
            return (
              <path
                d={generateRectPath(docRect)}
                class={`${pathCss} ${getStrokeClass()}`}
                style={{ "--perimeter": `${perimeterPx}px` }}
              />
            );
          }}
        </For>
      </svg>
    </Show>
  );
}

export function PortalProvider(props: any) {
  const [portalInfo, setPortalInfo] = createStore<PortalInfo>(DEFAULT_PORTAL_VALUE);

  const actions: PortalInfoContext = {
    setHover: (rect: DOMRect | null) => {
      setPortalInfo("hover", rect);
    },
    addSelected: (rect: DOMRect) => {
      setPortalInfo(
        produce((info) => {
          if (info.selected.length === 3) {
            info.selected.splice(0,1);
          }
          info.selected.push(rect);
        })
      );
    },
    removeSelected: (index: number) => {
      setPortalInfo(
        produce((info) => {
          console.warn("We shouldn't be using this");
          info.selected.splice(index, 1);
        })
      );
    },
    clearSelected: () => {
      setPortalInfo("selected", []);
    },
  };

  return (
    <PortalContext.Provider value={actions}>
      <PortalsRenderer portalInfo={portalInfo} />
      {props.children}
    </PortalContext.Provider>
  );
}
