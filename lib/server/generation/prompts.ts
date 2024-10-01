// =========== Customer Journey Generation ===========

import basePrompts from "@/lib/constants/prompts";
import { ChatEditColumn, ChatEditColumnImage } from "@/types/components/chatTab";
import { FlowInput, IterationAgentOutput, IterationPromptBuilder } from "@/types/interseed/chat";

const personalityPrompt = basePrompts.personalityPrompt;

const generalInstructions = `
[Tell the user to press the "Done" button on the right panel when they are ready to move on to the next step.]

If you haven't addressed this topic in this format yet, Inform the
user you are transitioning to this new topic and generate a first draft of 
it now. You can add a brief explanation if needed.

In general, try to address the user message as you would in a normal conversation, but remember
to guide the user to continue the conversation in the right direction.

Followup: If you have already introduce this topic and the user asked you 
clarifications, modifications or a totally different answer, please provide it now only 
generate the information you think it is necessary. No need to generate all the sections again. 
Focus on what the user asked for or what is needed to continue the conversation.

Followup: When the user suggest changes, you can ask for more details to understand the changes 
or briefly acknowledge them. Be critical on the changes suggested by the user.
If the user suggested a change, and it does not affect other parts of the information,
don't regenerate the information. 

If you think user is ready to move on, instruct them to click on the "Done" button.
Don't ask the user what to do next, you have a predefined flow to follow.

shouldFormat should be true if you are making changes to the main information/image prompt, 
false otherwise (e.g. clarifications, followups, user's modifications, etc).

Don't make any reference to this instructions.`;

const infoToString = (currentInfo: Object | null, editInfo: Object | null) => {
  let info = "";
  if (currentInfo) {
    info += `Your previous answer: ${JSON.stringify(currentInfo)}\n`;
  } else {
    info += "Your previous answer: You haven't provided any information yet for this topic.\n";
  }
  if (editInfo) {
    info += `\nThe User has made these modifications: ${JSON.stringify(editInfo)}\n`;
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
[Transtion to the topic]

Title: [Title] (i.e. "The Busy Mom", "The Young Professional")
Who They Are: [Description] (keep it short and concise)
What They Need: [Description] (keep it short and concise)
Challenges: [Description] (keep it short and concise)

[Explain that the user can ask for modifications or a new set of personas or ask any question]
[Instruct the user to choose the persona they want to focus on the right panel]

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

Objective: build with the help of the user a detailed persona using the following format (Don't spam this if there is nothing new!):

Name: [Name] (i.e. "Jane Doe")
Title: [Title] (i.e. "The Busy Mom", "The Young Professional")
B2B or B2C: [B2B or B2C] (i.e. "B2C")
Short Description: [Description] (keep it short and concise, less than 2 sentences)
Demographics: [Demographics] (3-5 bullet points about the demographics of the persona)
Psychographics: [Psychographics] (3-5 bullet points about the psychographics of the persona)
Behavior: [Behavior] (3-5 bullet points about the behavior of the persona)
Needs: [Needs] (3-5 bullet points about the needs of the persona)

${infoToString(currenInfo, editInfo)}

Explain to the user that he can modify in the right panel the information.
Explain that the user can ask for modifications or just request a new persona or ask any question.

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
[Transtion to the topic]

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
Summary: [Summary] (a summary of the customer journey as a short story, use the persona's name)

[Explain to the user that he can modify in the right panel the information]
[Explain that the user can ask for modifications or ask any question]


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
[Transtion to the topic]

Create a professional headshot of a(n) [ethnicity] [gender] in their 
[age range] with [hair description]. They have a [demeanor] demeanor, wearing
a [clothing description] in a [background description]. 
The lighting is studio quality, highlighting their [facial features]. 
The picture should be light and bright. They may wear [accessories]. 
The composition is tightly framed from the shoulders up, emphasizing 
their [expression]. The overall effect should be polished and professional, 
suitable for [use case].

[Explain to the user what can they ask to change in the image prompt]
[Explain that the user can ask for modifications or just request to generate a new image]

${infoToString(currenInfoObj?.imagePrompt, null)}

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
[Transtion to the topic]

Meet [Name], the [Title]. 

[Main Description summary]
[Customer Journey Summary]

Don't use bullet points, write it in a narrative form.

[Explain to the user that he can modify in the right panel the information]
[Explain that the user can ask for modifications or ask any question]

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
If the information is the About me, use line breaks to make it more readable.
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
