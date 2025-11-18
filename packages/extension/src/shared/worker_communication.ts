import { WorkerMessage } from "./types/message";

const CHROME_EXTENSION =
  typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id;

export interface WorkerCommunication {
  sendMessage(message: WorkerMessage): void;
}

class ServiceWorkerComms implements WorkerCommunication {
  sendMessage(message: WorkerMessage) {}
}

class BackgroundChromeExtensionWorkerComms implements WorkerCommunication {
  sendMessage(message: WorkerMessage) {}
}

let comms: WorkerCommunication | null = null;
export function getWorkerComms(): WorkerCommunication {
  if (!comms) {
    comms = CHROME_EXTENSION
      ? new BackgroundChromeExtensionWorkerComms()
      : new ServiceWorkerComms();
  }
  return comms;
}