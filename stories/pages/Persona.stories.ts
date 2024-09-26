import PersonaProfileUI from "@/components/customer-journey/Persona";
import { FullPersona } from "@/types/components/persona";
import type { Meta, StoryObj } from "@storybook/react";

const mockPersona: FullPersona = {
  id: "1",
  name: "John Doe",
  title: "The Startup Owner",
  isFinished: true,
  image_url: "https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp",
  aboutMe: `John Doe is a visionary startup owner with a passion for innovation and growth.
    He is looking to take his business to the next level and needs help with marketing and sales.
    John struggles with finding the right audience for his product and is seeking guidance on how to reach them.
    `,
  shortDescription:
    "A visionary startup owner with a passion for innovation and growth.",
  shortInformation: {
    whoTheyAre:
      "John Doe is a startup owner who is looking to grow his business.",
    needs: "John needs help with marketing and sales.",
    challenges:
      "John struggles with finding the right audience for his product.",
  },
  details: {
    demographics: [
      "Age: 25-35",
      "Location: San Francisco, CA",
      "Income: $50,000 - $100,000",
      "Education: College Graduate",
    ],
    psychographics: [
      "Interests: Technology, Startups, Marketing",
      "Personality: Extroverted, Ambitious, Creative",
      "Values: Innovation, Growth, Impact",
    ],
    behavior: [
      "Online: Active on LinkedIn, Twitter, and Instagram",
      "Offline: Attends local networking events and conferences",
      "Purchasing: Buys tech gadgets and books on entrepreneurship",
    ],
    needs: [
      "Marketing: Needs help with social media marketing",
      "Sales: Needs help with lead generation",
      "Product: Needs feedback on new product features",
    ],
  },
  customerJourney: {
    awareness: {
      main: "John sees an ad on Facebook for a marketing course.",
      touchpoints: "John reads a blog post about marketing strategies.",
      action: "John signs up for a free marketing webinar.",
    },
    consideration: {
      main: "John researches marketing agencies in his area.",
      touchpoints:
        "John attends a marketing workshop at a local co-working space.",
      action: "John schedules a consultation with a marketing agency.",
    },
    purchase: {
      main: "John decides to hire a marketing agency for his business.",
      touchpoints: "John meets with the agency to discuss his marketing needs.",
      action:
        "John signs a contract with the agency to start marketing services.",
    },
    retention: {
      main: "John receives monthly reports on marketing performance.",
      touchpoints: "John attends a marketing strategy session with the agency.",
      action: "John renews his contract with the agency for another year.",
    },
    advocacy: {
      main: "John is happy with the results of the marketing campaign.",
      touchpoints: "John refers a friend to the marketing agency.",
      action: "John leaves a positive review for the agency online.",
    },
    summary: `
          John Doe is a startup owner who is looking to grow his business.
          He needs help with marketing and sales, and struggles with finding the right audience for his product.
          John is active online and offline, and buys tech gadgets and books on entrepreneurship.
          He is interested in technology, startups, and marketing, and values innovation, growth, and impact.
          John's customer journey includes awareness, consideration, purchase, retention, and advocacy stages.
          He sees an ad on Facebook for a marketing course, researches marketing agencies, and decides to hire an agency.
          John receives monthly reports on marketing performance, refers a friend to the agency, and leaves a positive review online.
          `,
  },
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Pages/Persona",
  component: PersonaProfileUI,
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
    persona: mockPersona,
  },
} satisfies Meta<typeof PersonaProfileUI>;

export default meta;
type Story = StoryObj<typeof meta>;

//More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Base: Story = {
  args: {
    persona: mockPersona,
  },
};
