import { Action } from "../../shared/types/message";
import { generateContentFromGeminiFlashLite } from "../logic/ai";

export async function handleAction(
  actions: Action[],
  sendResponse: (response: any) => void
): Promise<void> {
  if (actions.length === 0) {
    sendResponse({ error: "No actions provided" });
    return;
  }

  let currentContents = actions[0].contents;

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    let prompt: string;

    // Build prompt based on action type
    if (action.type === "summarize") {
      prompt = buildPromptForSummaryGeneration(currentContents);
    } else if (action.type === "translate") {
      prompt = buildPromptForTranslation(currentContents, action.language);
    } else if (action.type === "speak") {
      // For speak action, use the original contents or pass through
      prompt = currentContents;
    } else {
      sendResponse({ error: `Unknown action type: ${(action as any).type}` });
      return;
    }

    try {
      const responseText = await generateContentFromGeminiFlashLite(prompt);
      
      if (responseText === undefined) {
        sendResponse({ error: `No response from AI for action ${i + 1}` });
        return;
      }

      // Use this response as input for next action, or as final result
      if (i === actions.length - 1) {
        // Last action - send final response
        sendResponse({ result: responseText });
      } else {
        // Not last action - use output as input for next
        currentContents = responseText;
      }
    } catch (error) {
      sendResponse({ error: `Failed to process action ${i + 1}: ${error instanceof Error ? error.message : String(error)}` });
      return;
    }
  }
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

async function processAction(action: Action): Promise<string> {
  let prompt;
  switch (action.type) {
    case "summarize":
      prompt = buildPromptForSummaryGeneration(action.contents) || "";
      break;
    case "translate":
      prompt =  buildPromptForTranslation(action.contents, action.language);
      break;
    default:
      throw Error(`Action type ${action.type} is not implemented`);
  }

  const result = await generateContentFromGeminiFlashLite(prompt);
  return result || "";
}