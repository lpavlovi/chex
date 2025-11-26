import { createSignal } from "solid-js";
import { css } from "solid-styled-components";
import { getWorkerDispatcher } from "../shared/worker_dispatcher";
import type { WorkerDispatcher } from "../shared/worker_dispatcher";
import type { SaveKeyMessage } from "../shared/types/message";

const containerClass = css`
  width: 300px;
  padding: 20px;
  background: white;
  color: black;
`;
const titleClass = css`
  margin: 0 0 20px 0;
  font-size: 18px;
`;
const inputClass = css`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: black;
  }
`;
const buttonClass = css`
  width: 100%;
  padding: 10px;
  background: black;
  color: white;
  border: none;
  font-size: 14px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const statusClass = css`
  margin-top: 15px;
  font-size: 12px;
`;

export function KeySubmission() {
  const [apiKey, setApiKey] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [status, setStatus] = createSignal("");
  const [isError, setIsError] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("");
    setIsError(false);

    const apiKeyValue = apiKey().trim();
    console.log(`apiKeyValue: ${apiKeyValue}`);

    if (!apiKeyValue) {
      setStatus("Please enter an API key");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const d: WorkerDispatcher = getWorkerDispatcher();
      const m: SaveKeyMessage = {
        type: "save_key",
        apiKey: apiKeyValue,
        modelId: "gemini-2.5-flash-lite",
      };
      
      const response = await d.sendMessage(m);
      
      if (response.success) {
        setStatus("API key saved successfully!");
        setIsError(false);
        setApiKey("");
      } else {
        setStatus(response.error || "Failed to save API key");
        setIsError(true);
      }
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || "Failed to save API key";
      setStatus(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class={containerClass}>
      <h1 class={titleClass}>Enter API Key</h1>

      <form onSubmit={handleSubmit}>
        <label for="apiKey">API Key</label>
        <input
          type="password"
          id="apiKey"
          name="apiKey"
          placeholder="Enter your API key"
          class={inputClass}
          value={apiKey()}
          onInput={(e) => setApiKey(e.currentTarget.value)}
          disabled={isLoading()}
        />

        <button
          type="submit"
          disabled={isLoading()}
          class={buttonClass}
        >
          {isLoading() ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div class={`${statusClass} color: ${isError() ? "red" : "green"};`}>
        {status()}
      </div>
    </div>
  );
}

