export async function processElementClickEventCapture(event: MouseEvent) {
  console.log(event.target);
  if (!event.target) {
    console.log("invalid event target");
    return;
  }

  let elem = event.target as Element;
  let textContents;
  for (let i = 0; i < 3; i++) {
    textContents = elem?.textContent ? elem?.textContent.trim() : textContents;
    if (textContents && textContents.length > 200) {
      textContents = textContents.trim();
      console.log(textContents.length);
      break;
    } else {
      if (elem.parentElement) {
        elem = elem.parentElement;
      } else {
        console.log("unable to find valid text contents");
        return;
      }
    }
  }
  console.log(textContents);

  const resp = await fetch("http://localhost:3001/api/summary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text_content: textContents,
    }),
  });
  const jsonBody = await resp.json();
  console.log(jsonBody);
  console.log("done");
}

export function processPlaceholder(event: MouseEvent): Promise<string> {
  return Promise.resolve(
    "This text describes a JavaScript engine that is small, embeddable, fast, and has near-complete ES2023 support. It boasts a low startup time, can compile JavaScript to executables, uses reference counting garbage collection with cycle removal, and includes a command-line interpreter with colorization. It also features a small standard library with C library wrappers."
  );
}
