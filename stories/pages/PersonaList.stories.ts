import type { Meta, StoryObj } from "@storybook/react";

import PersonasGrid from "@/components/customer-journey/PersonasList";
import { PersonaList } from "@/types/components/persona";

const mockPersonas: PersonaList = [
  {
    id: "1",
    name: "John Doe",
    image_url:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
    shortDescription:
      "A visionary marketing manager with a passion for innovation.",
    title: "Marketing Manager",
    whoTheyAre: "Experienced marketer looking to leverage data",
    needs: "Better analytics tools and insights",
    challenges: "Keeping up with rapidly changing digital landscape",
    isSuggestion: false,
  },
  {
    id: "2",
    title: "Small Business Owner",
    whoTheyAre: "Entrepreneur managing a growing local business",
    needs: "Efficient tools for managing operations and finances",
    challenges: "Balancing multiple responsibilities and scaling the business",
    isSuggestion: true,
  },
  // Add more mock personas as needed
];

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Pages/PersonaGrid",
  component: PersonasGrid,
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
    personas: mockPersonas,
  },
} satisfies Meta<typeof PersonasGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

//More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Base: Story = {
  args: {
    personas: mockPersonas,
  },
};

export const Empty: Story = {
  args: {
    personas: [],
  },
};
