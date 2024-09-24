import ChatUI from "@/components/chat-components/Chat";
import { Chat, Message } from "@/types/database";
import type { Meta, StoryObj } from "@storybook/react";

const myChat: Chat = {
  context: "test",
  created_at: "2021-10-01T00:00:00.000Z",
  deleted_at: null,
  description: "test",
  display_info: null,
  id: "1",
  is_first_interaction: true,
  last_message_id_in_context: null,
  object_context_id: null,
  progress: 0,
  state: "test",
  status: "in_progress",
  substep_id: null,
  title: "test",
  updated_at: "2021-10-01T00:00:00.000Z",
  user_id: "1",
};

const myMessages: Message[] = [
  {
    id: "sddsff",
    content: "Hello!",
    role: "user",
    user_id: "1",
    chat_id: "1",
  },
  {
    id: "adfsdf",
    content: "Hi there!",
    role: "assistant",
    user_id: "1",
    chat_id: "1",
  },
];

const handleSendMessage = async (content: string) => {
  // wait some time to simulate sending a message
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Pages/Chat",
  component: ChatUI,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    chat: myChat,
    messages: myMessages,
    handleSendMessage,
  },
} satisfies Meta<typeof ChatUI>;

export default meta;
type Story = StoryObj<typeof meta>;

//More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Base: Story = {
  args: {
    chat: myChat,
    messages: myMessages,
    handleSendMessage,
  },
};

export const multiplePersonas: Story = {
  args: {
    chat: {
      ...myChat,
      display_info: JSON.stringify({
        type: "multiplePersona",
        author: "assistant",
        old: null,
        current: {
          personas: [
            {
              id: "1",
              title: "The Startup Owner",
              whoTheyAre:
                "A young entrepreneur who is passionate about their new business",
              needs: "Help with marketing and sales",
              challenges: "Limited budget and resources",
            },
            {
              id: "2",
              title: "The Marketing Manager",
              whoTheyAre:
                "An experienced marketing professional looking to improve their skills",
              needs: "Training and resources",
              challenges: "Limited time and budget",
            },
            {
              id: "3",
              title: "The Product Manager",
              whoTheyAre:
                "A product manager who wants to learn more about their customers",
              needs: "Customer insights and feedback",
              challenges: "Limited resources and time",
            },
          ],
        },
      }),
    },
    messages: myMessages,
    handleSendMessage,
  },
};

export const persona: Story = {
  args: {
    chat: {
      ...myChat,
      display_info: JSON.stringify({
        type: "persona",
        author: "assistant",
        old: null,
        current: {
          name: "Patrick  Bateman",
          title: "The Startup Owner",
          shortDescription:
            "A visionary entrepreneur with a passion for innovation.",
          demographics: ["55 years old", "Male", "Urban dweller", "Tech-savvy"],
          psychographics: [
            "Risk-taker",
            "Early adopter",
            "Workaholic",
            "Ambitious",
          ],
          behavior: [
            "Frequently attends networking events",
            "Reads business books",
            "Uses productivity apps",
            "Invests in startups",
          ],
          needs: [
            "Funding for new ventures",
            "Mentorship",
            "Work-life balance",
            "Skilled team members",
          ],
        },
      }),
    },
    messages: myMessages,
    handleSendMessage,
  },
};

export const customerJourney: Story = {
  args: {
    chat: {
      ...myChat,
      display_info: JSON.stringify({
        type: "customerJourney",
        author: "assistant",
        old: null,
        current: {
          summary:
            "The customer discovers the product through online channels, researches thoroughly, makes an informed purchase, engages with the product and support, and ultimately becomes a brand advocate.",
          awareness: {
            trigger: "Realizes need for product",
            touchpoints: `Social media, search engines, Social media, search engines, Social media, search engines,`,
            action: "Explores options online",
          },
          consideration: {
            research: "Compares features and prices",
            touchpoints: "Product website, review sites",
            action: "Shortlists potential products",
          },
          purchase: {
            decision: "Chooses best fit product",
            touchpoints: "E-commerce platform, sales team",
            action: "Makes the purchase",
          },
          retention: {
            engagement: "Uses product regularly",
            touchpoints: "Customer support, product updates",
            action: "Provides feedback",
          },
          advocacy: {
            satisfaction: "Experiences value from product",
            touchpoints: "Social media, referral programs",
            action: "Recommends to others",
          },
        },
      }),
    },
    messages: myMessages,
    handleSendMessage,
  },
};

export const image: Story = {
  args: {
    chat: {
      ...myChat,
      display_info: JSON.stringify({
        type: "image",
        author: "assistant",
        old: null,
        current: {
          imagePrompt: `Create a professional headshot of a(n) [ethnicity] [gender] in their 
[age range] with [hair description]. They have a [demeanor] demeanor, wearing
a [clothing description] in a [background description]. 
The lighting is studio quality, highlighting their [facial features]. 
The picture should be light and bright. They may wear [accessories]. 
The composition is tightly framed from the shoulders up, emphasizing 
their [expression]. The overall effect should be polished and professional, 
suitable for [use case].`,
          imageUrl:
            "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
        },
      }),
    },
    messages: myMessages,
    handleSendMessage,
  },
};

export const aboutMe: Story = {
  args: {
    chat: {
      ...myChat,
      display_info: JSON.stringify({
        type: "aboutMe",
        author: "assistant",
        old: null,
        current: {
          aboutMe: `Patrick Bateman is a visionary entrepreneur with a passion for innovation. He is 55 years old
and lives in the city. He is a risk-taker and early adopter who is always looking for the next big thing.
Patrick frequently attends networking events, reads business books, and uses productivity apps to stay
organized. He invests in startups and is always looking for new opportunities to grow his business.
Patrick is looking for funding for new ventures, mentorship, work-life balance, and skilled team members
to help him achieve his goals.`,
        },
      }),
    },
    messages: myMessages,
    handleSendMessage,
  },
};
