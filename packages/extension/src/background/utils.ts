export function log(message: string) {
  console.log(
    `%c[BACKGROUND] %c${message}`,
    "color: blue; font-weight: bold;",
    "color: black; font-weight: normal;"
  );
}
