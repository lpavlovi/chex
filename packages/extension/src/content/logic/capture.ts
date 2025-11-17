import { DOMElement } from "solid-js/jsx-runtime";

export function getClosestElementFromMouseEvent(
  event: MouseEvent
): [DOMElement, string] | null {
  if (!event.target) {
    console.log("invalid event target");
    return null;
  }

  let elem = event.target as Element;
  let textContents;
  for (let i = 0; i < 3; i++) {
    textContents = elem?.textContent ? elem?.textContent.trim() : textContents;
    if (textContents && textContents.length > 200) {
      break;
    } else {
      if (elem.parentElement) {
        elem = elem.parentElement;
      } else {
        // unable to find valid text contents
        return null;
      }
    }
  }

  textContents = elem?.textContent ? elem?.textContent.trim() : textContents;

  if (textContents) {
    return [elem, textContents];
  }

  return null;
}

export function postSummarizeTextContents(textContents: string) {
  return fetch("http://localhost:3001/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text_content: textContents,
    }),
  });
}
