//This file contains all the templates for the chat prompts used in the app.


const getMainDescriptionPrompt = (context: string) => {
  return `Context: ${context}

Giving the previous context of the subject generate a description like the following:
Example: The image features an Asian female who appears to be in her late 20s. 
The subject of the photo has long, straight black hair and presents with a 
poised and confident demeanor.

Keep it succinct and to the point, focusing on the most salient details of the subject's most probable appearance.
Feel free to came up with details that are not present in the context, but that would make sense given the context.
Keep it short. Don't mention clothes.
Answer only the question asked and don't make any reference to this instructions
`
};

const getApparelPrompt = (context: string) => {
  return `${context}

Giving the previous context of the subject generate a description of the apparel like the following:
Example: She is wearing a deep blue blouse, which 
offers a sharp contrast to the white backdrop and complements her light olive 
skin tone. Accessories, if present, such as a simple silver necklace, 
lend a touch of elegance to the portrait.

Keep it succinct and to the point, focusing on the most salient details of the subject's most probable wardrobe.
Feel free to came up with details that are not present in the context, but that would make sense given the context.
Keep it short. Focus only on clothes from the shoulders up.
Answer only the question asked and don't make any reference to this instructions
`
};


const getGenerateImagePrompt = (mainDescription: string, apparel:string) => {
  return `Create a professional headshot photograph set against a seamless white background.
${mainDescription}. The lighting is studio quality, providing a 
flattering illumination to the subject's delicate facial features without 
casting any distracting shadows. ${apparel}. The composition is tightly framed, 
focusing on the subject from the shoulders up, which emphasizes her gentle smile. 
The overall effect is one of polished professionalism, ideal for use in business 
networking sites or company directories. Bright and well lit image
`;
};


export default {
  getGenerateImagePrompt,
  getApparelPrompt,
  getMainDescriptionPrompt
};
