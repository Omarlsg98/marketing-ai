// =========== Customer Journey Generation ===========

import basePrompts from "@/lib/constants/prompts";
import { ChatEditColumn, ChatEditColumnImage } from "@/types/components/chatTab";
import { FlowInput, IterationAgentOutput, IterationPromptBuilder } from "@/types/interseed/chat";

const personalityPrompt = basePrompts.personalityPrompt;

const generalInstructions = `
If you haven't addressed this topic in this format yet, Inform the
user you are transitioning to this new topic and generate a first draft of 
it now. You can add a brief explanation if needed.
If you have already introduce this topic and the user asked you 
clarifications, modifications or a totally different answer, please provide it now.
Only generate the information of the topic if the user asked for it 
or if it is necessary. 
No need to generate all the information every time
focus on what the user asked for or what is needed to continue the conversation.
In general, try to address the user message as you would in a normal conversation.

shouldRegenarate should be true if there are changes to the main information, 
false otherwise (e.g. clarifications, followups, etc).
Don't make any reference to this instructions.`;

const infoToString = (currentInfo: Object | null, editInfo: Object | null) => {
  let info = "";
  if (currentInfo) {
    info += `Your previous answer: ${JSON.stringify(currentInfo)}\n`;
  } else {
    info += "Your previous answer: You haven't provided any information yet for this topic.\n";
  }
  if (editInfo) {
    info += `The User has made these modifications: ${JSON.stringify(editInfo)}\n`;
  }
  return info;
};

const personaSuggestionsPromptBuilder: IterationPromptBuilder = (
  input: FlowInput,
  currenInfo: ChatEditColumn,
  editInfo: ChatEditColumn
) => {
  return `${personalityPrompt}

${basePrompts.getContextFromInput(input)}

You are assisting the user suggesting and brainstorming possible personas for their business.

You will provide 3 different personas with a brief description of each one using the following template:
Title: [Title] (i.e. "The Busy Mom", "The Young Professional")
Who They Are: [Description] (keep it short and concise, less than 2 sentences)
What They Need: [Description] (keep it short and concise, less than 2 sentences)
Challenges: [Description] (keep it short and concise, less than 2 sentences)

${infoToString(currenInfo, editInfo)}

${generalInstructions}`;
};

const personaPromptBuilder: IterationPromptBuilder = (
  input: FlowInput,
  currenInfo: ChatEditColumn,
  editInfo: ChatEditColumn
) => {
  return `${personalityPrompt}

${basePrompts.getContextFromInput(input)}

The user just chose a persona to work with. 

You will now provide a detailed description of the persona using the following template:
Name: [Name] (i.e. "Jane Doe")
Title: [Title] (i.e. "The Busy Mom", "The Young Professional")
Short Description: [Description] (keep it short and concise, less than 2 sentences)
Demographics: [Demographics] (3-5 bullet points about the demographics of the persona)
Psychographics: [Psychographics] (3-5 bullet points about the psychographics of the persona)
Behavior: [Behavior] (3-5 bullet points about the behavior of the persona)
Needs: [Needs] (3-5 bullet points about the needs of the persona)

${infoToString(currenInfo, editInfo)}

${generalInstructions}`;
};


const customerJourneyPromptBuilder: IterationPromptBuilder = (
  input: FlowInput,
  currenInfo: ChatEditColumn,
  editInfo: ChatEditColumn
) => {
  return `${personalityPrompt}

${basePrompts.getContextFromInput(input)}

Given the persona you just created, you will now generate a customer journey map for them.

You will now provide a detailed customer journey map for the persona using the following template:
Awareness:
  Trigger: [Trigger] (i.e. "Sees an ad on Facebook")
  Touchpoints: [Touchpoints] (brief description of the touchpoints)
  Action: [Action] (i.e. "Clicks on the ad")
Consideration:
  Research: [Research] (i.e. "Looks for reviews online")
  Touchpoints: [Touchpoints] (brief description of the touchpoints)
  Action: [Action] (i.e. "Adds to cart")
Purchase:
  Decision: [Decision] (i.e. "Decides to buy")
  Touchpoints: [Touchpoints] (brief description of the touchpoints)
  Action: [Action] (i.e. "Completes the purchase")
Retention:
  Engagement: [Engagement] (i.e. "Signs up for newsletter")
  Touchpoints: [Touchpoints] (brief description of the touchpoints)
  Action: [Action] (i.e. "Opens the email")
Advocacy:
  Satisfaction: [Satisfaction] (i.e. "Loves the product")
  Touchpoints: [Touchpoints] (brief description of the touchpoints)
  Action: [Action] (i.e. "Refers a friend")
Summary: [Summary] (a summary of the customer journey as a short story)

${infoToString(currenInfo, editInfo)}

${generalInstructions}`;
};

const generateImagePromptBuilder: IterationPromptBuilder = (
  input: FlowInput,
  currenInfo: ChatEditColumn,
  editInfo: ChatEditColumn
) => {
  const currenInfoObj = currenInfo as ChatEditColumnImage;
  return `${personalityPrompt}
  
${basePrompts.getContextFromInput(input)}

You are assisting the user in the generation of an image for their persona. 
You will provide the prompt to generate the image.

For the prompt use the following template taking into account 
the conversation so far and the last persona discussed:

Create a professional headshot of a(n) [ethnicity] [gender] in their 
[age range] with [hair description]. They have a [demeanor] demeanor, wearing
a [clothing description] in a [background description]. 
The lighting is studio quality, highlighting their [facial features]. 
The picture should be light and bright. They may wear [accessories]. 
The composition is tightly framed from the shoulders up, emphasizing 
their [expression]. The overall effect should be polished and professional, 
suitable for [use case].

${infoToString(currenInfoObj.imagePrompt, null)}

${generalInstructions}`;
};

const aboutMePromptBuilder: IterationPromptBuilder = (
  input: FlowInput,
  currenInfo: ChatEditColumn,
  editInfo: ChatEditColumn
) => {
  return `${personalityPrompt}

${basePrompts.getContextFromInput(input)}

Time to summarize the persona you have been working on for both the details
and the customer journey in a big About Me section.

You will generate a lengthy About Me of the persona using the following template:
Meet [Name], the [Title]. 

[Main Description summary]
[Customer Journey Summary]

Don't use bullet points, write it in a narrative form.

${infoToString(currenInfo, editInfo)}

${generalInstructions}`;
};

const formattingPromptBuilder = (
  currentInfo: ChatEditColumn,
  agentResponse: IterationAgentOutput) => {
  const message = agentResponse.message;
  return `${infoToString(currentInfo, null)}

Given your current answer to the user:
${message}

Please convert the main information to JSON format.
Prefer any information in the current answer over the your previous answer.
If your current answer is partial complete it with the previous answer. 
Don't make any reference to this instructions.`;
};
export default {
  personaSuggestionsPromptBuilder,
  personaPromptBuilder,
  customerJourneyPromptBuilder,
  aboutMePromptBuilder,
  generateImagePromptBuilder,
  formattingPromptBuilder,
};
