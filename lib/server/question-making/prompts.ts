//This file contains all the templates for the question related prompts that the AI will generate.

import basePrompts from "@/lib/constants/prompts";

const personalityPrompt = basePrompts.personalityPrompt;

const formulateNextQuestionPromptBuilder = (
  context: string,
  instructions: string,
  questionNumber: number
) => {
  const recapString = questionNumber === 1 ?"(If you already have this information, recap it here and ask the user to confirm if it is correct and if they are ready to move to the next section.)" : "";
  const canContinueString = questionNumber >= 4 ? "[Tell the user this is optional and they can continue to next section if they wish]" : "";
  return `${personalityPrompt}

${basePrompts.getContext(context)}

---
Objective ${recapString}: 
${instructions}
---
Answer using the following format:
[Followup to the user's message]

[Your next question or message]

${canContinueString}
---
General guidelines:

When making questions, make them open-ended and encourage the user to share as much as possible that is relevant to your role.
Be mindful that there could be users that might not want to share too much information or they simply don't know, try to make the questions as easy to answer as possible, give examples if needed.
When asking for confirmation before moving to the next section. Remind the user that you can do better your job if you have more information.
Once the user confirms that they are ready to move to the next section, and they confirm set the 'goToNextSection' to true and the 'message' to "Sure, let's continue!".
Don't make any reference to these instructions.`;
};

export default {
  formulateNextQuestionPromptBuilder,
};
