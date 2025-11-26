import { WorkerMessage } from "./types/message";

const CHROME_EXTENSION =
  typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.id;

export interface WorkerDispatcher {
  sendMessage(message: WorkerMessage): Promise<any>;
}

class ServiceWorkerDispatcher implements WorkerDispatcher {
  sendMessage(message: WorkerMessage): Promise<any> {
    console.log("ServiceWorkerDispatcher");
    console.log(message);
    return Promise.reject("ServiceWorkerDispatcher.sendMessage is not implemented.");
  }
}

class BackgroundChromeExtensionWorkerDispatcher implements WorkerDispatcher {
  sendMessage(message: WorkerMessage): Promise<any> {
    return chrome.runtime.sendMessage(message);
  }
}

let dispatcher: WorkerDispatcher | null = null;
export function getWorkerDispatcher(): WorkerDispatcher {
  if (!dispatcher) {
    dispatcher = CHROME_EXTENSION
      ? new BackgroundChromeExtensionWorkerDispatcher()
      : new ServiceWorkerDispatcher();
  }
  return dispatcher;
}
