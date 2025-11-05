import { log } from './utils';

export function handleLoginMessage(token: string): string {
  log("Login requested");
  return "Login successful";
}