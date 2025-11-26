import { Action } from "../../shared/types/message";
import { generateContentFromGeminiFlashLite } from "../logic/ai";

export async function handleAction(
  actions: Action[],
  contents: string,
  sendResponse: (response: any) => void
): Promise<void> {
  if (actions.length === 0) {
    sendResponse({ success: false, error: "No actions provided" });
    return;
  }

  let generatedContents = contents;

  for (let i = 0; i < actions.length; i++) {
    const currResponse = await processAction(actions[i], generatedContents);
    if (currResponse === null) {
      sendResponse({ success: false, error: "No actions provided" });
      return;
    }
  }
  sendResponse({ success: true, contents });
}

function buildPromptForSummaryGeneration(contents: string) {
  const aiToolPrompt = `Summarize the following contents.
Use as few sentences as neccessary.
It must use a maximum of 4 sentences.


${contents.trimEnd()}`;
  return aiToolPrompt;
}

function buildPromptForTranslation(contents: string, language: string) {
  const aiToolPrompt = `Translate the following contents. The ISO code for the target language is ${language}.


${contents.trimEnd()}`;
  return aiToolPrompt;
}

async function processAction(
  action: Action,
  contents: string
): Promise<string | null> {
  let prompt;
  switch (action.type) {
    case "summarize":
      prompt = buildPromptForSummaryGeneration(contents) || "";
      break;
    case "translate":
      prompt = buildPromptForTranslation(contents, action.language);
      break;
    default:
      throw Error(`Action type ${action.type} is not implemented`);
  }

  const result = await generateContentFromGeminiFlashLite(prompt);
  return result || null;
}
