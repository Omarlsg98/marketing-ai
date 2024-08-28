// =========== Customer Journey Generation ===========
const intro = `You are going to generate a customer journey map for a persona.
This is an overview of everything that you discussed with the user to assist in this task
Here you have both the context and the question that was asked to the user.
`;

const generalInstructions = `The information you provide will be used to 
generate a customer journey map that will be displayed 
on the persona's profile on a web page. This is not a conversation.
Answer directly the question asked.
Don't make any reference to this instructions.`;


const getNamePrompt = (context: string, question: string) => { 
  return `${intro}
  ${context}

  Given the previous context what is the name of the persona?
  Only answer with a first name and a last name.
  Ex: John Doe
  ${generalInstructions}`;
};
const getAboutMePrompt = (context: string, question: string) => {
  return `${intro}
  ${context}

  Given the previous context what is the about me of the persona?
  Create one paragraph that describe the persona as a whole.
  ${generalInstructions}`;
};
const getShortDescriptionPrompt = (context: string, question: string) => {
  return `${intro}
  ${context}

  Given the previous context what is a short description of the persona?
  Think of this as a tagline or subtitle for the persona.

  Examples: 
  - The young professional.
  - The aspiring entrepreneur.

  Keep it short! 1 sentence max!
  ${generalInstructions}`;
};

const getShortAnswerPrompt = (context: string, question: string) => {
  return `${intro}
  ${context}

  Given the previous context answer the following question:
  ${question}

  Be extremely concise and to the point.
  Keep your answer to a single sentence.
  Don't structure your answer as a full sentence.
  ${generalInstructions}`;
}
const getOneWordAnswerPrompt = (context: string, question: string) => {
  return `${intro}
  ${context}

  Given the previous context answer the following question:
  ${question}

  Answer with a word max two words.
  Don't structure your answer as a full sentence.
  ${generalInstructions}`;

};
const getBulletPointsAnswerPrompt = (context: string, question: string) => {
  return `${intro}
  ${context}

  Given the previous context answer the following question:
  ${question}

  Answer with 5 or less bullet points.
  ex: 
  * Bullet point 1
  * Bullet point 2
  * Bullet point 3

  Keep the bullet points short and to the point. (less than 2 sentences)
  If necessary, include bullet points with related questions guiding further research.
  ${generalInstructions}`;
};

// ===========        Image Generation     ===========
const getMainDescriptionPrompt = (context: string) => {
  return `Context: ${context}

Giving the previous context of the subject generate a description like the following:
Example: The image features an Asian female who appears to be in her late 20s. 
The subject of the photo has long, straight black hair and presents with a 
poised and confident demeanor.

Keep it succinct and to the point, focusing on the most salient details of the subject's most probable appearance.
Feel free to came up with details that are not present in the context, but that would make sense given the context.
Keep it short just 1 or two sentences. Don't mention clothes.
Answer only the question asked and don't make any reference to this instructions
`;
};

const getApparelPrompt = (context: string) => {
  return `${context}

Giving the previous context of the subject generate a description of the apparel like the following:
Example: She is wearing a deep blue blouse, which 
offers a sharp contrast to the white backdrop and complements her light olive 
skin tone. Accessories, such as a simple silver necklace, lend a touch of elegance to the portrait.

Keep it succinct and to the point, focusing on the most salient details of the subject's most probable wardrobe.
Feel free to came up with details that are not present in the context, but that would make sense given the context.
Keep it short, just 1 or two sentences. Focus only on clothes from the shoulders up.
Answer only the question asked and don't make any reference to this instructions
`;
};

const getGenerateImagePrompt = (mainDescription: string, apparel: string) => {
  return `Create a professional headshot photograph set against a slightly grey background.
${mainDescription}. The lighting is studio quality, providing a 
flattering illumination to the subject's delicate facial features without 
casting any distracting shadows. ${apparel}. The composition is tightly framed, 
focusing on the subject from the shoulders up, which emphasizes her gentle smile. 
The overall effect is one of polished professionalism, ideal for use in business 
networking sites or company directories. Bright and well lit image
`;
};

export default {
  image: { 
    getGenerateImagePrompt,
    getApparelPrompt,
    getMainDescriptionPrompt,
  },
  customerJourney: {
    getShortAnswerPrompt,
    getBulletPointsAnswerPrompt,
    getOneWordAnswerPrompt,
    getShortDescriptionPrompt,
    getAboutMePrompt,
    getNamePrompt,
  },
};
